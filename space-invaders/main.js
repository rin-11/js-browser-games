// Canvas and game states setup
const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const GAME_STATE = { START: 0, RUNNING: 1, OVER: 2 };
let state = GAME_STATE.START;

// Game constants
const PLAYER = { WIDTH: 15, HEIGHT: 15, SPEED: 2 };
const BULLET = { WIDTH: 2, HEIGHT: 10, SPEED: 5 };
const INVADER = { WIDTH: 10, HEIGHT: 10, SPEED: 0.3 };
const SPACESHIP = { WIDTH: 20, HEIGHT: 20, SPEED: 1 };
const COLORS = ["#F00", "#0F0", "#00F", "#FF0", "#F0F"];
const BARRIER_BLOCK_WIDTH = 5;
const BARRIER_BLOCK_HEIGHT = 5;
const BARRIER_START_HEIGHT = 350; 

// Game variables
let player, invaders = [], spaceship, playerBullet, invaderBullet, barriers = [], score = 0;

// Key presses
let keys = [];
window.addEventListener('keydown', function (e) { keys[e.keyCode] = true; });
window.addEventListener('keyup', function (e) { keys[e.keyCode] = false; });

// Start button
document.querySelector('#startButton').addEventListener('click', () => {
  if (state !== GAME_STATE.RUNNING) {
    startGame();
  }
});

function startGame() {
  state = GAME_STATE.RUNNING;
  player = { x: canvas.width / 2, y: canvas.height - 30, width: PLAYER.WIDTH, height: PLAYER.HEIGHT, color: "#0F0", dx: PLAYER.SPEED };
  invaders = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 10; j++) {
      invaders.push({
        x: 30 + j * 30,
        y: 30 + i * 30,
        width: INVADER.WIDTH,
        height: INVADER.HEIGHT,
        color: COLORS[i],
        dx: INVADER.SPEED
      });
    }
  }
  spaceship = { x: 0, y: 50, width: SPACESHIP.WIDTH, height: SPACESHIP.HEIGHT, color: "#F0F", dx: SPACESHIP.SPEED };
  barriers = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 12; j++) {
      for (let k = 0; k < 12; k++) {
        barriers.push({
          x: (i + 1) * 120 + j * BARRIER_BLOCK_WIDTH,
          y: BARRIER_START_HEIGHT + k * BARRIER_BLOCK_HEIGHT, 
          width: BARRIER_BLOCK_WIDTH,
          height: BARRIER_BLOCK_HEIGHT,
          color: "#0FF"
        });
      }
    }
  }
  playerBullet = null;
  invaderBullet = null;
  score = 0;
}

// Collision detection
function collide(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

// Update game state
function update() {
  if (state === GAME_STATE.RUNNING) {
    // Player movement
    if (keys[37]) player.x -= player.dx; // Left arrow
    if (keys[39]) player.x += player.dx; // Right arrow
    // Player shooting
    if (keys[32] && !playerBullet) { // Spacebar
      playerBullet = { x: player.x, y: player.y, width: BULLET.WIDTH, height: BULLET.HEIGHT, color: "#0F0", dy: -BULLET.SPEED };
    }
    // Player bullet movement
    if (playerBullet) {
      playerBullet.y += playerBullet.dy;
      if (playerBullet.y + playerBullet.height < 0) playerBullet = null;
    }
    // Invader movement and shooting
    invaders.forEach(invader => {
      invader.x += invader.dx;
      if (!invaderBullet && Math.random() < 0.001) {
        invaderBullet = { x: invader.x, y: invader.y, width: BULLET.WIDTH, height: BULLET.HEIGHT, color: "#F00", dy: BULLET.SPEED };
      }
      if (invader.x < 0 || invader.x + invader.width > canvas.width) {
        invader.dx = -invader.dx;
        invader.y += invader.height;
      }
      if (invader.y + invader.height > canvas.height) state = GAME_STATE.OVER;
    });
    // Invader bullet movement
    if (invaderBullet) {
      invaderBullet.y += invaderBullet.dy;
      if (invaderBullet.y > canvas.height) invaderBullet = null;
    }
    // Spaceship movement
    spaceship.x += spaceship.dx;
    if (spaceship.x < 0 || spaceship.x + spaceship.width > canvas.width) spaceship.dx = -spaceship.dx;
    // Collision detection
    barriers.forEach((barrier, index) => {
      if (playerBullet && collide(playerBullet, barrier)) {
        playerBullet = null;
        barriers.splice(index, 1);
      }
      if (invaderBullet && collide(invaderBullet, barrier)) {
        invaderBullet = null;
        barriers.splice(index, 1);
      }
    });
    invaders = invaders.filter(invader => !playerBullet || !collide(playerBullet, invader));
    if (playerBullet && collide(playerBullet, spaceship)) {
      playerBullet = null;
      spaceship.x = -spaceship.width;
      score += 100;
    }
    if (invaderBullet && collide(invaderBullet, player)) {
      state = GAME_STATE.OVER;
    }
  }
}

// Draw game state
function draw() {
  if (state === GAME_STATE.RUNNING || state === GAME_STATE.OVER) {
    // Clear screen
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // Draw invaders
    invaders.forEach(invader => {
      ctx.fillStyle = invader.color;
      ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
    });
    // Draw spaceship
    ctx.fillStyle = spaceship.color;
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
    // Draw barriers
    barriers.forEach(barrier => {
      ctx.fillStyle = barrier.color;
      ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
    });
    // Draw bullets
    if (playerBullet) {
      ctx.fillStyle = playerBullet.color;
      ctx.fillRect(playerBullet.x, playerBullet.y, playerBullet.width, playerBullet.height);
    }
    if (invaderBullet) {
      ctx.fillStyle = invaderBullet.color;
      ctx.fillRect(invaderBullet.x, invaderBullet.y, invaderBullet.width, invaderBullet.height);
    }
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
    // Draw game over screen
    if (state === GAME_STATE.OVER) {
      ctx.fillStyle = 'white';
      ctx.font = '32px Arial';
      ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
      ctx.font = '16px Arial';
      ctx.fillText('Press "Start Game" to restart', canvas.width / 2 - 110, canvas.height / 2 + 20);
    }
  }
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
