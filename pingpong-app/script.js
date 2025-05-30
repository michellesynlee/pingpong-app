const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById("restartBtn");

let gameOver = false;
let gameWon = false;

let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  vx: 4,
  vy: 4
};

let player = {
  x: 10,
  y: canvas.height / 2 - 64,   
  width: 80,
  height: 128,
  speed: 6
};

let goal = {
  x: canvas.width - 80,
  y: Math.random() * (canvas.height - 100),
  width: 60,
  height: 100,
  vy: 2 // vertical speed
};

//keystrokes
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function resetGame() {
  gameOver = false;
  gameWon = false;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = 4;
  ball.vy = 4;
  player.y = canvas.height / 2 - player.height / 2;
  goal.y = Math.random() * (canvas.height - goal.height);
  restartBtn.style.display = "none"; // Hide button

  requestAnimationFrame(loop); 
}
function update() {
  if (gameOver) return;

  // player control
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y < canvas.height - player.height) player.y += player.speed;

  //ball movement
  ball.x += ball.vx;
  ball.y += ball.vy;

  // bounce off top/bottom
  if (ball.y < ball.radius || ball.y > canvas.height - ball.radius) {
    ball.vy *= -1;
  }

  // bounce off right wall
  if (ball.x + ball.radius > canvas.width) {
    ball.vx *= -1;
    ball.x = canvas.width - ball.radius;
  }

  // how to check player collision
  const hitplayer = (
    ball.x - ball.radius <= player.x + player.width &&
    ball.y >= player.y &&
    ball.y <= player.y + player.height
  );

  //check for collision w player
  if (
    ball.x - ball.radius <= player.x + player.width &&
    ball.x > player.x &&  // ball is still in front of the paddle
    ball.y >= player.y &&
    ball.y <= player.y + player.height
  ) {
    ball.vx *= -1;
    ball.x = player.x + player.width + ball.radius;
  }

  // game over
  if (ball.x + ball.radius < player.x) {
    gameOver = true;
  }

  // goal 
  goal.y += goal.vy;
  if (goal.y <= 0 || goal.y + goal.height >= canvas.height) {
    goal.vy *= -1;
  }

  // only the left 20% counts as a win
  const goalZoneWidth = goal.width * 0.2; 

  const hitGoal = (
    ball.vx > 0 && // must be moving toward the goal (left to right)
    ball.x + ball.radius >= goal.x &&
    ball.x + ball.radius <= goal.x + goalZoneWidth &&
    ball.y >= goal.y &&
    ball.y <= goal.y + goal.height
  );

  if (hitGoal) {
    gameOver = true;
    gameWon = true; // new flag
  }

}

//instantiate images
const playerImg = new Image();
playerImg.src = "player.png";

const ballImg = new Image();
ballImg.src = "ball.png";

const goalImg = new Image();
goalImg.src = "goal.png";

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //player creation and size
  const playerImgWidth = 80;
  const playerImgHeight = 128;
  ctx.drawImage(playerImg, player.x, player.y, playerImgWidth, playerImgHeight);

  // ball image centered around ball position
  const size = ball.radius * 3.5;
  ctx.drawImage(ballImg, ball.x - ball.radius, ball.y - ball.radius, size, size);

  ctx.drawImage(goalImg, goal.x, goal.y, goal.width, goal.height);
  //debugging
  /*
  ctx.strokeStyle = "red";
  ctx.strokeRect(player.x, player.y, player.width, player.height);
  */

  //game over or won?
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "60px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
  
    if (gameWon) {
      ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2 - 20);
    } else {
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
    }

    restartBtn.style.display = "block"; // Show button
  }
}


function loop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(loop);
  }
}

// Restart on 'R' key press
restartBtn.addEventListener("click", resetGame);

loop();
