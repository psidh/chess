"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const Messages_1 = require("./Messages");
// import { getColor } from './utils/Color';
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Game {
    constructor(player1, player2, player1Id, player2Id) {
        this.gameId = null;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.initializeGame(player1Id, player2Id);
        this.player1.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: {
                color: 'white',
            },
        }));
        this.player2.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: {
                color: 'black',
            },
        }));
    }
    initializeGame(player1Id, player2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield prisma.game.create({
                    data: {
                        player1Id,
                        player2Id,
                        startedAt: new Date(),
                    },
                });
                this.gameId = game.gameId;
                console.log('Game initialized with ID:', game.gameId);
            }
            catch (error) {
                console.error('Error initializing game:', error);
            }
        });
    }
    makeMove(socket, move, color) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.board.turn() === 'w' && socket !== this.player1)
                return;
            if (this.board.turn() === 'b' && socket !== this.player2)
                return;
            const result = this.board.move(move);
            if (!result) {
                console.log('Invalid move:', move);
                socket.send(JSON.stringify({
                    type: Messages_1.ERROR,
                    payload: 'Invalid move',
                }));
            }
            const nextPlayer = this.board.turn() === 'w' ? this.player1 : this.player2;
            nextPlayer.send(JSON.stringify({
                type: Messages_1.MOVE,
                payload: move,
            }));
            if (this.gameId) {
                try {
                    yield prisma.move.create({
                        data: {
                            gameId: this.gameId,
                            from: move.from,
                            to: move.to,
                            color,
                            moveAt: new Date(),
                        },
                    });
                    console.log('Move saved:', move);
                }
                catch (error) {
                    console.error('Error saving move:', error);
                }
            }
            if (this.board.isGameOver()) {
                const winner = this.board.turn() === 'w' ? 'black' : 'white';
                this.player1.send(JSON.stringify({
                    type: Messages_1.GAME_OVER,
                    payload: { winner },
                }));
                this.player2.send(JSON.stringify({
                    type: Messages_1.GAME_OVER,
                    payload: { winner },
                }));
                if (this.gameId) {
                    try {
                        yield prisma.game.update({
                            where: { gameId: this.gameId },
                            data: {
                                winner,
                                endedAt: new Date(),
                            },
                        });
                        console.log('Game over. Winner:', winner);
                    }
                    catch (error) {
                        console.error('Error updating game:', error);
                    }
                }
            }
        });
    }
}
exports.Game = Game;
