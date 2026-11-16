import type { ITarget } from "./ITarget";
import type { IWall } from "./IWall";


export interface IBoard {
    gridSize: number;
    robotColors: string[];
    walls: IWall[];
    targets: ITarget[];
}