import type { ITarget } from "./ITarget";
import type { IWall } from "./IWall";


export interface IBoard {
    walls: IWall[];
    targets: ITarget[];
}