import { WebSocket } from "ws";
import { INIT_CUSTOM_GAME, INIT_GAME, MOVE } from "../Messages";
import { CustomGame } from "./CustomGame";
import { PrismaClient } from "@prisma/client";
import { User } from "../interfaces";

const prisma = new PrismaClient();

export class CustomManager {
  private games: CustomGame[];
  private pendingUser: {
    socket: WebSocket;
    userId: number;
    gameId?: number;
  } | null;
  private users: { socket: WebSocket; userId: number; gameId?: number }[];
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
        console.log("under user1 log: " + user.email);
        this.user1.email = user.email;
        this.user1.rating = user.rating;
        console.log(this.user1);
      } else {
        console.log(user.email);
        this.user2.email = user.email;
        this.user2.rating = user.rating;
        console.log(this.user2);
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

      if (message.type === INIT_CUSTOM_GAME) {
        const code = message.payload.code;
        if (this.pendingUser && this.pendingUser.gameId == code) {
          const game = new CustomGame(
            this.pendingUser?.socket,
            socket,
            this.pendingUser?.userId,
            userId,
            this.user1,
            this.user2,
            Number(code)
          );

          this.games.push(game);
          console.log(
            "Game initialized with players:",
            this.pendingUser.userId,
            userId
          );
          this.pendingUser = null;
        } else {
          this.pendingUser = { socket, userId, gameId : message.payload.code };
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
