const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let time = 0;
let interval;
let gameInterval;
let isGameRunning = false;

let snake = [];
let food;
let direction;

let difficulty = "easy";

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("difficulty").addEventListener("change", (e) => {
  difficulty = e.target.value;
  if (isGameRunning) {
    restartGame();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
});

function startGame() {
  resetGameVariables();
  startIntervals();
}

function restartGame() {
  clearInterval(gameInterval);
  clearInterval(interval);
  startGame();
}

function resetGameVariables() {
  score = 0;
  time = 0;
  direction = null;
  snake = [{ x: 9 * box, y: 9 * box }];
  food = randomFood();
  updateDisplay();
}

function startIntervals() {
  gameInterval = setInterval(gameLoop, getSpeed());
  interval = setInterval(updateTime, 1000);
  isGameRunning = true;
}

function getSpeed() {
  if (difficulty === "easy") return 150;
  if (difficulty === "medium") return 100;
  return 50;
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

function updateTime() {
  time++;
  document.getElementById("timeBox").textContent = formatTime(time);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateDisplay() {
  document.getElementById("score").textContent = score;
  document.getElementById("highScore").textContent = highScore;
  document.getElementById("timeBox").textContent = formatTime(time);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  updateDisplay();
}

function moveSnake() {
  let head = { ...snake[0] };

  if (direction === "left") head.x -= box;
  if (direction === "right") head.x += box;
  if (direction === "up") head.y -= box;
  if (direction === "down") head.y += box;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFood();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
  } else {
    snake.pop();
  }

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision(head)) {
    endGame();
  }
}

function checkCollision(head) {
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(interval);
  isGameRunning = false;
  alert("Game Over!");
}

function gameLoop() {
  moveSnake();
  draw();
}
