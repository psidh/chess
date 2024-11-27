'use client';
import ChessBoard from '@/components/ChessBoard';
import Button from '@/components/Button';
import { useSocket } from '@/hooks/useSocket';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Chess } from 'chess.js';
import toast from 'react-hot-toast';
import { signOut } from 'next-auth/react';

export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const GAME_OVER = 'game_over';
export const ERROR = 'error';

export default function Page() {
  const session = useSession();
  const email = session?.data?.user?.email;
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [start, setStart] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const [buttonState, setButtonState] = useState('New Game');

  useEffect(() => {
    if (!socket || session.status !== 'authenticated') return;
    const userEmail = session?.data?.user?.email;
    console.log('User Email :  ' + userEmail);

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          setPlayerColor(message.payload.color);
          console.log('Game initialized with color:', message.payload.color);
          toast.success('Game initialized with color:', message.payload.color);
          setStart(true);
          setButtonState('Over');
          break;

        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log('Move received and applied:', move);
          break;

        case GAME_OVER:
          const { winner } = message.payload;
          toast.success(`Game Over! Winner is ${winner}`);
          break;

        case ERROR:
          toast.error(ERROR);
        default:
          alert('Unknown message type:', message.type);
      }
    };
    socket.onmessage = handleMessage;

    return () => {
      socket.onmessage = null;
    };
  }, [socket, chess, session.status]);

  const handleNewGame = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open or initialized');
      return;
    }

    socket.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: { email: email },
      })
    );
    setButtonState('Waiting for Opponent...');
  };

  if (!socket) {
    return (
      <div className="bg-black flex flex-col items-center justify-center h-screen">
        <img src="/loader.webp" alt="loader" />
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse items-center justify-center gap-12 min-h-screen bg-gradient-to-b from-neutral-800 to-neutral-900 p-12">
      <a href="/api/auth/signout" className="bg-red-800 py-3 px-6 rounded-md">
        signOut
      </a>
      <ChessBoard socket={socket} board={board} email={email} />

      {!start && (
        <Button
          onClick={handleNewGame}
          className="bg-green-800 py-3 px-6 rounded-md"
        >
          {buttonState}
        </Button>
      )}
    </div>
  );
}
