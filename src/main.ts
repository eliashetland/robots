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
});

const startButton = document.getElementById('start') as HTMLButtonElement;
const rounds = document.getElementById('rounds') as HTMLDivElement;
startButton.addEventListener('click', () => {
    game.nextTurn().then(roundsleft => {
        rounds.textContent = `Rounds left: ${roundsleft}`;
    });

});