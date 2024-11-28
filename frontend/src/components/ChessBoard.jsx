import React, { useState } from 'react';

export default function ChessBoard({ chess, board, socket, email, setBoard }) {
  const [from, setFrom] = useState(null);

  const handleSquareClick = (squareRepresentation) => {
    if (!from) {
      setFrom(squareRepresentation);
    } else {
      socket.send(
        JSON.stringify({
          type: 'move',
          payload: {
            email: email,
            move: { from, to: squareRepresentation },
          },
        })
      );

      setFrom(null);
      chess.move({
        from,
        to : squareRepresentation
      })
      setBoard(chess.board());
      console.log('Move sent:', { from, to: squareRepresentation });
    }
  };

  return (
    <div className="text-white-200">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            const squareRepresentation = `${String.fromCharCode(97 + j)}${
              8 - i
            }`;

            return (
              <div
                key={j}
                onClick={() => handleSquareClick(squareRepresentation)}
                className={`w-16 h-16 flex items-center justify-center ${
                  (i + j) % 2 === 0 ? 'bg-[#68ab41]' : 'bg-[#DBFFD0FF]'
                }`}
              >
                {square ? (
                  <img
                    src={`/piece/${encodeURIComponent(
                      square.color === 'b'
                        ? `${square.type.toUpperCase()} Black.png`
                        : `${square.type.toUpperCase()} White.png`
                    )}`}
                    alt="chess-piece"
                    className="w-8 h-8"
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
