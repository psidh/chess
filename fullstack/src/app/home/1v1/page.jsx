"use client";
import ChessBoard from "@/components/ChessBoard";
import Button from "@/components/Button";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UserCard from "@/components/UserCard";
import { INIT_CUSTOM_GAME, ERROR, GAME_OVER, MOVE } from "@/lib/Messages";
import Navbar from "@/components/Navbar";
import { useRecoilState } from "recoil";
import { emailAtom } from "@/recoil-persist/emailAtom";
import { Copy, CheckCircle } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useRecoilState(emailAtom);
  const socket = useSocket("custom");
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [start, setStart] = useState(false);
  const [buttonState, setButtonState] = useState("Generate Code");
  const [code, setCode] = useState("");
  const [enterCode, setEnterCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

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
    if (!email) {
      console.error("User is not authenticated or email is unavailable");
      return;
    }

    if (!socket) {
      console.log("Socket not connected");
    } else if (socket.readyState === WebSocket.OPEN) {
      let code1 = +Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 10)
      ).join("");
      socket.send(
        JSON.stringify({
          type: INIT_CUSTOM_GAME,
          payload: {
            email: email,
            code: code1,
          },
        })
      );
      setCode(code1.toString());
      setButtonState("Waiting for Opponent...");
    } else {
      console.error("WebSocket is not open");
    }
  };

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const joinGame = () => {
    if (!email) {
      console.error("User is not authenticated or email is unavailable");
      return;
    }

    if (!socket) {
      console.log(socket.url);
    } else if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: INIT_CUSTOM_GAME,
          payload: {
            email: email,
            code: enterCode,
          },
        })
      );
      setButtonState("Waiting for Opponent...");
    } else {
      console.error("WebSocket is not open");
    }
  };

  if (!email) {
    return (
      <div className="bg-neutral-900 flex flex-col items-center justify-center h-screen">
        <img src="/loader.webp" alt="loader" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center gap-12 mt-12 bg-neutral-950 p-12">
        {start ? (
          <div>
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
              email={email}
              color={color}
            />
            <UserCard who={"you"} email={user.email} rating={user.rating} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-neutral-800 p-6 rounded-2xl border border-neutral-700 gap-6 w-full md:w-1/2">
            {code ? (
              <></>
            ) : (
              <div className="bg-neutral-800 rounded-md p-4 gap-4 flex flex-col items-center justify-center">
                <input
                  type="text"
                  title="code"
                  placeholder="Enter your code"
                  className="bg-neutral-800 border border-neutral-700 rounded focus:outline-neutral-700 p-2 w-full "
                  value={enterCode}
                  onChange={(e) => setEnterCode(e.target.value)}
                />
                <button
                  onClick={joinGame}
                  className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md  hover:bg-neutral-600 transition-colors"
                >
                  Join Game
                </button>
              </div>
            )}
            <div className="bg-neutral-800 border border-neutral-700 rounded-md p-4 flex flex-col items-center justify-center ">
              <button
                onClick={sendCode}
                className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md  hover:bg-neutral-600 transition-colors"
              >
                Generate Code
              </button>
              {code ? (
                <div className="flex items-center gap-2 p-4">
                  <p className="text-xl font-bold ">{code}</p>
                  <button
                    onClick={copyToClipboard}
                    className="text-neutral-400 hover: transition-colors"
                    title={isCopied ? "Copied!" : "Copy to Clipboard"}
                  >
                    {isCopied ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
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
            className="bg-neutral-800 bg-opacity-80 border border-neutral-700 py-3 px-6 rounded-md  hover:bg-neutral-700 transition-colors"
          >
            Get Back to Home
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
