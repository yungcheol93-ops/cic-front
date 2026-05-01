import type {IFurniture} from "./IFurniture.ts";


export interface IThumbnail {
    file?: File;
    preview?: string;
    imageUrl?: string;
}

export interface IFurnitureFormState {
    furniture: IFurniture;
    thumbnail: IThumbnail | null;
}