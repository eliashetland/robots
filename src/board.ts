import { ART_SIZE, EDGE_WIDTH, GRID_SIZE, WALL_WIDTH } from "./constants";
import type { IBoard } from "./types/IBoard";
import type { IIconAsset } from "./types/IIcon";
import type { IPosition } from "./types/IPosition";
import type { ITarget } from "./types/ITarget";
import type { IWall } from "./types/IWall";

type Direction = 'up' | 'right' | 'down' | 'left';
type RobotMove = { robotId: number; position: IPosition };

function loadImage(image: HTMLImageElement, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        image.src = src;
    });
}

const assetPath = (filename: string) => `${import.meta.env.BASE_URL}assets/${filename}`;


export class Board {
    ctx: CanvasRenderingContext2D;

    tile: HTMLImageElement = new Image(ART_SIZE, ART_SIZE);
    wallH: HTMLImageElement = new Image(ART_SIZE, ART_SIZE);
    wallV: HTMLImageElement = new Image(ART_SIZE, ART_SIZE);
    edgeH: HTMLImageElement = new Image(ART_SIZE, ART_SIZE);
    edgeV: HTMLImageElement = new Image(ART_SIZE, ART_SIZE);

    iconAssets: IIconAsset[] = [
        { image: new Image(ART_SIZE, ART_SIZE), type: 'moon', color: 'blue', id: 1 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'moon', color: 'green', id: 2 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'moon', color: 'yellow', id: 3 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'moon', color: 'red', id: 4 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'sat', color: 'green', id: 5 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'sat', color: 'blue', id: 6 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'sat', color: 'yellow', id: 7 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'sat', color: 'red', id: 8 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'cog', color: 'red', id: 9 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'cog', color: 'blue', id: 10 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'cog', color: 'yellow', id: 11 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'cog', color: 'green', id: 12 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'star', color: 'red', id: 13 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'star', color: 'blue', id: 14 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'star', color: 'yellow', id: 15 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'star', color: 'green', id: 16 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'hole', color: 'dark', id: 17 },
    ];

    robots: IIconAsset[] = [
        { image: new Image(ART_SIZE, ART_SIZE), type: 'robot', color: 'red', id: 18 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'robot', color: 'blue', id: 19 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'robot', color: 'yellow', id: 20 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'robot', color: 'green', id: 21 },
        { image: new Image(ART_SIZE, ART_SIZE), type: 'robot', color: 'black', id: 22 },
    ];

    #getIconAsset(type: string, color: string): IIconAsset {
        return this.iconAssets.find(icon => icon.type === type && icon.color === color) as IIconAsset;
    }

    #getIconAssetById(id: number): IIconAsset {
        return this.iconAssets.find(icon => icon.id === id) as IIconAsset;
    }

    walls: IWall[] = [
        //center
        { from: { x: 6, y: 7 }, to: { x: 7, y: 7 } },
        { from: { x: 6, y: 8 }, to: { x: 7, y: 8 } },
        { from: { x: 7, y: 6 }, to: { x: 7, y: 7 } },
        { from: { x: 8, y: 6 }, to: { x: 8, y: 7 } },
        { from: { x: 8, y: 7 }, to: { x: 9, y: 7 } },
        { from: { x: 8, y: 8 }, to: { x: 9, y: 8 } },
        { from: { x: 7, y: 8 }, to: { x: 7, y: 9 } },
        { from: { x: 8, y: 8 }, to: { x: 8, y: 9 } },
    ];

    robotPositions: { [key: number]: { x: number; y: number } } = {
        18: { x: 0, y: 0 }, // Red robot
        19: { x: 15, y: 0 }, // Blue robot
        20: { x: 0, y: 15 }, // Yellow robot
        21: { x: 15, y: 15 }, // Green robot
        22: { x: 4, y: 7 }, // Black robot (center)
    };
    targets: ITarget[];
    imgLoaded: Promise<void>;
    #selectedRobotId: number | null = null;
    #currentIconId: number | null = null;
    #moveHistory: RobotMove[] = [];
    #roundStartPositions: { [key: number]: IPosition } = {};
    #roundComplete = false;

    constructor(ctx: CanvasRenderingContext2D, board: IBoard) {
        this.ctx = ctx;

        this.walls = this.walls.concat(board.walls);
        this.targets = board.targets;

        this.imgLoaded = Promise.all([
            loadImage(this.tile, assetPath('tile.png')),
            loadImage(this.wallH, assetPath('wall-h.png')),
            loadImage(this.wallV, assetPath('wall-v.png')),
            loadImage(this.edgeH, assetPath('edge-h.png')),
            loadImage(this.edgeV, assetPath('edge-v.png')),
            ...this.iconAssets.map(icon => loadImage(icon.image, assetPath(`${icon.type}-${icon.color}.png`))),
            ...this.robots.map(robot => loadImage(robot.image, assetPath(`${robot.type}-${robot.color}.png`))),

        ]).then(() => undefined);
    }

    async newBoard() {
        await this.imgLoaded;
        this.#drawBoard();
    }

    showNextIcon(iconId: number) {
        this.#currentIconId = iconId;
        this.#roundStartPositions = Object.fromEntries(
            Object.entries(this.robotPositions).map(([id, position]) => [id, { ...position }]),
        );
        this.#roundComplete = false;
        this.#drawBoard();
    }

    resetMoveHistory() {
        this.#moveHistory = [];
        this.#currentIconId = null;
        this.#selectedRobotId = null;
        this.#roundComplete = false;
    }

    get movesThisRound(): number {
        return this.#moveHistory.length;
    }

    get roundComplete(): boolean {
        return this.#roundComplete;
    }

    retryRound(): boolean {
        if (this.#currentIconId === null || Object.keys(this.#roundStartPositions).length === 0) {
            return false;
        }
        this.robotPositions = Object.fromEntries(
            Object.entries(this.#roundStartPositions).map(([id, position]) => [id, { ...position }]),
        );
        this.#moveHistory = [];
        this.#selectedRobotId = null;
        this.#roundComplete = false;
        this.#drawBoard();
        return true;
    }

    undoLastMove(): boolean {
        if (this.#roundComplete) {
            return false;
        }
        const move = this.#moveHistory.pop();
        if (!move) {
            return false;
        }
        this.robotPositions[move.robotId] = { ...move.position };
        this.#selectedRobotId = null;
        this.#drawBoard();
        return true;
    }

    handleClick(x: number, y: number) {
        if (this.#currentIconId === null || this.#roundComplete) {
            return;
        }
        const tileX = Math.floor(x / ART_SIZE);
        const tileY = Math.floor(y / ART_SIZE);
        const robot = this.#getRobotAt(tileX, tileY);

        if (robot && robot.id !== this.#selectedRobotId) {
            this.#selectedRobotId = robot.id;
            this.#drawBoard();
            return;
        }

        if (this.#selectedRobotId === null) {
            return;
        }

        const position = this.robotPositions[this.#selectedRobotId];
        const direction = this.#getDirectionFromClick(x, y);
        if (direction) {
            this.#moveSelectedRobot(direction);
            return;
        }

        if (!position || tileX !== position.x || tileY !== position.y) {
            this.#selectedRobotId = null;
            this.#drawBoard();
            return;
        }

    }

    handleDrag(startX: number, startY: number, endX: number, endY: number): boolean {
        if (this.#currentIconId === null || this.#roundComplete) {
            return false;
        }
        const robot = this.#getRobotAt(
            Math.floor(startX / ART_SIZE),
            Math.floor(startY / ART_SIZE),
        );
        if (!robot) {
            return false;
        }

        const deltaX = endX - startX;
        const deltaY = endY - startY;
        if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) {
            return false;
        }

        this.#selectedRobotId = robot.id;
        const direction: Direction = Math.abs(deltaX) > Math.abs(deltaY)
            ? deltaX > 0 ? 'right' : 'left'
            : deltaY > 0 ? 'down' : 'up';
        this.#moveSelectedRobot(direction);
        return true;
    }

    #getRobotAt(tileX: number, tileY: number): IIconAsset | undefined {
        return this.robots.find(robot => {
            const position = this.robotPositions[robot.id];
            return position !== undefined && position.x === tileX && position.y === tileY;
        });
    }

    #drawBoard() {
        this.#drawTiles();
        this.#drawEdges();
        this.#drawWalls();
        this.#drawTargets();
        this.#drawRobots();
        this.#drawCurrentIcon();
        this.#drawRobotArrows();
    }

    #drawCurrentIcon() {
        if (this.#currentIconId === null) {
            return;
        }
        const target = this.#getIconAssetById(this.#currentIconId);
        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(7.5 * ART_SIZE, 7.5 * ART_SIZE, ART_SIZE, ART_SIZE);
        this.ctx.drawImage(target.image, 7.5 * ART_SIZE, 7.5 * ART_SIZE, ART_SIZE, ART_SIZE);
    }
    #drawTiles() {
        this.ctx.fillRect(0, 0, GRID_SIZE * ART_SIZE, GRID_SIZE * ART_SIZE);
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {

                if (x >= 7 && x <= 8 && y >= 7 && y <= 8) {
                    //center area
                    this.ctx.fillStyle = 'grey';
                    this.ctx.fillRect(x * ART_SIZE, y * ART_SIZE, ART_SIZE, ART_SIZE);
                } else {
                    this.ctx.drawImage(this.tile, x * ART_SIZE, y * ART_SIZE);
                }
            }
        }
    }
    #drawEdges() {
        for (let x = 0; x < GRID_SIZE; x++) {
            this.ctx.drawImage(this.edgeH, x * ART_SIZE, 0);
            this.ctx.drawImage(this.edgeH, x * ART_SIZE, (GRID_SIZE * ART_SIZE) - EDGE_WIDTH);
        }
        for (let y = 0; y < GRID_SIZE; y++) {
            this.ctx.drawImage(this.edgeV, 0, y * ART_SIZE);
            this.ctx.drawImage(this.edgeV, (GRID_SIZE * ART_SIZE) - EDGE_WIDTH, y * ART_SIZE);
        }
    }
    #drawWalls() {
        for (const wall of this.walls) {
            const { from, to } = wall;
            if (from.x === to.x) {
                // Horizontal wall
                const x = (from.x) * ART_SIZE;
                const y = Math.max(from.y, to.y) * ART_SIZE - WALL_WIDTH / 2;
                this.ctx.drawImage(this.wallH, x, y);
            } else if (from.y === to.y) {
                // Vertical wall
                const x = Math.max(from.x, to.x) * ART_SIZE - WALL_WIDTH / 2;
                const y = (from.y) * ART_SIZE;
                this.ctx.drawImage(this.wallV, x, y);
            }
        }
    }
    #drawTargets() {
        for (const target of this.targets) {
            const { position, icon } = target;
            const x = position.x * ART_SIZE;
            const y = position.y * ART_SIZE;
            const iconAsset = this.#getIconAsset(icon.type, icon.color);
            if (!iconAsset) {
                console.error(`Icon asset not found for type: ${icon.type}, color: ${icon.color}`);
                continue;
            }
            // Draw the target based on its icon
            this.ctx.drawImage(iconAsset.image, x, y, ART_SIZE, ART_SIZE);
        }
    }
    #drawRobots() {
        for (const robot of this.robots) {
            const position = this.robotPositions[robot.id];
            if (!position) {
                console.error(`Robot position not found for id: ${robot.id}`);
                continue;
            }
            const x = position.x * ART_SIZE;
            const y = position.y * ART_SIZE;

            this.ctx.drawImage(robot.image, x, y, ART_SIZE, ART_SIZE);
        }
    }

    #drawRobotArrows() {
        if (this.#selectedRobotId === null) {
            return;
        }
        const position = this.robotPositions[this.#selectedRobotId];
        if (!position) {
            return;
        }
        this.ctx.strokeStyle = 'rgba(14, 38, 58, 0.9)';
        this.ctx.lineWidth = 7;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        for (const direction of ['up', 'right', 'down', 'left'] as Direction[]) {
            const nextPosition = this.findNextCell(position, direction);
            if (nextPosition.x === position.x && nextPosition.y === position.y) {
                continue;
            }
            const arrowPosition = this.#getAdjacentPosition(position, direction);
            this.#drawArrow(
                (arrowPosition.x + 0.5) * ART_SIZE,
                (arrowPosition.y + 0.5) * ART_SIZE,
                direction,
            );
        }
    }

    #drawArrow(centerX: number, centerY: number, direction: Direction) {
        const points: Record<Direction, [number, number][]> = {
            up: [[centerX, centerY + 12], [centerX, centerY - 12], [centerX - 9, centerY - 3], [centerX, centerY - 12], [centerX + 9, centerY - 3]],
            right: [[centerX - 12, centerY], [centerX + 12, centerY], [centerX + 3, centerY - 9], [centerX + 12, centerY], [centerX + 3, centerY + 9]],
            down: [[centerX, centerY - 12], [centerX, centerY + 12], [centerX - 9, centerY + 3], [centerX, centerY + 12], [centerX + 9, centerY + 3]],
            left: [[centerX + 12, centerY], [centerX - 12, centerY], [centerX - 3, centerY - 9], [centerX - 12, centerY], [centerX - 3, centerY + 9]],
        };
        this.ctx.beginPath();
        points[direction].forEach(([x, y], index) => {
            if (index === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        });
        this.ctx.stroke();
    }

    #getDirectionFromClick(x: number, y: number): Direction | null {
        const position = this.robotPositions[this.#selectedRobotId!];
        const tileX = Math.floor(x / ART_SIZE);
        const tileY = Math.floor(y / ART_SIZE);
        const deltaX = tileX - position.x;
        const deltaY = tileY - position.y;
        if (deltaX === 0 && deltaY === -1) return 'up';
        if (deltaX === 1 && deltaY === 0) return 'right';
        if (deltaX === 0 && deltaY === 1) return 'down';
        if (deltaX === -1 && deltaY === 0) return 'left';
        return null;
    }

    #getAdjacentPosition(position: IPosition, direction: Direction): IPosition {
        const offsets: Record<Direction, IPosition> = {
            up: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
        };
        const offset = offsets[direction];
        return { x: position.x + offset.x, y: position.y + offset.y };
    }

    findNextCell(position: IPosition, direction: Direction): IPosition {
        const offsets: Record<Direction, IPosition> = {
            up: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
        };
        let nextPosition = { ...position };
        const offset = offsets[direction];

        while (true) {
            const candidate = {
                x: nextPosition.x + offset.x,
                y: nextPosition.y + offset.y,
            };
            if (candidate.x < 0 || candidate.x >= GRID_SIZE ||
                candidate.y < 0 || candidate.y >= GRID_SIZE ||
                this.#hasWallBetween(nextPosition, candidate) ||
                this.robots.some(robot => {
                    const robotPosition = this.robotPositions[robot.id];
                    return robotPosition?.x === candidate.x && robotPosition?.y === candidate.y;
                })) {
                return nextPosition;
            }
            nextPosition = candidate;
        }
    }

    #hasWallBetween(from: IPosition, to: IPosition): boolean {
        return this.walls.some(wall =>
            (wall.from.x === from.x && wall.from.y === from.y &&
                wall.to.x === to.x && wall.to.y === to.y) ||
            (wall.from.x === to.x && wall.from.y === to.y &&
                wall.to.x === from.x && wall.to.y === from.y),
        );
    }

    #moveSelectedRobot(direction: Direction) {
        const robotId = this.#selectedRobotId!;
        const position = this.robotPositions[robotId];
        const nextPosition = this.findNextCell(position, direction);
        if (nextPosition.x === position.x && nextPosition.y === position.y) {
            this.#selectedRobotId = null;
            this.#drawBoard();
            return;
        }
        this.#moveHistory.push({ robotId, position: { ...position } });
        position.x = nextPosition.x;
        position.y = nextPosition.y;
        if (this.#isCorrectRobotAtTarget(robotId)) {
            this.#roundComplete = true;
        }
        this.#selectedRobotId = null;
        this.#drawBoard();
    }

    #isCorrectRobotAtTarget(robotId: number): boolean {
        const robot = this.robots.find(candidate => candidate.id === robotId);
        const position = this.robotPositions[robotId];
        const target = this.targets.find(candidate =>
            candidate.position.x === position.x &&
            candidate.position.y === position.y &&
            candidate.icon.color === robot?.color,
        );
        if (!target || this.#currentIconId === null) {
            return false;
        }
        const targetAsset = this.#getIconAsset(target.icon.type, target.icon.color);
        return targetAsset.id === this.#currentIconId;
    }
}
