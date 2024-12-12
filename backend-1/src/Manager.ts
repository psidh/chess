import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./Messages";
import { Game } from "./Game";
import { PrismaClient } from "@prisma/client";
import { User } from "./interfaces";

const prisma = new PrismaClient();

export class Manager {
  private games: Game[];
  private pendingUser: { socket: WebSocket; userId: number } | null;
  private users: { socket: WebSocket; userId: number }[];
  private user1: User = {
    email: "",
    rating: 0,
  };
  private user2: User = {
    email: "",
    rating: 0,
  };

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
      if (this.user1.email === "") {
        this.user1.email = user.email;
        this.user1.rating = user.rating;
        console.log("User 1: email", this.user1.email);
        
      } else {
        this.user2.email = user.email;
        this.user2.rating = user.rating;
        console.log("User 2: email", this.user2.email);
      }

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
            userId,
            this.user1,
            this.user2
          );

          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = { socket, userId };
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
