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
    constructor(player1, player2, player1Id, player2Id, user1, user2) {
        this.gameId = null;
        this.user1 = {
            email: "",
            rating: 0,
        };
        this.user2 = {
            email: "",
            rating: 0,
        };
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.user1 = user1;
        this.user2 = user2;
        this.initializeGame(player1Id, player2Id);
        console.log("User 1: " + user1.email);
        console.log("User 2: " + user2.email);
        this.player1.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: {
                color: "white",
                opponent: user2,
                you: user1,
            },
        }));
        this.player2.send(JSON.stringify({
            type: Messages_1.INIT_GAME,
            payload: {
                color: "black",
                opponent: user1,
                you: user2,
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
                console.log("Game initialized with ID:", game.gameId);
            }
            catch (error) {
                console.error("Error initializing game:", error);
            }
        });
    }
    makeMove(socket, move, color) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.board.turn() === "w" && socket !== this.player1)
                return;
            if (this.board.turn() === "b" && socket !== this.player2)
                return;
            let result;
            try {
                result = this.board.move(move);
            }
            catch (error) {
                console.error("Error during move:", error.message); // Log the error
                socket.send(JSON.stringify({
                    type: Messages_1.ERROR,
                    payload: "Invalid move. Please try again",
                }));
                return;
            }
            if (result) {
                const nextPlayer = this.board.turn() === "w" ? this.player1 : this.player2;
                nextPlayer.send(JSON.stringify({
                    type: Messages_1.MOVE,
                    payload: move,
                }));
                if (this.gameId) {
                    try {
                        const res = yield prisma.move.create({
                            data: {
                                gameId: this.gameId,
                                from: move.from,
                                to: move.to,
                                color: color,
                            },
                        });
                        console.log(res);
                    }
                    catch (error) {
                        console.log(error.message);
                    }
                }
                if (this.board.isGameOver()) {
                    const winner = this.board.turn() === "w" ? "black" : "white";
                    this.player1.send(JSON.stringify({
                        type: Messages_1.GAME_OVER,
                        payload: { winner },
                    }));
                    this.player2.send(JSON.stringify({
                        type: Messages_1.GAME_OVER,
                        payload: { winner },
                    }));
                    yield prisma.game.update({
                        where: { gameId: this.gameId },
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
            }
            else {
                console.log("Invalid move:", move);
                socket.send(JSON.stringify({
                    type: Messages_1.ERROR,
                    payload: "Invalid move. Please try again",
                }));
            }
        });
    }
}
exports.Game = Game;
