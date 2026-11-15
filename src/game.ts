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
        await this.board.newBoard();
        this.items = Array.from({ length: 17 }, (_, i) => i + 1);
        this.items = this.items.sort(() => Math.random() - 0.5); // Shuffle the items
    }


    async nextTurn() {
        await this.ready;
        if (this.items.length === 0) {
            this.ready = this.#resetBoard();
            await this.ready;
        }

        const nextItemId = this.items.pop()!;
        this.board.showNextIcon(nextItemId);

        return this.items.length;

    }
}