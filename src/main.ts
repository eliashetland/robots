import { Board } from "./board";
import { board1 } from "./boards/board1";
import { Game } from "./game";


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

const startButton = document.getElementById('start') as HTMLButtonElement;
const rounds = document.getElementById('rounds') as HTMLDivElement;
const moveCount = document.getElementById('move-count') as HTMLElement;
const message = document.getElementById('message') as HTMLDivElement;
const undoButton = document.getElementById('undo') as HTMLButtonElement;
const retryButton = document.getElementById('retry') as HTMLButtonElement;
let roundsRemaining = 17;
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
    message.textContent = board.roundComplete
        ? roundsRemaining === 0 ? 'Game finished!' : 'Success!'
        : roundsRemaining === 0 ? 'Final round' : '';
};

startButton.addEventListener('click', () => {
    game.nextTurn().then(roundsleft => {
        roundsRemaining = roundsleft;
        updateRoundDeck(roundsRemaining);
        startButton.textContent = roundsRemaining === 0 ? 'New Game' : 'Next Round';
        updateMoveCount();
    });

});

undoButton.addEventListener('click', () => {
    board.undoLastMove();
    updateMoveCount();
});

retryButton.addEventListener('click', () => {
    board.retryRound();
    updateMoveCount();
});

updateRoundDeck(17);