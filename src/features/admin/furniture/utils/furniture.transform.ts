import type {IFurnitureFormState} from "../../../../types/admin/furniture/furnitureForm.ts";

export const transformFurniture = (data: any): IFurnitureFormState => {
    return {
        furniture: {
            id: data.id,
            furnitureCode: data.furnitureCode,
            title: data.title,
            width: data.width,
            height: data.height,
            volume: data.volume,
            description: data.description,
            images: (data.images || []).map((img: any) => ({
                id: img.id,
                url: img.imageUrl,
                orderIndex: img.orderIndex,
            })),
            isPublic: data.isPublic,
            status: data.status,
        },
        thumbnail: data.thumbnailUrl
            ? { imageUrl: data.thumbnailUrl }
            : null,
    };
};