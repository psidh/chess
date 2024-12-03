"use client";
import ChessBoard from "@/components/ChessBoard";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UserCard from "@/components/UserCard";
import {
  INIT_GAME,
  ERROR,
  GAME_OVER,
  MOVE,
} from "@/lib/Messages";
import { useRecoilState } from "recoil";
import { emailAtom } from "@/recoil-persist/emailAtom";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useRecoilState(emailAtom);
  const socket = useSocket("random");
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [start, setStart] = useState(false);
  const [buttonState, setButtonState] = useState("New Game");
  const [color, setColor] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [opponent, setOpponent] = useState({
    email: "",
    rating: 0,
  });
  const [user, setUser] = useState({
    email: "",
    rating: 0,
  });

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case ERROR:
          toast.error(message.payload);
          break;

        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          toast.success(
            `Game initialized with color: ${message.payload.color}`
          );
          console.log(message.payload.color);
          setOpponent(message.payload.opponent);
          setUser(message.payload.you);
          setColor(message.payload.color);
          setStart(true);
          setButtonState("Over");
          break;

        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          console.log("Move received and applied:", move);
          break;

        case GAME_OVER:
          const { winner } = message.payload;
          setGameOver(true);
          toast.success(`Game Over! Winner is ${winner}`);
          break;

        default:
          alert("Unknown message type:", message.type);
      }
    };

    socket.onmessage = handleMessage;

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket, chess]);

  const handleNewGame = () => {
    if (!email) {
      console.error("User is not authenticated or email is unavailable");
      return;
    }

    if (!socket) {
      setEmail(email);
    } else if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: INIT_GAME,
          payload: { email: email },
        })
      );
      setButtonState("Waiting for Opponent...");
    } else {
      console.error("WebSocket is not open");
    }
  };

  if (!email) {
    return (
      <div className="bg-black flex flex-col items-center justify-center h-screen">
        <img src="/loader.webp" alt="loader" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-12 min-h-screen bg-gradient-to-b from-neutral-000 to-black p-12">
        <UserCard who={"opp"} email={opponent.email} rating={opponent.rating} />
        <ChessBoard
          setBoard={setBoard}
          chess={chess}
          socket={socket}
          board={board}
          email={email}
          color={color}
        />
        <UserCard
          who={"you"}
          email={user.email}
          rating={user.rating}
        />
        {!start && (
          <Button
            onClick={handleNewGame}
            className="bg-green-800 py-3 px-6 rounded-md"
          >
            {buttonState}
          </Button>
        )}
        {gameOver ? (
          <button
            onClick={() => {
              router.push("/home");
            }}
            className="bg-neutral-800 border border-neutral-600 py-3 px-6 rounded-md"
          >
            Get Back to Home
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
