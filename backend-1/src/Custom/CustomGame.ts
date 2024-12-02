import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { ERROR, GAME_OVER, INIT_CUSTOM_GAME, MOVE } from "../Messages";
// import { getColor } from './utils/Color';
import { PrismaClient } from "@prisma/client";
import { User } from "../interfaces";

const prisma = new PrismaClient();

export class CustomGame {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;
  private gameId: number | null = null;
  private user1: User = {
    email: "",
    rating: 0,
  };
  private user2: User = {
    email: "",
    rating: 0,
  };

  constructor(
    player1: WebSocket,
    player2: WebSocket,
    player1Id: number,
    player2Id: number,
    user1: User,
    user2: User,
    gameId: number
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.user1 = user1;
    this.user2 = user2;
    this.gameId = gameId;
    this.initializeGame(player1Id, player2Id, gameId);

    this.player1.send(
      JSON.stringify({
        type: INIT_CUSTOM_GAME,
        payload: {
          color: "white",
          opponent: user2,
          you: user1,
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: INIT_CUSTOM_GAME,
        payload: {
          color: "black",
          opponent: user1,
          you: user2,
        },
      })
    );
  }

  async initializeGame(player1Id: number, player2Id: number, gameId: number) {
    try {
      console.log(typeof gameId);
      
      const game = await prisma.game.create({
        data: {
          gameId,
          player1Id,
          player2Id,
          startedAt: new Date(),
        },
      });

      console.log("Game initialized with ID:", game.gameId);
    } catch (error) {
      console.error("Error initializing game:", error);
    }
  }

  async makeMove(
    socket: WebSocket,
    move: { from: string; to: string },
    color: string
  ) {
    if (this.board.turn() === "w" && socket !== this.player1) return;
    if (this.board.turn() === "b" && socket !== this.player2) return;

    let result;

    try {
      result = this.board.move(move);
    } catch (error: any) {
      console.error("Error during move:", error.message);
      socket.send(
        JSON.stringify({
          type: ERROR,
          payload: "Invalid move. Please try again",
        })
      );
      return;
    }

    if (result) {
      const nextPlayer =
        this.board.turn() === "w" ? this.player1 : this.player2;
      nextPlayer.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      );

      if (this.gameId) {
        try {
          const res = await prisma.move.create({
            data: {
              gameId: this.gameId,
              from: move.from,
              to: move.to,
              color: color,
            },
          });
          console.log(res);
        } catch (error: any) {
          console.log(error.message);
        }
      }

      if (this.board.isGameOver()) {
        const winner = this.board.turn() === "w" ? "black" : "white";
        this.player1.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: { winner },
          })
        );
        this.player2.send(
          JSON.stringify({
            type: GAME_OVER,
            payload: { winner },
          })
        );

        await prisma.game.update({
          where: { gameId: this.gameId! },
          data: {
            winner,
            endedAt: new Date(),
          },
        });

        // const currentGame = await prisma.game.findFirst({
        //   where: {
        //     gameId: this.gameId!,
        //   },
        // });

        // const player1Id = currentGame.player1Id;
        // const player2Id = currentGame.player2Id;

        // await prisma.user.update({
        //   where: {
        //     userId: player1Id!,
        //   },
        //   data: {
        //     rating: {
        //       increment: 50,
        //     },
        //   },
        // });

        // await prisma.user.update({
        //   where: {
        //     userId: player1Id!,
        //   },
        //   data: {
        //     rating: {
        //       increment: 50,
        //     },
        //   },
        // });
      }
    } else {
      console.log("Invalid move:", move);
      socket.send(
        JSON.stringify({
          type: ERROR,
          payload: "Invalid move. Please try again",
        })
      );
    }
  }
}
