import type {IImageItem} from "../../image/Image.type.ts";

export interface IFurniture {
    id: number;

    furnitureCode: string;

    title: string;
    width: string;
    height: string;
    volume: string;
    description: string;

    thumbnailUrl?: string;
    status:string;
    isPublic:boolean;
    images: IImageItem[];
}