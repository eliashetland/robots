import { Board } from "./board";
import { board1 } from "./boards/board1";
import { Game } from "./game";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(`${import.meta.env.BASE_URL}sw.js`)
            .catch(error => console.error('Service worker registration failed:', error));
    });
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const board = new Board(ctx!, board1);

const game = new Game(board);

let dragStart: { x: number; y: number } | null = null;
let dragged = false;
const getCanvasPoint = (event: MouseEvent | PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - bounds.left) * canvas.width / bounds.width,
        y: (event.clientY - bounds.top) * canvas.height / bounds.height,
    };
};

canvas.addEventListener('pointerdown', event => {
    dragStart = getCanvasPoint(event);
    dragged = false;
    canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointerup', event => {
    if (!dragStart) {
        return;
    }
    const end = getCanvasPoint(event);
    dragged = board.handleDrag(dragStart.x, dragStart.y, end.x, end.y);
    dragStart = null;
    updateMoveCount();
});

canvas.addEventListener('pointercancel', () => {
    dragStart = null;
});

canvas.addEventListener('click', event => {
    if (dragged) {
        dragged = false;
        return;
    }
    const point = getCanvasPoint(event);
    board.handleClick(point.x, point.y);
    updateMoveCount();
});

canvas.addEventListener('mousemove', event => {
    const point = getCanvasPoint(event);
    board.handleHover(point.x, point.y);
});

canvas.addEventListener('mouseleave', () => {
    board.clearHover();
});

const startButton = document.getElementById('start') as HTMLButtonElement;
const rounds = document.getElementById('rounds') as HTMLDivElement;
const moveCount = document.getElementById('move-count') as HTMLElement;
const roundTimer = document.getElementById('round-timer') as HTMLElement;
const message = document.getElementById('message') as HTMLDivElement;
const undoButton = document.getElementById('undo') as HTMLButtonElement;
const retryButton = document.getElementById('retry') as HTMLButtonElement;
const trailToggle = document.getElementById('show-trails') as HTMLInputElement;
const confetti = document.getElementById('confetti') as HTMLDivElement;
let roundsRemaining = 17;
let roundStartedAt: number | null = null;
let timerId: number | null = null;

const updateTimer = () => {
    if (roundStartedAt === null) {
        return;
    }
    const elapsedSeconds = Math.floor((Date.now() - roundStartedAt) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
    roundTimer.textContent = `Time ${minutes}:${seconds}`;
};

const startTimer = () => {
    if (timerId !== null) {
        window.clearInterval(timerId);
    }
    roundStartedAt = Date.now();
    roundTimer.textContent = 'Time 00:00';
    timerId = window.setInterval(updateTimer, 1000);
};

const updateRoundDeck = (remaining: number) => {
    rounds.replaceChildren();
    rounds.setAttribute('aria-label', `${remaining} rounds remaining`);
    for (let index = 0; index < remaining; index++) {
        const icon = document.createElement('span');
        icon.className = 'deck-icon';
        icon.style.left = `${50 + (index - (remaining - 1) / 2) * 3}%`;
        icon.style.setProperty('--deck-vertical-offset', `${(index - (remaining - 1) / 2) * 6}px`);
        icon.style.transform = `translateX(-50%) rotate(${(index - (remaining - 1) / 2) * 3}deg)`;
        icon.style.zIndex = `${index}`;
        rounds.append(icon);
    }
};
const updateMoveCount = () => {
    moveCount.textContent = `${board.movesThisRound}`;
    if (board.roundComplete && timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
        updateTimer();
    }
    message.textContent = board.roundComplete
        ? roundsRemaining === 0 ? 'Game finished!' : ''
        : roundsRemaining === 0 ? 'Final round' : '';
};

const showConfetti = () => {
    const colors = ['#ef6b73', '#62b5f5', '#f5ca58', '#68d391', '#d59bf6'];
    const canvasBounds = canvas.getBoundingClientRect();
    confetti.replaceChildren();
    for (let index = 0; index < 42; index++) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 180;
        const driftX = Math.cos(angle) * distance;
        const driftY = Math.sin(angle) * distance;
        piece.style.left = `${canvasBounds.left + canvasBounds.width / 2}px`;
        piece.style.top = `${canvasBounds.top + canvasBounds.height / 2}px`;
        piece.style.backgroundColor = colors[index % colors.length];
        piece.style.animationDelay = `${Math.random() * 180}ms`;
        piece.style.setProperty('--dx', `${driftX}px`);
        piece.style.setProperty('--dy', `${driftY}px`);
        piece.style.setProperty('--end-x', `${driftX * 1.5}px`);
        piece.style.setProperty('--end-y', `${driftY * 1.5 + 220}px`);
        confetti.append(piece);
        window.setTimeout(() => piece.remove(), 1500);
    }
};

board.onRoundComplete = () => {
    updateMoveCount();
    showConfetti();
};

startButton.addEventListener('click', () => {
    startTimer();
    game.nextTurn().then(roundsleft => {
        roundsRemaining = roundsleft;
        updateRoundDeck(roundsRemaining);
        startButton.classList.remove('start-game');
        startButton.textContent = roundsRemaining === 0 ? 'New Game' : 'Next Round';
        updateMoveCount();
    });

});

undoButton.addEventListener('click', () => {
    board.undoLastMove();
    updateMoveCount();
});

retryButton.addEventListener('click', () => {
    if (board.retryRound()) {
        startTimer();
    }
    updateMoveCount();
});

trailToggle.addEventListener('change', () => {
    board.setShowTrails(trailToggle.checked);
});

updateRoundDeck(17);