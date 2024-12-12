import { WebSocket } from 'ws';
import { END, INIT_GAME, INPUT } from './Messages';
import { Game } from './Game';

export class MineManager {
  private user: WebSocket | null;
  private games: Game[];
  constructor() {
    this.user = null;
    this.games = [];
  }

  public addUser(socket: WebSocket) {
    this.user = socket;
    this.matchMaker(this.user);
  }

  public removeUser(socket: WebSocket) {
    this.games = this.games.filter((game) => game.user?.socket !== socket);
  }

  public matchMaker(socket: WebSocket) {
    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === INIT_GAME) {
          const game = new Game(socket);
          this.games.push(game);
          socket.send(
            JSON.stringify({
              message: INIT_GAME,
              payload: {
                board: game.user.board,
                points: game.user.points,
              },
            })
          );
        }
        if (message.type === INPUT) {
          const game = this.games.find((game) => game.user.socket === socket);
          if (game) {
            game.handleInput(socket, message.payload.x, message.payload.y);
          }
        }
        if (message.type === END) {
          socket.send(JSON.stringify({ message: 'game ended' }));
        }
      } catch (error) {
        console.error('Error processing message:', error);
        socket.send(JSON.stringify({ error: 'Invalid message format' }));
      }
    });
  }
}
