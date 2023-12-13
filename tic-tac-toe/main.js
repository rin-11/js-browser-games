// Get the canvas element and its drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// Calculate the size of each cell in the grid
const cellSize = canvas.width / 3;

// Game state variables
let board = Array(3).fill().map(() => Array(3).fill(null)); // 3x3
let currentPlayer = 'X'; // Set the initial player to 'X'
let isTwoPlayer = false; // Flag to determine if the game mode is two-player


// Event listener for starting a game against the computer
document.getElementById('startComputerGame').addEventListener('click', () => {
    isTwoPlayer = false;
    startNewGame();
});

// Event listener for starting a two-player game
document.getElementById('startTwoPlayerGame').addEventListener('click', () => {
    isTwoPlayer = true;
    startNewGame();
});

canvas.addEventListener('click', (event) => {
    if (!isTwoPlayer && currentPlayer === 'O') {
        // If it's the computer's turn, ignore clicks
        return;
    }
    playGame(event);
});

// Starts a new game by resetting the board and drawing it
function startNewGame() {
    resetGame();
    currentPlayer = 'X'; // Player 'X' always starts first
    drawBoard();
}

// Draws the tic-tac-toe board and current state
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.strokeStyle = '#000'; // Line color for the grid
    ctx.lineWidth = 2; // Line width for the grid

    // Drawing the grid lines for the board
    for (let i = 1; i <= 2; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * (canvas.height / 3));
        ctx.lineTo(canvas.width, i * (canvas.height / 3));
        ctx.stroke();
    }
    // Drawing 'X' and 'O' on the board
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                ctx.fillText(cell, x * cellSize + cellSize / 2, y * (canvas.height / 3) + (canvas.height / 6));
            }
        });
    });
}
// Handles the logic for a player's move
function playGame(event) {
    const rect = canvas.getBoundingClientRect();
    // Determine the cell that was clicked
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / (canvas.height / 3));

   // Update the board if the clicked cell is empty
    if (board[y][x] === null) {
        board[y][x] = currentPlayer;
        // Check for win or draw condition
        if (checkWin(currentPlayer)) {
            setTimeout(() => alert(currentPlayer + ' wins!'), 100);
            resetGame();
            return;
        }
        if (isBoardFull()) {
            setTimeout(() => alert('It\'s a draw!'), 100);
            resetGame();
            return;
        }
        // Switch players and continue the game
        switchPlayer();
        // If it's a single player game and it's computer's turn, make a move
        if (!isTwoPlayer && currentPlayer === 'O') {
            setTimeout(aiMove, 100);
        }
    }
}

// Switches the current player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (!isBoardFull() && !checkWin('X') && !checkWin('O')) {
        drawBoard();
    }
}

// Computer's move in a single-player game
function aiMove() {
    // Collect all available moves
    let availableMoves = [];
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (board[y][x] === null) {
                availableMoves.push({ x, y });
            }
        }
    }

    // Choose a random move from the available ones
    if (availableMoves.length > 0) {
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        board[randomMove.y][randomMove.x] = 'O';
        // Check if the move results in a win for 'O'
        if (checkWin('O')) {
            setTimeout(() => alert('O wins!'), 100);
            resetGame();
            return;
        }
        // Switch to the next player
        switchPlayer();
    }
}

// Checks if the board is completely filled
function isBoardFull() {
    return board.every(row => row.every(cell => cell !== null));
}

// Checks if the given player has won
function checkWin(player) {
    // Check rows, columns, and diagonals for a win
    return (
        board.some(row => row.every(cell => cell === player)) ||
        [0, 1, 2].some(col => board.every(row => row[col] === player)) ||
        board[0][0] === player && board[1][1] === player && board[2][2] === player ||
        board[0][2] === player && board[1][1] === player && board[2][0] === player
    );
}

// Resets the game board to the initial state
function resetGame() {
    board = Array(3).fill().map(() => Array(3).fill(null));
    currentPlayer = 'X';
    drawBoard();
}

// Set font properties for drawing 'X' and 'O'
ctx.font = '48px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
drawBoard(); // Initial drawing of the board