import { WebSocket } from 'ws';
import { validator } from './Validator';
import { END, INPUT } from "./Messages";

const validTiles = [0, 1, 2, 5];

export class Game {
  public user: {
    socket: WebSocket | any;
    points: number;
    board: number[][] | any;
  } = {
    socket: null,
    points: 0,
    board: [],
  };

  constructor(socket: WebSocket) {
    this.user.socket = socket;
    this.user.points = 0;
    this.user.board = Array.from({ length: 4 }, () =>
      Array.from(
        { length: 4 },
        () => validTiles[Math.floor(Math.random() * validTiles.length)]
      )
    );
  }

  public handleInput(socket: WebSocket, x: number, y: number): void {
    if (!this.user || !this.user.board) {
      console.error('Game state not initialized.');
      return;
    }

    const result = validator(this.user.board, x, y, this.user.points);

    if (result) {
      this.user.points = result.points;
      this.user.board = result.board;

      socket.send(
        JSON.stringify({
          message: INPUT,
          payload: {
            points: result.points,
            board: result.board,
            gameOver: result.points === -1,
          },
        })
      );

      if (result.points === -1) {
        // Reveal full board on game over.
        socket.send(
          JSON.stringify({
            message: END,
            payload: { board: this.user.board },
          })
        );
      }
    } else {
      socket.send(JSON.stringify({ error: 'Invalid move' }));
    }
  }
}
