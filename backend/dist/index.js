"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const MineManager_1 = require("./MineManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const manager = new MineManager_1.MineManager();
wss.on('connection', (ws) => {
    console.log('New client connected');
    manager.addUser(ws);
    ws.on('error', (err) => {
        console.error('WebSocket error:', err.message);
    });
});
