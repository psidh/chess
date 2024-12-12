import { WebSocketServer } from 'ws';
import { MineManager } from './MineManager';

const wss = new WebSocketServer({ port: 8080 });

const manager = new MineManager();

wss.on('connection', (ws) => {
  console.log('New client connected');

  manager.addUser(ws);

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });
});
