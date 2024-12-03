import { useEffect, useState } from "react";

import axios from "axios";

export const useSocket = (type) => {
  const [socket, setSocket] = useState(null);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/check");
      setEmail(response.data.email);
      console.log(response.data.email);
    };
    fetchData();
  }, []);
  
  

  useEffect(() => {
    if (email && type) {
      const ws = new WebSocket(
        `wss://obliged-krystal-p-sidharth42069-c7350fbe.koyeb.app/?email=${encodeURIComponent(
          email
        )}&type=${type}`
      );
      console.log(ws.url);
      console.log("Email: " + email);

      ws.onopen = () => {
        console.log("Connected to the socket...");
        setSocket(ws);
      };

      ws.onclose = () => {
        console.log("Connection closed");
        setSocket(null);
      };

      return () => {
        ws.close();
      };
    }
  }, [email]);

  return socket;
};
