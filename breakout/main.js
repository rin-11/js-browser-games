const canvas = document.getElementById('breakoutCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');

let score = 0;
let isGameRunning = false;
let level = 1;
let paddle, ball, bricks;

// Paddle properties
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX;

// Ball properties
let ballRadius = 10;
let ballX, ballY, ballDX, ballDY;

// Brick properties
const brickRowCount = 3;
const brickColumnCount = 9; // Adjusted for full width
const brickWidth = canvas.width / brickColumnCount - 10;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Function to create bricks
function createBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount + level - 1; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    // Assign random color per row
    for (let r = 0; r < brickRowCount + level - 1; r++) {
        let rowColor = getRandomColor();
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c][r].color = rowColor;
        }
    }
}

// Function to get random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Function to draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Function to draw the bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount + level - 1; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Function to handle mouse movement
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// Function to update the game elements
function updateGame() {
    // Update ball position
    ballX += ballDX;
    ballY += ballDY;

    // Collision detection with walls
    if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
    }
    if (ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
    } else if (ballY + ballDY > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY;
            // Add "english" based on paddle movement
            ballDX += 0.1 * (ballX - (paddleX + paddleWidth / 2));
        } else {
            // Ball hits the bottom wall
            isGameRunning = false;
            alert("Game Over");
            document.location.reload();
        }
    }

    // Collision detection with bricks
    let allBricksCleared = true;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount + level - 1; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                allBricksCleared = false;
                if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    ballDY = -ballDY;
                    b.status = 0;
                    score++;
                }
            }
        }
    }

    // Check if all bricks are cleared to advance to the next level
    if (allBricksCleared) {
        level++;
        startGame();
    }
}

// Function to draw the game
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isGameRunning) {
        return;
    }

    drawBricks();
    drawBall();
    drawPaddle();
    updateGame();

    // Update score display
    scoreDisplay.innerText = `Score: ${score}`;

    requestAnimationFrame(draw);
}

// Function to start the game
function startGame() {
    isGameRunning = true;
    score = 0;
    paddleX = (canvas.width - paddleWidth) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballDX = 2;
    ballDY = -2;
    createBricks();
    draw();
}

// Add event listener to the start button
startButton.addEventListener('click', startGame);

// Initialize the game in "attract mode"
draw();
