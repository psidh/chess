import { WebSocketServer } from "ws";
import { parse } from "url";
import { Manager } from "./Manager";

const ws = new WebSocketServer({ port: 3001 });
const manager = new Manager();

ws.on("connection", (socket, req) => {
  const parsedUrl = req ? parse(req.url || "", true) : { query: {} };
  //@ts-ignore
  const email = parsedUrl.query?.email;

  if (email) {
    manager.addUser(socket, email);
  } else {
    console.log("Connection attempted without email");
    socket.close();
  }

  socket.on("close", () => {
    manager.removeUser(socket);
  });
});
