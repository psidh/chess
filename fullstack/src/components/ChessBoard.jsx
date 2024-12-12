import React, { useEffect, useState } from "react";

export default function ChessBoard({
  color,
  chess,
  board,
  socket,
  email,
  setBoard,
}) {
  const [from, setFrom] = useState(null);
  const [selectedMove, setSelectedMove] = useState(from);

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
    <>
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
                  className={`w-[48px] h-[48px] md:w-[72px] md:h-[72px] flex items-center justify-center ${
                    (rowIndex + colIndex) % 2 === 0
                      ? "bg-[#ecf8d5]"
                      : `${selectedMove ? + "bg-[#92e06e]"  : "bg-[#6db34c]"}`
                  } ${color === "black" ? "transform rotate-180" : ""} ${
                    selectedMove ? `opacity-50` : ""
                  }`}
                >
                  {square ? (
                    <img
                      src={`/piece/${encodeURIComponent(
                        square.color === "b"
                          ? `${square.type.toUpperCase()} Black.png`
                          : `${square.type.toUpperCase()} White.png`
                      )}`}
                      alt="chess-piece"
                      className={`h-7 w-7 sm:w-10 sm:h-10`}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
