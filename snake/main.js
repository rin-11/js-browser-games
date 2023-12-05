// Access the canvas element from the HTML document
const canvas = document.getElementById('gameCanvas');
// Get the 2D rendering context for the canvas
const ctx = canvas.getContext('2d');
// Access the start button element from the HTML document
const startButton = document.getElementById('startButton');
// Access the score display element from the HTML document
const scoreEl = document.getElementById('score');


// Initialize the score variable
let score = 0;
// Flag to track if the game is currently running
let gameRunning = false;
// Array to store the segments of the snake
let snake = [];
// Size of each snake segment
const snakeSize = 20;
// The initial direction of the snake
let direction = 'RIGHT';
// Object to store the position of the food
let food = {};
// Set the speed of the game loop in milliseconds
const gameSpeed = 100;


// Function to reset the game to its initial state
function resetGame() {
    // Reset the snake to its initial position
    snake = [{ x: 200, y: 200 }];
    // Reset the direction to right
    direction = 'RIGHT';
    // Reset the score to zero
    score = 0;
    // Update the score display
    scoreEl.innerText = 'Score: 0';
    // Place the food in a new random position
    placeFood();
}

// Function to place food in a random position on the canvas
function placeFood() {
    // Randomly position the food on the canvas, aligned to the grid
    food = {
        x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
        y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
    };
}

// Function to draw the game elements on the canvas
function draw() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the snake
    drawSnake();
    // Draw the food
    drawFood();
}

// Function to draw the snake on the canvas
function drawSnake() {
    // Loop through each segment of the snake
    snake.forEach(segment => {
        // Set the fill color for the snake segment
        ctx.fillStyle = 'yellow';
        // Set the shadow color and blur for a shadow effect
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        // Draw the snake segment as a filled rectangle
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
        // Set the stroke color for the outline of the segment
        ctx.strokeStyle = 'white';
        // Draw the outline of the snake segment
        ctx.strokeRect(segment.x, segment.y, snakeSize, snakeSize);
    });
}

// Function to draw the food on the canvas
function drawFood() {
    // Set the fill color for the food
    ctx.fillStyle = 'red';
    // Set the shadow color and blur for a shadow effect
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    // Draw the food as a filled rectangle
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
    // Set the stroke color for the outline of the food
    ctx.strokeStyle = 'white';
    // Draw the outline of the food
    ctx.strokeRect(food.x, food.y, snakeSize, snakeSize);
}

// Function to update the snake's position and handle eating food
function moveSnake() {
    // Create a new head for the snake based on its current direction
    const head = { x: snake[0].x, y: snake[0].y };
    // Update the position of the head based on the direction
    switch (direction) {
        case 'RIGHT': head.x += snakeSize; break;
        case 'LEFT': head.x -= snakeSize; break;
        case 'UP': head.y -= snakeSize; break;
        case 'DOWN': head.y += snakeSize; break;
    }

    // Add the new head to the front of the snake array
    snake.unshift(head);

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        // Increase the score
        score += 10;
        // Update the score display
        scoreEl.innerText = `Score: ${score}`;
        // Place new food on the canvas
        placeFood();
    } else {
        // Remove the last segment of the snake if it didn't eat food
        snake.pop();
    }
}

// Function to check if the snake has collided with itself or the canvas boundaries
function checkCollision() {
    // Get the position of the snake's head
    const head = snake[0];
    // Check collision with canvas boundaries
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        return true;
    }

    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    // Return false if no collision
    return false;
}

// Function to run the game loop
function gameLoop() {
    // Exit the function if the game is not running
    if (!gameRunning) return;

    // Set a timeout to create a game loop
    setTimeout(() => {
        // Check for collisions
        if (checkCollision()) {
            // End the game if there is a collision
            gameRunning = false;
            alert('Game Over');
            // Reset the game
            resetGame();
            return;
        }

        // Move the snake
        moveSnake();
        // Draw the game elements
        draw();

        // Continue the game loop
        gameLoop();
    }, gameSpeed);
}

// Add an event listener for keyboard input
document.addEventListener('keydown', event => {
    // Get the pressed key
    const { key } = event;
    // Change the direction of the snake based on the key pressed
    if (key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    } else if (key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    }
});

// Add an event listener for the start button
startButton.addEventListener('click', () => {
    // Start the game if it's not already running
    if (!gameRunning) {
        gameRunning = true;
        // Reset the game state
        resetGame();
        // Start the game loop
        gameLoop();
    }
});

// Reset the game to its initial state when the script loads
resetGame();