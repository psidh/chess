import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { emailAtom } from "@/recoil-persist/emailAtom";
export const useSocket = (type) => {
  const [socket, setSocket] = useState(null);
  const [email, setEmail] = useRecoilState(emailAtom);
  console.log(email);
  
  useEffect(() => {
    if (email && type ) {
      const ws = new WebSocket(
        `wss://obliged-krystal-p-sidharth42069-c7350fbe.koyeb.app/?email=${encodeURIComponent(email)}&type=${type}`
      );
      console.log(ws.url);
      
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
