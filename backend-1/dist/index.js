"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const url_1 = require("url");
const Manager_1 = require("./Manager");
const ws = new ws_1.WebSocketServer({ port: 3001 });
const manager = new Manager_1.Manager();
ws.on("connection", (socket, req) => {
    var _a;
    const parsedUrl = req ? (0, url_1.parse)(req.url || "", true) : { query: {} };
    //@ts-ignore
    const email = (_a = parsedUrl.query) === null || _a === void 0 ? void 0 : _a.email;
    if (email) {
        manager.addUser(socket, email);
    }
    else {
        console.log("Connection attempted without email");
        socket.close();
    }
    socket.on("close", () => {
        manager.removeUser(socket);
    });
});
