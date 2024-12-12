import { WebSocketServer } from "ws";
import { parse } from "url";
import { Manager } from "./Manager";
import { CustomManager } from "./Custom/CustomManager";

const ws = new WebSocketServer({ port: 3001 });
const manager = new Manager();
const customManager = new CustomManager();

ws.on("connection", (socket, req) => {
  const parsedUrl = req ? parse(req.url || "", true) : { query: {} };
  //@ts-ignore
  const email = parsedUrl.query?.email;
  //@ts-ignore
  const type = parsedUrl.query?.type;
  // console.log(parsedUrl);
  

  if (email && type !== "custom") {
    manager.addUser(socket, email);
  } else if (email && type === "custom") {
    console.log(type);
    console.log(email);

    customManager.addUser(socket, email);
  } else {
    console.log("Connection attempted without email");
    socket.close();
  }

  socket.on("close", () => {
    manager.removeUser(socket);
  });
});
