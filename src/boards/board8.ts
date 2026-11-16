import type { IBoard } from "../types/IBoard";

export const board8: IBoard = {
    gridSize: 8,
    robotColors: ['red', 'blue', 'black'],
    walls: [
        { from: { x: 1, y: 0 }, to: { x: 1, y: 1 } },
        { from: { x: 1, y: 1 }, to: { x: 2, y: 1 } },
        { from: { x: 6, y: 0 }, to: { x: 6, y: 1 } },
        { from: { x: 5, y: 1 }, to: { x: 6, y: 1 } },
        { from: { x: 1, y: 6 }, to: { x: 1, y: 7 } },
        { from: { x: 1, y: 6 }, to: { x: 2, y: 6 } },
        { from: { x: 6, y: 5 }, to: { x: 6, y: 6 } },
        { from: { x: 5, y: 6 }, to: { x: 6, y: 6 } },
        { from: { x: 2, y: 3 }, to: { x: 2, y: 4 } },
        { from: { x: 2, y: 4 }, to: { x: 3, y: 4 } },
        { from: { x: 5, y: 3 }, to: { x: 5, y: 4 } },
        { from: { x: 4, y: 3 }, to: { x: 5, y: 3 } },
        { from: { x: 3, y: 7 }, to: { x: 4, y: 7 } },
    ],
    targets: [
        { position: { x: 1, y: 1 }, icon: { type: 'star', color: 'red' } },
        { position: { x: 0, y: 3 }, icon: { type: 'star', color: 'blue' } },
        { position: { x: 6, y: 1 }, icon: { type: 'moon', color: 'red' } },
        { position: { x: 1, y: 6 }, icon: { type: 'moon', color: 'blue' } },
        { position: { x: 6, y: 6 }, icon: { type: 'cog', color: 'blue' } },
        { position: { x: 2, y: 4 }, icon: { type: 'cog', color: 'red' } },
        { position: { x: 5, y: 3 }, icon: { type: 'hole', color: 'dark' } },
    ],
};
