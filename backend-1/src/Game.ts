import { Chess } from 'chess.js';
import { WebSocket } from 'ws';
import { ERROR, GAME_OVER, INIT_GAME, MOVE } from './Messages';
// import { getColor } from './utils/Color';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;
  private gameId: number | null = null;

  constructor(
    player1: WebSocket,
    player2: WebSocket,
    player1Id: number,
    player2Id: number
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();

    this.initializeGame(player1Id, player2Id);

    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: 'white',
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: 'black',
        },
      })
    );
  }

  async initializeGame(player1Id: number, player2Id: number) {
    try {
      const game = await prisma.game.create({
        data: {
          player1Id,
          player2Id,
          startedAt: new Date(),
        },
      });

      this.gameId = game.gameId;
      console.log('Game initialized with ID:', game.gameId);
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }

  async makeMove(
    socket: WebSocket,
    move: { from: string; to: string },
    color: string
  ) {
    if (this.board.turn() === 'w' && socket !== this.player1) return;
    if (this.board.turn() === 'b' && socket !== this.player2) return;

    const result = this.board.move(move);

    if (!result) {
      console.log('Invalid move:', move);
      socket.send(
        JSON.stringify({
          type: ERROR,
          payload: 'Invalid move',
        })
      );
    }

    const nextPlayer = this.board.turn() === 'w' ? this.player1 : this.player2;
    nextPlayer.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );

    if (this.gameId) {
      try {
        await prisma.move.create({
          data: {
            gameId: this.gameId,
            from: move.from,
            to: move.to,
            color,
            moveAt: new Date(),
          },
        });

        console.log('Move saved:', move);
      } catch (error) {
        console.error('Error saving move:', error);
      }
    }

    if (this.board.isGameOver()) {
      const winner = this.board.turn() === 'w' ? 'black' : 'white';
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

      if (this.gameId) {
        try {
          await prisma.game.update({
            where: { gameId: this.gameId },
            data: {
              winner,
              endedAt: new Date(),
            },
          });
          console.log('Game over. Winner:', winner);
        } catch (error) {
          console.error('Error updating game:', error);
        }
      }
    }
  }
}
