"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = validator;
let visited = Array.from({ length: 4 }, () => Array(4).fill(false));
function validator(board, x, y, points) {
    if (x < 0 || x >= board.length || y < 0 || y >= board[0].length) {
        console.log('Out of bounds coordinates');
        return null;
    }
    if (board[x][y] === 0) {
        console.log('You hit a bomb! 💣');
        console.log('Game Over');
        return { board, points: -1 }; // Special signal for game over.
    }
    const queue = [[x, y]];
    visited[x][y] = true;
    points += board[x][y];
    board[x][y] = -1; // Mark as revealed.
    const delRow = [-1, 0, 1, 0];
    const delCol = [0, 1, 0, -1];
    while (queue.length > 0) {
        const [row, col] = queue.shift();
        for (let k = 0; k < 4; k++) {
            const newRow = row + delRow[k];
            const newCol = col + delCol[k];
            if (newRow >= 0 &&
                newRow < board.length &&
                newCol >= 0 &&
                newCol < board[0].length &&
                board[newRow][newCol] !== -1 &&
                visited[newRow][newCol] === false) {
                points += board[newRow][newCol];
                visited[newRow][newCol] = true;
                board[newRow][newCol] = -1; // Mark as revealed.
                queue.push([newRow, newCol]);
            }
        }
    }
    return { board, points };
}