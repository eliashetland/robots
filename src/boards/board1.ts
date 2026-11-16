import type { IBoard } from "../types/IBoard";

export const board1: IBoard = {
    gridSize: 16,
    robotColors: ['red', 'blue', 'yellow', 'green', 'black'],
    walls: [
        { from: { x: 4, y: 0 }, to: { x: 5, y: 0 } },
        { from: { x: 10, y: 0 }, to: { x: 11, y: 0 } },

        { from: { x: 1, y: 1 }, to: { x: 1, y: 2 } },

        { from: { x: 6, y: 1 }, to: { x: 7, y: 1 } },
        { from: { x: 6, y: 1 }, to: { x: 6, y: 2 } },
        { from: { x: 8, y: 1 }, to: { x: 9, y: 1 } },
        { from: { x: 9, y: 1 }, to: { x: 9, y: 2 } },

        { from: { x: 1, y: 1 }, to: { x: 1, y: 2 } },
        { from: { x: 0, y: 2 }, to: { x: 1, y: 2 } },
        { from: { x: 14, y: 1 }, to: { x: 14, y: 2 } },
        { from: { x: 14, y: 2 }, to: { x: 15, y: 2 } },

        { from: { x: 10, y: 4 }, to: { x: 11, y: 4 } },
        { from: { x: 10, y: 4 }, to: { x: 10, y: 5 } },
        { from: { x: 15, y: 4 }, to: { x: 15, y: 5 } },

        { from: { x: 6, y: 4 }, to: { x: 6, y: 5 } },
        { from: { x: 6, y: 5 }, to: { x: 7, y: 5 } },
        { from: { x: 0, y: 5 }, to: { x: 0, y: 6 } },

        { from: { x: 3, y: 6 }, to: { x: 3, y: 7 } },
        { from: { x: 2, y: 6 }, to: { x: 3, y: 6 } },
        { from: { x: 12, y: 5 }, to: { x: 12, y: 6 } },
        { from: { x: 11, y: 6 }, to: { x: 12, y: 6 } },

        { from: { x: 3, y: 9 }, to: { x: 4, y: 9 } },
        { from: { x: 4, y: 9 }, to: { x: 4, y: 10 } },
        { from: { x: 15, y: 9 }, to: { x: 15, y: 10 } },

        { from: { x: 6, y: 9 }, to: { x: 6, y: 10 } },
        { from: { x: 5, y: 10 }, to: { x: 6, y: 10 } },
        { from: { x: 8, y: 10 }, to: { x: 9, y: 10 } },
        { from: { x: 8, y: 10 }, to: { x: 8, y: 11 } },
        { from: { x: 0, y: 10 }, to: { x: 0, y: 11 } },

        { from: { x: 13, y: 10 }, to: { x: 13, y: 11 } },
        { from: { x: 12, y: 11 }, to: { x: 13, y: 11 } },

        { from: { x: 7, y: 11 }, to: { x: 7, y: 12 } },
        { from: { x: 7, y: 12 }, to: { x: 8, y: 12 } },

        { from: { x: 1, y: 12 }, to: { x: 1, y: 13 } },
        { from: { x: 1, y: 13 }, to: { x: 2, y: 13 } },
        { from: { x: 9, y: 13 }, to: { x: 9, y: 14 } },
        { from: { x: 8, y: 13 }, to: { x: 9, y: 13 } },

        { from: { x: 3, y: 14 }, to: { x: 3, y: 15 } },
        { from: { x: 3, y: 14 }, to: { x: 4, y: 14 } },
        { from: { x: 14, y: 14 }, to: { x: 15, y: 14 } },
        { from: { x: 14, y: 13 }, to: { x: 14, y: 14 } },

        { from: { x: 4, y: 15 }, to: { x: 5, y: 15 } },
        { from: { x: 11, y: 15 }, to: { x: 12, y: 15 } },
    ],
    targets: [
        { position: { x: 6, y: 1 }, icon: { type: 'star', color: 'yellow' }, },
        { position: { x: 9, y: 1 }, icon: { type: 'star', color: 'green' }, },
        { position: { x: 1, y: 2 }, icon: { type: 'cog', color: 'green' }, },
        { position: { x: 14, y: 2 }, icon: { type: 'moon', color: 'yellow' }, },
        { position: { x: 10, y: 4 }, icon: { type: 'sat', color: 'red' }, },
        { position: { x: 6, y: 5 }, icon: { type: 'sat', color: 'blue' }, },
        { position: { x: 3, y: 6 }, icon: { type: 'moon', color: 'red' }, },
        { position: { x: 12, y: 6 }, icon: { type: 'cog', color: 'blue' }, },
        { position: { x: 4, y: 9 }, icon: { type: 'cog', color: 'yellow' }, },
        { position: { x: 6, y: 10 }, icon: { type: 'moon', color: 'blue' }, },
        { position: { x: 8, y: 10 }, icon: { type: 'sat', color: 'yellow' }, },
        { position: { x: 13, y: 11 }, icon: { type: 'star', color: 'blue' }, },
        { position: { x: 7, y: 12 }, icon: { type: 'hole', color: 'dark' }, },
        { position: { x: 1, y: 13 }, icon: { type: 'star', color: 'red' }, },
        { position: { x: 9, y: 13 }, icon: { type: 'moon', color: 'green' }, },
        { position: { x: 3, y: 14 }, icon: { type: 'sat', color: 'green' }, },
        { position: { x: 14, y: 14 }, icon: { type: 'cog', color: 'red' }, },
    ]
}