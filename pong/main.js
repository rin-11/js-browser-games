// Access the canvas element from the HTML document
const canvas = document.getElementById('gameCanvas');
// Get the 2D rendering context for the canvas
const ctx = canvas.getContext('2d');

// Declare game-related variables
let ball, playerPaddle, aiPaddle, playerScore, aiScore, gameInterval;

// Initializes the game objects
function initGame() {
    // Set up the ball in the center with initial speed and direction
    ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speedX: 5, speedY: 5 };
    // Set up the player's paddle on the left side of the canvas
    playerPaddle = { x: 0, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };
    // Set up the AI's paddle on the right side of the canvas
    aiPaddle = { x: canvas.width - 10, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };
    // Initialize scores for the player and AI
    playerScore = 0;
    aiScore = 0;
}

// Function to draw game objects on the canvas
function draw() {
    // Clear the entire canvas to redraw the game frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set the color and draw the ball
    ctx.fillStyle = 'pink';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    ctx.fill();

    // Set the color and draw the player's paddle
    ctx.fillStyle = 'purple';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    // Draw the AI's paddle
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Set the color and font, then draw the scores
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Player: ${playerScore}`, 20, 30);
    ctx.fillText(`AI: ${aiScore}`, canvas.width - 100, 30);
}

// Update game logic
function update() {
    // Update the ball's position based on its speed
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Reverse the ball's vertical direction if it hits the top or bottom
    if (ball.y < 0 || ball.y > canvas.height) {
        ball.speedY *= -1;
    }

    // Reverse the ball's horizontal direction if it hits a paddle
    if (ball.x < 20 && ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.speedX *= -1;
    } else if (ball.x > canvas.width - 20 && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
        ball.speedX *= -1;
    }

    // Update AI's paddle position to follow the ball
    aiPaddle.y += (ball.y - aiPaddle.y - aiPaddle.height / 2) * 0.1;

    // Update the score and reset the ball if it goes past a paddle
    if (ball.x < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Stop the game if either player reaches a score of 10
    if (playerScore === 10 || aiScore === 10) {
        stopGame();
    }
}

// Resets the ball to the center with initial speed
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 5;
    ball.speedY = 5;
}

// Starts the game by initializing and setting the game loop
function startGame() {
    if (!gameInterval) {
        initGame();
        gameInterval = setInterval(() => {
            update();
            draw();
        }, 30);
    }
}

// Stops the game by clearing the game loop interval
function stopGame() {
    clearInterval(gameInterval);
    gameInterval = null;
}

// Event listener for keyboard controls
document.addEventListener('keydown', function (event) {
    // Move the player's paddle up or down based on arrow key presses
    if (event.key === 'ArrowUp') {
        playerPaddle.y -= 20;
    } else if (event.key === 'ArrowDown') {
        playerPaddle.y += 20;
    }
});

// Event listener for the start button
document.getElementById('startButton').addEventListener('click', startGame);

// Initial call to set up and draw the initial game state
initGame();
draw();
