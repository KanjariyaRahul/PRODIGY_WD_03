const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const newGameButton = document.getElementById('newGameButton');
const winnerPopup = document.getElementById('winner-popup');
const winnerMessage = document.getElementById('winner-message');
let isXTurn = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick, { once: true });
});

restartButton.addEventListener('click', restartGame);
newGameButton.addEventListener('click', restartGame);

function handleCellClick(e) {
    const cell = e.target;
    const currentClass = isXTurn ? 'x' : 'o';
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateStatusText();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    gameState[Array.from(cells).indexOf(cell)] = currentClass;
}

function swapTurns() {
    isXTurn = !isXTurn;
}

function updateStatusText() {
    statusText.textContent = isXTurn ? "Player X's turn" : "Player O's turn";
}

function checkWin(currentClass) {
    return winConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === currentClass;
        });
    });
}

function isDraw() {
    return gameState.every(cell => cell !== '');
}

function endGame(draw) {
    if (draw) {
        winnerMessage.textContent = 'Draw!';
    } else {
        winnerMessage.textContent = `${isXTurn ? "Player X" : "Player O"} Wins!`;
        confetti.start();
    }
    winnerPopup.classList.remove('hidden');
}

function restartGame() {
    isXTurn = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.classList.remove('x');
        cell.classList.remove('o');
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    winnerPopup.classList.add('hidden');
    confetti.stop();
    updateStatusText();
}

updateStatusText();

// Confetti settings
var confetti = {
    maxCount: 150,
    speed: 2,
    frameInterval: 15,
    alpha: 1.0,
    gradient: false,
    start: null,
    stop: null,
    toggle: null,
    pause: null,
    resume: null,
    togglePause: null,
    remove: null,
    isPaused: null,
    isRunning: null
};

(function () {
    confetti.start = startConfetti;
    confetti.stop = stopConfetti;
    confetti.toggle = toggleConfetti;
    confetti.pause = pauseConfetti;
    confetti.resume = resumeConfetti;
    confetti.togglePause = toggleConfettiPause;
    confetti.isPaused = isConfettiPaused;
    confetti.remove = removeConfetti;
    confetti.isRunning = isConfettiRunning;

    var supportsAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
    var colors = ["rgba(30,144,255,", "rgba(107,142,35,", "rgba(255,215,0,", "rgba(255,192,203,", "rgba(106,90,205,", "rgba(173,216,230,", "rgba(238,130,238,", "rgba(152,251,152,", "rgba(70,130,180,", "rgba(244,164,96,", "rgba(210,105,30,", "rgba(220,20,60,"];
    var streamingConfetti = false;
    var animationTimer = null;
    var pause = false;
    var lastFrameTime = Date.now();
    var particles = [];
    var waveAngle = 0;
    var context = null;

    function resetParticle(particle, width, height) {
        particle.color = colors[(Math.random() * colors.length) | 0] + (confetti.alpha + ")");
        particle.color2 = colors[(Math.random() * colors.length) | 0] + (confetti.alpha + ")");
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.diameter = 10 * Math.random() + 5;
        particle.tilt = 10 * Math.random() - 10;
        particle.tiltAngleIncrement = 0.07 * Math.random() + 0.05;
        particle.tiltAngle = Math.random() * Math.PI;
        return particle;
    }

    function toggleConfettiPause() {
        if (pause) resumeConfetti();
        else pauseConfetti();
    }

    function isConfettiPaused() {
        return pause;
    }

    function pauseConfetti() {
        pause = true;
    }

    function resumeConfetti() {
        pause = false;
        runAnimation();
    }

    function runAnimation() {
        if (pause) return;
        else if (particles.length === 0) {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            animationTimer = null;
        } else {
            var now = Date.now();
            var delta = now - lastFrameTime;
            if (!supportsAnimationFrame || delta > confetti.frameInterval) {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateParticles();
                drawParticles(context);
                lastFrameTime = now - (delta % confetti.frameInterval);
            }
            animationTimer = requestAnimationFrame(runAnimation);
        }
    }

    function startConfetti(timeout, min, max) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
            return window.setTimeout(callback, confetti.frameInterval);
        };
        var canvas = document.getElementById("confetti-canvas");
        if (canvas === null) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", "confetti-canvas");
            canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none;position:fixed;top:0");
            document.body.appendChild(canvas);
            canvas.width = width;
            canvas.height = height;
            window.addEventListener("resize", function () {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }, true);
            context = canvas.getContext("2d");
        } else if (context === null)
            context = canvas.getContext("2d");
        var count = confetti.maxCount;
        if (min) {
            if (max) {
                if (min == max)
                    count = particles.length + max;
                else {
                    if (min > max) {
                        var temp = min;
                        min = max;
                        max = temp;
                    }
                    count = particles.length + ((Math.random() * (max - min) + min) | 0);
                }
            } else
                count = particles.length + min;
        } else if (max)
            count = particles.length + max;
        while (particles.length < count)
            particles.push(resetParticle({}, width, height));
        streamingConfetti = true;
        pause = false;
        runAnimation();
        if (timeout) {
            window.setTimeout(stopConfetti, timeout);
        }
    }

    function stopConfetti() {
        streamingConfetti = false;
    }

    function removeConfetti() {
        stopConfetti();
        pause = false;
        particles = [];
    }

    function toggleConfetti() {
        if (streamingConfetti) stopConfetti();
        else startConfetti();
    }

    function isConfettiRunning() {
        return streamingConfetti;
    }

    function drawParticles(context) {
        var particle;
        var x, y, x2, y2;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            context.beginPath();
            context.lineWidth = particle.diameter;
            x2 = particle.x + particle.tilt;
            y2 = particle.y + particle.tilt + particle.diameter / 2;
            if (confetti.gradient) {
                var gradient = context.createLinearGradient(x2, particle.y, particle.x, y2);
                gradient.addColorStop("0", particle.color);
                gradient.addColorStop("1.0", particle.color2);
                context.strokeStyle = gradient;
            } else
                context.strokeStyle = particle.color;
            context.moveTo(x2, particle.y);
            context.lineTo(particle.x, y2);
            context.stroke();
        }
    }

    function updateParticles() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var particle;
        waveAngle += 0.01;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            if (!streamingConfetti && particle.y < -15)
                particle.y = height + 100;
            else {
                particle.tiltAngle += particle.tiltAngleIncrement;
                particle.x += Math.sin(waveAngle);
                particle.y += (Math.cos(waveAngle) + particle.diameter + confetti.speed) * 0.5;
                particle.tilt = Math.sin(particle.tiltAngle) * 15;
            }
            if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
                if (streamingConfetti && particles.length <= confetti.maxCount)
                    resetParticle(particle, width, height);
                else {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }
})();
