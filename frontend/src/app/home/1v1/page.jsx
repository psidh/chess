"use client";
import ChessBoard from "@/components/ChessBoard";
import Button from "@/components/Button";
import { useRecoilState } from "recoil";
import { emailAtom } from "@/recoil-persist/emailAtom";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Chess } from "chess.js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UserCard from "@/components/UserCard";
import { INIT_CUSTOM_GAME, ERROR, GAME_OVER, MOVE } from "@/lib/Messages";
import Navbar from "@/components/Navbar";

export default function Page() {
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = useRecoilState(emailAtom);
  const socket = useSocket("custom");
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [start, setStart] = useState(false);
  const [buttonState, setButtonState] = useState("Generate Code");
  const [code, setCode] = useState(null);
  const [enterCode, setEnterCode] = useState(""); // State for the code input

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

        case INIT_CUSTOM_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          toast.success(
            `Game initialized with color: ${message.payload.color}`
          );
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

  const sendCode = () => {
    if (session.status !== "authenticated" || !session.data?.user?.email) {
      console.error("User is not authenticated or email is unavailable");
      return;
    }

    if (!socket) {
      setEmail(session.data.user.email);
    } else if (socket.readyState === WebSocket.OPEN) {
      let code1 = +Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");
      socket.send(
        JSON.stringify({
          type: INIT_CUSTOM_GAME,
          payload: {
            email: session.data.user.email,
            code: code1,
          },
        })
      );
      setCode(code1);
      setButtonState("Waiting for Opponent...");
    } else {
      console.error("WebSocket is not open");
    }
  };

  const joinGame = () => {
    if (session.status !== "authenticated" || !session.data?.user?.email) {
      console.error("User is not authenticated or email is unavailable");
      return;
    }

    if (!socket) {
      console.log(socket.url);
      setEmail(session.data.user.email);
    } else if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: INIT_CUSTOM_GAME,
          payload: {
            email: session.data.user.email,
            code: enterCode,
          },
        })
      );
      setButtonState("Waiting for Opponent...");
    } else {
      console.error("WebSocket is not open");
    }
  };

  if (session.status !== "authenticated") {
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
        {start ? (
          <>
            <UserCard
              who={"opp"}
              email={opponent.email}
              rating={opponent.rating}
            />
            <ChessBoard
              setBoard={setBoard}
              chess={chess}
              socket={socket}
              board={board}
              email={session.data.user.email}
              color={color}
            />
            <UserCard who={"you"} email={user.email} rating={user.rating} />
          </>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {code ? (
              <></>
            ) : (
              <div className="bg-neutral-800 border border-neutral-700 rounded-md p-4 gap-4 flex flex-col items-center justify-center">
                <input
                  type="text"
                  title="code"
                  placeholder="Enter your code"
                  className="bg-neutral-800 border border-neutral-700 rounded focus:outline-neutral-700 p-2"
                  value={enterCode} // Bind the value of the input field to the state
                  onChange={(e) => setEnterCode(e.target.value)} // Update the state when the user types
                />
                <button
                  onClick={joinGame} // Call joinGame when button is clicked
                  className="w-full px-4 py-2 bg-green-800 border border-green-500 rounded-md"
                >
                  Join Game
                </button>
              </div>
            )}
            <div className="bg-neutral-800 border border-neutral-700 rounded-md p-4 flex flex-col items-center justify-center">
              <button
                onClick={sendCode}
                className="px-4 py-2 bg-green-800 border border-green-500 rounded-md"
              >
                {" "}
                Generate Code
              </button>
              {code ? (
                <p className="p-4 text-xl font-bold ">{code}</p>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        )}
        {gameOver ? (
          <Button
            onClick={() => {
              router.push("/home");
            }}
            className="bg-red-800 bg-opacity-50 border border-red-600 py-3 px-6 rounded-md"
          >
            Get Back to Home
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
