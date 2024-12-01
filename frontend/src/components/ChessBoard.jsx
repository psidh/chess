import React, { useState } from "react";

export default function ChessBoard({
  color,
  chess,
  board,
  socket,
  email,
  setBoard,
}) {
  const [from, setFrom] = useState(null);

  const handleSquareClick = (squareRepresentation) => {
    if (!from) {
      setFrom(squareRepresentation);
    } else {
      socket.send(
        JSON.stringify({
          type: "move",
          payload: {
            email: email,
            move: { from, to: squareRepresentation },
          },
        })
      );

      setFrom(null);
      chess.move({
        from,
        to: squareRepresentation,
      });
      setBoard(chess.board());
      console.log("Move sent:", { from, to: squareRepresentation });
    }
  };

  return (
    <div
      className={`text-white-200 ${
        color === "black" ? "transform rotate-180" : ""
      }`}
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((square, colIndex) => {
            const squareRepresentation = `${String.fromCharCode(
              97 + colIndex
            )}${8 - rowIndex}`;

            return (
              <div
                key={colIndex}
                onClick={() => handleSquareClick(squareRepresentation)}
                className={`w-16 h-16 flex items-center justify-center ${
                  (rowIndex + colIndex) % 2 === 0
                    ? "bg-[#68ab41]"
                    : "bg-[#DBFFD0FF]"
                } ${color === "black" ? "transform rotate-180" : ""}`}
              >
                {square ? (
                  <img
                    src={`/piece/${encodeURIComponent(
                      square.color === "b"
                        ? `${square.type.toUpperCase()} Black.png`
                        : `${square.type.toUpperCase()} White.png`
                    )}`}
                    alt="chess-piece"
                    className={`w-8 h-8}`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
