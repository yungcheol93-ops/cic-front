
export interface IImageItem {
    id: number;
    url: string;
    orderIndex: number;
}

export interface UploadItem {
    id: number;
    file: File;
    preview: string;
    orderIndex: number;
}
