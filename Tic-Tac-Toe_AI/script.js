const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.getElementById('restart').addEventListener('click', resetGame);

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    cell.innerText = currentPlayer;
    checkResult();

    if (gameActive) {
        currentPlayer = 'O';
        statusDisplay.innerText = "AI's turn...";
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    const bestMove = minimax(board, 'O');
    board[bestMove.index] = 'O';
    cells[bestMove.index].innerText = 'O';
    
    checkResult();
    if (gameActive) {
        currentPlayer = 'X';
        statusDisplay.innerText = "Your turn!";
    }
}

function checkResult() {
    let roundWon = false;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        statusDisplay.innerText = `${currentPlayer} wins!`;
        return;
    }

    if (!board.includes('')) {
        gameActive = false;
        statusDisplay.innerText = 'Draw!';
        return;
    }
}

function resetGame() {
    board.fill('');
    cells.forEach(cell => (cell.innerText = ''));
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.innerText = "Your turn!";
}

// Minimax algorithm
function minimax(newBoard, player) {
    const emptyCells = newBoard.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);
    
    if (checkWin(newBoard, 'X')) return { score: -10 };
    if (checkWin(newBoard, 'O')) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    const moves = [];

    for (let i of emptyCells) {
        const move = {};
        move.index = i;
        newBoard[i] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[i] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    return bestMove;
}

function checkWin(board, player) {
    return winningConditions.some(condition =>
        condition.every(index => board[index] === player)
    );
}
