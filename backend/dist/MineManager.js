"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MineManager = void 0;
const Messages_1 = require("./Messages");
const Game_1 = require("./Game");
class MineManager {
    constructor() {
        this.user = null;
        this.games = [];
    }
    addUser(socket) {
        this.user = socket;
        this.matchMaker(this.user);
    }
    removeUser(socket) {
        this.games = this.games.filter((game) => { var _a; return ((_a = game.user) === null || _a === void 0 ? void 0 : _a.socket) !== socket; });
    }
    matchMaker(socket) {
        socket.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === Messages_1.INIT_GAME) {
                    const game = new Game_1.Game(socket);
                    this.games.push(game);
                    socket.send(JSON.stringify({
                        message: Messages_1.INIT_GAME,
                        payload: {
                            board: game.user.board,
                            points: game.user.points,
                        },
                    }));
                }
                if (message.type === Messages_1.INPUT) {
                    const game = this.games.find((game) => game.user.socket === socket);
                    if (game) {
                        game.handleInput(socket, message.payload.x, message.payload.y);
                    }
                }
                if (message.type === Messages_1.END) {
                    socket.send(JSON.stringify({ message: 'game ended' }));
                }
            }
            catch (error) {
                console.error('Error processing message:', error);
                socket.send(JSON.stringify({ error: 'Invalid message format' }));
            }
        });
    }
}
exports.MineManager = MineManager;
