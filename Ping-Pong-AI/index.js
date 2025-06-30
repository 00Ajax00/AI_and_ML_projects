const canvas = document.getElementById("pingPongCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("scoreDisplay");

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let playerPaddle = { x: 0, y: canvas.height / 2 - paddleHeight / 2, speed: 4 };
let aiPaddle = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, speed: 4 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 5, dy: 5 };

let playerScore = 0;
let aiScore = 0;
let gameInterval;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddles
    ctx.fillStyle = "white";
    ctx.fillRect(playerPaddle.x, playerPaddle.y, paddleWidth, paddleHeight);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ballSize > canvas.height || ball.y - ballSize < 0) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
        (ball.x - ballSize < playerPaddle.x + paddleWidth && ball.y > playerPaddle.y && ball.y < playerPaddle.y + paddleHeight) ||
        (ball.x + ballSize > aiPaddle.x && ball.y > aiPaddle.y && ball.y < aiPaddle.y + paddleHeight)
    ) {
        ball.dx *= -1;
    }

    // AI movement
    if (aiPaddle.y + paddleHeight / 2 < ball.y) {
        aiPaddle.y += aiPaddle.speed;
    } else {
        aiPaddle.y -= aiPaddle.speed;
    }

    // Score update
    if (ball.x + ballSize < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x - ballSize > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Keep paddles within canvas
    playerPaddle.y = Math.max(Math.min(playerPaddle.y, canvas.height - paddleHeight), 0);
    aiPaddle.y = Math.max(Math.min(aiPaddle.y, canvas.height - paddleHeight), 0);
    
    // Update score display
    scoreDisplay.textContent = `Player: ${playerScore} | AI: ${aiScore}`;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 5 * (Math.random() < 0.5 ? 1 : -1); // Randomize initial direction
    ball.dy = 5 * (Math.random() < 0.5 ? 1 : -1);
}

function gameLoop() {
    draw();
    update();
}

function startGame() {
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
    startBtn.disabled = true;
    stopBtn.disabled = false;
    restartBtn.disabled = false;
}

function stopGame() {
    clearInterval(gameInterval);
    startBtn.disabled = false;
    stopBtn.disabled = true;
    restartBtn.disabled = false;
}

function restartGame() {
    playerScore = 0;
    aiScore = 0;
    resetBall();
    stopGame();
    startGame();
}

// Control player paddle with mouse
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    playerPaddle.y = mouseY - paddleHeight / 2;
});

// Button event listeners
startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
restartBtn.addEventListener("click", restartGame);
