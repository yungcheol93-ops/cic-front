import type {IImageItem, UploadItem} from "./Image.type.ts";

export interface ImageManagerProps {
    existingImages: IImageItem[];
    newImages: UploadItem[];

    addFiles: (files: FileList | File[]) => void;
    handleDragEnd: (event: any) => void;
    removeImage: (id: number) => void;

    fileInputRef: React.RefObject<HTMLInputElement | null>;
    isEditing?: boolean;
}