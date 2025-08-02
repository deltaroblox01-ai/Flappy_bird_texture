const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
let gravity = 0.25;
let jump = 4.6;
let score = 0;
let gameOver = false;

// Bird
const bird = {
  x: 50,
  y: 150,
  w: 30,
  h: 30,
  velocity: 0,
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  },
  update() {
    this.velocity += gravity;
    this.y += this.velocity;
    if (this.y + this.h >= canvas.height) gameOver = true;
  },
  flap() {
    this.velocity = -jump;
  },
};

// Pipes
const pipes = [];
const pipeWidth = 60;
const gap = 150;

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    const p = pipes[i];
    ctx.fillStyle = "green";
    // Top pipe
    ctx.fillRect(p.x, 0, pipeWidth, p.top);
    // Bottom pipe
    ctx.fillRect(p.x, p.top + gap, pipeWidth, canvas.height - (p.top + gap));
  }
}

function updatePipes() {
  if (frames % 90 === 0) {
    let top = Math.random() * (canvas.height - gap - 50) + 20;
    pipes.push({ x: canvas.width, top: top });
  }

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;

    // Collision detection
    if (
      bird.x < p.x + pipeWidth &&
      bird.x + bird.w > p.x &&
      (bird.y < p.top || bird.y + bird.h > p.top + gap)
    ) {
      gameOver = true;
    }

    // Score update
    if (p.x + pipeWidth < bird.x && !p.scored) {
      score++;
      p.scored = true;
    }
  }

  // Remove off-screen pipes
  if (pipes.length && pipes[0].x + pipeWidth < 0) pipes.shift();
}

// Draw Score
function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "30px Arial";
  ctx.fillText("Score: " + score, 10, 50);
}

// Game Loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.draw();
  bird.update();

  drawPipes();
  updatePipes();

  drawScore();

  frames++;
  if (!gameOver) {
    requestAnimationFrame(loop);
  } else {
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("Game Over", 80, 300);
  }
}

// Controls
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") bird.flap();
});

document.addEventListener("touchstart", function () {
  bird.flap();
});

loop();