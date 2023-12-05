const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball, playerPaddle, aiPaddle, playerScore, aiScore, gameInterval;


// Paddle and Ball setup
function initGame() {
    ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speedX: 5, speedY: 5 };
    playerPaddle = { x: 0, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };
    aiPaddle = { x: canvas.width - 10, y: canvas.height / 2 - 40, width: 10, height: 80, score: 0 };
    playerScore = 0;
    aiScore = 0;
}



// Draw game objects
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ball
    ctx.fillStyle = 'pink';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    ctx.fill();

    // Draw paddles
    ctx.fillStyle = 'purple';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    // Draw scores
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Player: ${playerScore}`, 20, 30);
    ctx.fillText(`AI: ${aiScore}`, canvas.width - 100, 30);
}

// Update game objects
function update() {
    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom
    if (ball.y < 0 || ball.y > canvas.height) {
        ball.speedY *= -1;
    }

    // Ball collision with paddles
    if (ball.x < 20 && ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.speedX *= -1;
    } else if (ball.x > canvas.width - 20 && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
        ball.speedX *= -1;
    }

    // AI movement
    aiPaddle.y += (ball.y - aiPaddle.y - aiPaddle.height / 2) * 0.1;

    // Scoring
    if (ball.x < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Check for game over
    if (playerScore === 10 || aiScore === 10) {
        stopGame();
    }
}

// Reset ball position
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 5;
    ball.speedY = 5;
}

// Start the game
function startGame() {
    if (!gameInterval) {
        initGame();
        gameInterval = setInterval(() => {
            update();
            draw();
        }, 30);
    }
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
    gameInterval = null;
}

// Keyboard controls
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp') {
        playerPaddle.y -= 20;
    } else if (event.key === 'ArrowDown') {
        playerPaddle.y += 20;
    }
});

// Start button
document.getElementById('startButton').addEventListener('click', startGame);

initGame();
draw();
