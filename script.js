// Obtén el elemento canvas y su contexto de renderizado 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables para controlar el estado del juego
let isPaused = true;  // Si el juego está pausado o no
let isGameStarted = false;  // Si el juego ha comenzado


// Variables y objetos del juego
let level = 1;
const initialDelay = 120;  // 120 milisegundos de retraso como velocidad inicial
let currentDelay = initialDelay;

let snake = [{x: 200, y: 200}];  // Representación de la serpiente
const snakeSpeed = 8;  // Velocidad de la serpiente
let dx = snakeSpeed;  // Desplazamiento horizontal
let dy = 0;  // Desplazamiento vertical
let lives = 3;  // Vidas del jugador
let points = 0;  // Puntos del jugador

let food;
resetFood();  // Inicializa la comida


// Función para iniciar el juego
function startGame() {
    // Solo inicia el juego si aún no ha comenzado
    if (!isGameStarted) {
        isGameStarted = true;
        isPaused = false;
        gameLoop();
    }
}

// Función para alternar la pausa del juego
function togglePause() {
    // Invertir el estado de pausa
    isPaused = !isPaused;
}

// Bucle del juego
function gameLoop() {
    if (!isPaused) {
        setTimeout(() => {
            move();
            draw();
            // Llama a gameLoop de nuevo en el próximo frame
            requestAnimationFrame(gameLoop);
        }, currentDelay);
    } else {
        // Si el juego está pausado, sigue llamando a gameLoop, pero sin el retraso
        requestAnimationFrame(gameLoop);
    }
}

//funcion para subir de nivel
function updateLevel() {
    level = Math.floor(points / 3) + 1;  // Cada 3 puntos, sube de nivel
    currentDelay = initialDelay / level;  // Aumenta la velocidad disminuyendo el delay
}


// Función para resetear la posición de la comida
function resetFood() {
    // Posiciona la comida aleatoriamente en el canvas
    food = {
        x: Math.floor(Math.random() * canvas.width / snakeSpeed) * snakeSpeed,
        y: Math.floor(Math.random() * canvas.height / snakeSpeed) * snakeSpeed
    };
}


// Función para dibujar en el canvas
function draw() {
    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibuja la comida
    ctx.fillStyle = '#ff6464';
    ctx.fillRect(food.x, food.y, snakeSpeed, snakeSpeed);
    
    // Dibuja la serpiente
    for (let segment of snake) {
        ctx.fillStyle = segment === snake[0] && isCollided() ? 'red' : '#00fe00';
        ctx.fillRect(segment.x, segment.y, snakeSpeed, snakeSpeed);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.strokeRect(segment.x, segment.y, snakeSpeed, snakeSpeed);
    }
    
    // Dibuja la puntuación, las vidas y el nivel con sombreado
    ctx.fillStyle = '#90ff8a';
    ctx.font = "16px 'Consolas', monospace";
    ctx.shadowColor = '#00000091';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText('Puntos: ' + points, 15, 20);
    ctx.fillText('Vidas: ' + lives, 15, 40);
    ctx.fillText('Nivel: ' + level, 15, 60);
}
// Función para verificar colisiones
function isCollided() {
    // Revisa colisiones de la cabeza de la serpiente con los bordes o consigo misma
    const head = snake[0];
    return head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

// Función para mover la serpiente
function move() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // Si hay colisión, resta vidas o resetea el juego si ya no quedan vidas
    if (isCollided()) {
        lives--;
        if (lives === 0) {
            resetGame();
        } else {
            snake = [{x: 200, y: 200}];
            resetFood();
        }
        return;
    }
    // Si la serpiente come, incrementa los puntos
    if (head.x === food.x && head.y === food.y) {
        points++;
        updateLevel();// Actualizar nivel y velocidad
        resetFood();
    } else {
        snake.pop();
    }
    snake.unshift(head);
}



//Funcion para reiniciar el juego
function resetGame() {
    // Informar al jugador que el juego ha terminado
    alert('Juego Terminado. Puntos obtenidos: ' + points + '. ¡Intentalo de nuevo!');
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Reiniciar variables del juego
    lives = 3;
    points = 0;
    snake = [{x: 200, y: 200}];
    
    // Función para reiniciar la comida
    resetFood();
}




function drawInitialElements() {
   
}

// Evento para controlar el movimiento de la serpiente con las teclas de flecha


window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            dx = 0;
            dy = -snakeSpeed;
            break;
        case 'ArrowDown':
            dx = 0;
            dy = snakeSpeed;
            break;
        case 'ArrowLeft':
            dx = -snakeSpeed;
            dy = 0;
            break;
        case 'ArrowRight':
            dx = snakeSpeed;
            dy = 0;
            break;
    }
});

// Inicia el bucle del juego
gameLoop();

// Agrega listeners para los botones de pausa y reset
document.getElementById('pauseButton').addEventListener('click', togglePause);
document.getElementById('resetButton').addEventListener('click', resetGame);
