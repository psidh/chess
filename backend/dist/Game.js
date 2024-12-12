"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Validator_1 = require("./Validator");
const Messages_1 = require("./Messages");
const validTiles = [0, 1, 2, 5];
class Game {
    constructor(socket) {
        this.user = {
            socket: null,
            points: 0,
            board: [],
        };
        this.user.socket = socket;
        this.user.points = 0;
        this.user.board = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => validTiles[Math.floor(Math.random() * validTiles.length)]));
    }
    handleInput(socket, x, y) {
        if (!this.user || !this.user.board) {
            console.error('Game state not initialized.');
            return;
        }
        const result = (0, Validator_1.validator)(this.user.board, x, y, this.user.points);
        if (result) {
            this.user.points = result.points;
            this.user.board = result.board;
            socket.send(JSON.stringify({
                message: Messages_1.INPUT,
                payload: {
                    points: result.points,
                    board: result.board,
                    gameOver: result.points === -1,
                },
            }));
            if (result.points === -1) {
                // Reveal full board on game over.
                socket.send(JSON.stringify({
                    message: Messages_1.END,
                    payload: { board: this.user.board },
                }));
            }
        }
        else {
            socket.send(JSON.stringify({ error: 'Invalid move' }));
        }
    }
}
exports.Game = Game;
