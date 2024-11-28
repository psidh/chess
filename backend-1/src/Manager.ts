import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./Messages";
import { Game } from "./Game";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class Manager {
  private games: Game[];
  private pendingUser: { socket: WebSocket; userId: number } | null;
  private users: { socket: WebSocket; userId: number }[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  async addUser(socket: WebSocket, email: string) {
    try {
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        console.log("User not found in database, add user level");
        return;
      }

      this.users.push({ socket, userId: user.userId });
      console.log("User added into the queue:", user.userId);

      this.matchMaker(socket, user.userId);
    } catch (error) {
      console.error("Error fetching user from database:", error);
    }
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user.socket !== socket);
  }

  private matchMaker(socket: WebSocket, userId: number) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          const game = new Game(
            this.pendingUser?.socket,
            socket,
            this.pendingUser?.userId,
            userId
          );

          this.games.push(game);
          console.log(
            "Game initialized with players:",
            this.pendingUser.userId,
            userId
          );
          this.pendingUser = null;
        } else {
          this.pendingUser = { socket, userId };
          console.log("User added to pending queue:", userId);
        }
      }

      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          const color = game.player1 === socket ? "white" : "black";
          game.makeMove(socket, message.payload.move, color);
        }
      }
    });
  }
}
