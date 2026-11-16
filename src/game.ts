import type { Board } from "./board";


export class Game {

    board: Board;
    items: number[] = [];
    ready: Promise<void>;

    constructor(board: Board) {
        this.board = board;
        this.ready = this.#resetBoard();

    }

    async #resetBoard() {
        this.board.randomizeRobotPositions();
        this.board.resetMoveHistory();
        await this.board.newBoard();
        this.items = [...this.board.roundIconIds];
        this.items = this.items.sort(() => Math.random() - 0.5); // Shuffle the items
    }


    async nextTurn() {
        await this.ready;
        if (this.items.length === 0) {
            this.ready = this.#resetBoard();
            await this.ready;
        }

        const nextItemId = this.items.pop()!;
        this.board.resetMoveHistory();
        this.board.showNextIcon(nextItemId);

        return this.items.length;

    }

    get roundCount(): number {
        return this.board.roundIconIds.length;
    }
}