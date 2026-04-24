
import type { IProject } from "./IProject";

export interface IThumbnail {
    file?: File;
    preview?: string;
    imageUrl?: string;
}

export interface IProjectFormState {
    project: IProject;
    thumbnail: IThumbnail | null;
}