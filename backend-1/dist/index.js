"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const url_1 = require("url");
const Manager_1 = require("./Manager");
const CustomManager_1 = require("./Custom/CustomManager");
const ws = new ws_1.WebSocketServer({ port: 3001 });
const manager = new Manager_1.Manager();
const customManager = new CustomManager_1.CustomManager();
ws.on("connection", (socket, req) => {
    var _a, _b;
    const parsedUrl = req ? (0, url_1.parse)(req.url || "", true) : { query: {} };
    //@ts-ignore
    const email = (_a = parsedUrl.query) === null || _a === void 0 ? void 0 : _a.email;
    //@ts-ignore
    const type = (_b = parsedUrl.query) === null || _b === void 0 ? void 0 : _b.type;
    // console.log(parsedUrl);
    if (email && type !== "custom") {
        manager.addUser(socket, email);
    }
    else if (email && type === "custom") {
        console.log(type);
        console.log(email);
        customManager.addUser(socket, email);
    }
    else {
        console.log("Connection attempted without email");
        socket.close();
    }
    socket.on("close", () => {
        manager.removeUser(socket);
    });
});
