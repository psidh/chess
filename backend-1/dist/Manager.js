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
exports.Manager = void 0;
const Messages_1 = require("./Messages");
const Game_1 = require("./Game");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Manager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield prisma.user.findUnique({ where: { email } });
                if (!user) {
                    console.log("User not found in database, add user level");
                    return;
                }
                this.users.push({ socket, userId: user.userId });
                console.log("User added into the queue:", user.userId);
                this.matchMaker(socket, user.userId);
            }
            catch (error) {
                console.error("Error fetching user from database:", error);
            }
        });
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user.socket !== socket);
    }
    matchMaker(socket, userId) {
        socket.on("message", (data) => {
            var _a, _b;
            const message = JSON.parse(data.toString());
            if (message.type === Messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game_1.Game((_a = this.pendingUser) === null || _a === void 0 ? void 0 : _a.socket, socket, (_b = this.pendingUser) === null || _b === void 0 ? void 0 : _b.userId, userId);
                    this.games.push(game);
                    console.log("Game initialized with players:", this.pendingUser.userId, userId);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = { socket, userId };
                    console.log("User added to pending queue:", userId);
                }
            }
            if (message.type === Messages_1.MOVE) {
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                if (game) {
                    const color = game.player1 === socket ? "white" : "black";
                    game.makeMove(socket, message.payload.move, color);
                }
            }
        });
    }
}
exports.Manager = Manager;
