// Get the canvas and context
const canvas = document.getElementById('birdGame');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

canvas.width = 320;
canvas.height = 480;

// Bird image
const birdImg = new Image();
birdImg.src = 'bird.png'; // Make sure bird.png is in the same directory

const cloudImg = new Image();
cloudImg.src = 'cloud.png'; // Add cloud image in the same directory

const groundImg = new Image();
groundImg.src = 'ground.png'; // Add ground image in the same directory

let birdX = 50;
let birdY = canvas.height / 2;
const birdWidth = 34;  // Bird image width
const birdHeight = 24; // Bird image height
let gravity = 0.4;
let birdVelocity = 0;
let birdJump = -8;

// Pipes variables
let pipeWidth = 60;
let pipeGap = 150;
let pipeSpeed = 2.5;
let pipes = [];

// Cloud variables
let clouds = [];
const cloudSpeed = 0.5;

// Ground variables
const groundHeight = 40;
let groundY = canvas.height - groundHeight;

// Game variables
let score = 0;
let isGameOver = false;

// Key listener for bird jump
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !isGameOver) {
        birdVelocity = birdJump;
    }
});

// Create pipes
function createPipe() {
    let randomPipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - groundHeight));
    pipes.push({
        x: canvas.width,
        y: randomPipeHeight
    });
}

// Create clouds
function createCloud() {
    let randomCloudY = Math.floor(Math.random() * (canvas.height / 2));
    clouds.push({
        x: canvas.width,
        y: randomCloudY,
        width: 50 + Math.random() * 40,
        height: 30 + Math.random() * 20
    });
}

// Restart the game
restartButton.addEventListener('click', () => {
    resetGame();
});

// Game loop
function updateGame() {
    if (isGameOver) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird mechanics
    birdVelocity += gravity;
    birdY += birdVelocity;

    // Draw sky background
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cloud mechanics
    if (clouds.length === 0 || clouds[clouds.length - 1].x < canvas.width - 200) {
        createCloud();
    }
    clouds.forEach((cloud, index) => {
        cloud.x -= cloudSpeed;
        ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);

        // Remove clouds that are off-screen
        if (cloud.x + cloud.width < 0) {
            clouds.splice(index, 1);
        }
    });

    // Draw bird image
    ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);

    // Pipe mechanics
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        // Draw colorful pipes
        let pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, canvas.height);
        pipeGradient.addColorStop(0, '#FF5733');
        pipeGradient.addColorStop(1, '#33FFBD');
        ctx.fillStyle = pipeGradient;
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - pipe.y - pipeGap - groundHeight);

        // Check for collision
        if (
            birdX + birdWidth > pipe.x &&
            birdX < pipe.x + pipeWidth &&
            (birdY < pipe.y || birdY + birdHeight > pipe.y + pipeGap)
        ) {
            endGame();
        }

        // Remove pipes that are off-screen
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });

    // Draw ground
    ctx.drawImage(groundImg, 0, groundY, canvas.width, groundHeight);

    // Check if bird hits the ground or top
    if (birdY + birdHeight >= groundY || birdY <= 0) {
        endGame();
    }

    // Display score
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (!isGameOver) {
        requestAnimationFrame(updateGame);
    }
}

// End the game
function endGame() {
    isGameOver = true;

    // Display "Game Over" message
    ctx.fillStyle = '#ff0000';
    ctx.font = '40px Arial';
    ctx.fillText('Game Over', 70, canvas.height / 2);

    // Show the restart button
    restartButton.classList.remove('hidden');
}

// Reset the game
function resetGame() {
    birdX = 50;
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    clouds = [];
    score = 0;
    isGameOver = false;
    restartButton.classList.add('hidden');
    updateGame();
}

// Start the game
updateGame();
