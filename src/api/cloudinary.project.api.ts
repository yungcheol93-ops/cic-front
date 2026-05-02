import {extractPublicId} from "../utils/cloudinary.util.ts";
import api from "./axiosInstance.ts";

export const uploadImages = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "project-images");

     formData.append("folder", "project");

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await res.json();
    return data.secure_url;
};

export const deleteImage = async (imageUrl: string) => {
    const publicId = extractPublicId(imageUrl);

    if (!publicId) return;

    await api.post("/admin/cloudinary/delete", { publicId });
};