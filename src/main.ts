import { Board } from "./board";
import { board1 } from "./boards/board1";


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const board = new Board(ctx!, board1);


board.newBoard();
