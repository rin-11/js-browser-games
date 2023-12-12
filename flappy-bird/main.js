 // Access canvas and set up context for 2D rendering
 var canvas = document.getElementById("gameCanvas");
 var ctx = canvas.getContext("2d");

 // Variables for gameplay and scorekeeping
 var gravity = 0.1;  // Lower gravity for smoother gameplay
 var score = 0;
 var gap = 200;
 var level = 1;  // Starting level
 var gameRunning = false;
 var gameInitialized = false;  // Check if the game has been initialized
 var pipes = [];
 var frameCount = 0;

 // Placeholder sounds
 var sfxScore = new Audio(); // set your sound file here
 var sfxCollision = new Audio(); // set your sound file here
 var sfxNewLevel = new Audio(); // set your sound file here
 var bgMusic = new Audio(); // set your sound file here

 var bird = {
     x: 150,
     y: 200,
     vy: 0,
     width: 20,
     height: 20,
     color: 'yellow',
     draw: function() {
         ctx.fillStyle = this.color;
         ctx.fillRect(this.x, this.y, this.width, this.height);
     },
     update: function() {
         this.vy += gravity;
         this.y += this.vy;
     }
 };

 function Pipe() {
     this.x = canvas.width;
     this.y = Math.random() * (canvas.height - gap);
     this.width = 50;
     this.height = this.y;
     this.color = 'green'; // Initial pipe color
     this.draw = function() {
         ctx.fillStyle = this.color;
         ctx.fillRect(this.x, 0, this.width, this.y);
         ctx.fillRect(this.x, this.y + gap, this.width, canvas.height - this.y - gap);
     }
     this.update = function() {
         this.x -= 2;
     }
 }

 function draw() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     bird.draw();
     pipes.forEach(pipe => pipe.draw());

     // Display the score
     ctx.fillStyle = "#000";
     ctx.font = "24px Arial";
     ctx.fillText("Score: " + score, 10, 30);
 }

 function update() {
     bird.update();
     pipes.forEach(pipe => pipe.update());
     if(frameCount % 120 === 0) {
         let pipe = new Pipe();
         pipe.color = `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`; // New color each pipe
         pipes.push(pipe);
     }
     // Remove pipes once they're off screen
     if(pipes.length > 0 && pipes[0].x + pipes[0].width < 0) {
         pipes.shift();
         score++;
         sfxScore.play(); // Play score sound
     }
     // Collision detection
     pipes.forEach(pipe => {
         if(bird.y <= pipe.y || bird.y + bird.height >= pipe.y + gap) {
             if(bird.x + bird.width >= pipe.x && bird.x <= pipe.x + pipe.width) {
                 gameRunning = false;
                 sfxCollision.play(); // Play collision sound
                 gameInitialized = false;  // The game can now be re-initialized
             }
         }
     });

     // Update difficulty
     if(score % 10 === 0 && score !== 0) {
         var newLevel = Math.floor(score / 10) + 1;
         if(newLevel > level) {
             level = newLevel;
             gap = 200 - (level * 10);  // Adjust gap size based on level
             sfxNewLevel.play(); // Play new level sound
         }
     }
 }

 function loop() {
     draw();
     if(gameRunning) {
         update();
     }
     frameCount++;
     if(gameRunning) {
         requestAnimationFrame(loop);
     }
 }

 function resetGame() {
     bird.y = 200;
     bird.vy = 0;
     score = 0;
     pipes = [];
     gap = 200;
     frameCount = 0;
     gravity = 0.1;
     level = 1;  // Reset level
 }

 function startGame() {
     if(!gameInitialized) {
         resetGame();
         gameRunning = true;
         gameInitialized = true;  // The game has been initialized
         bgMusic.play(); // Start background music
         loop();
     }
 }

 // Event listeners for keyboard control
 window.addEventListener('keydown', function(e) {
     if(e.code === 'Space') {
         bird.vy = -3;  // Lower jump for smoother gameplay
     }
 });
 document.getElementById("startButton").addEventListener('click', startGame);