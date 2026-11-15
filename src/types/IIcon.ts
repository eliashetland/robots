export interface IIcon{
    type: string;
    color: string;
}

export interface IIconAsset extends IIcon{
    image: HTMLImageElement;
    id: number;
}