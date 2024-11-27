import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '@/recoil/userAtom';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const user = useRecoilValue(userState);
  console.log(user.email);

  useEffect(() => {
    if (user.email) {
      // Add email as query parameter
      const ws = new WebSocket(
        `ws://localhost:3001?email=${encodeURIComponent(user.email)}`
      );

      ws.onopen = () => {
        console.log('Connected to the socket...');
        setSocket(ws);
      };

      ws.onclose = () => {
        console.log('Connection closed');
        setSocket(null);
      };

      return () => {
        ws.close();
      };
    }
  }, [user.email]);

  return socket;
};
