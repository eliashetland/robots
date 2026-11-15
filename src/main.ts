import { Board } from "./board";
import { board1 } from "./boards/board1";
import { Game } from "./game";


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const board = new Board(ctx!, board1);

const game = new Game(board);

canvas.addEventListener('click', event => {
    const bounds = canvas.getBoundingClientRect();
    board.handleClick(
        (event.clientX - bounds.left) * canvas.width / bounds.width,
        (event.clientY - bounds.top) * canvas.height / bounds.height,
    );
});

const startButton = document.getElementById('start') as HTMLButtonElement;
const rounds = document.getElementById('rounds') as HTMLDivElement;
startButton.addEventListener('click', () => {
    game.nextTurn().then(roundsleft => {
        rounds.textContent = `Rounds left: ${roundsleft}`;
    });

});