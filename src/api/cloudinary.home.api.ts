import axios from "axios";

export const uploadImages = async (
    file: File,
    onProgress?: (percent: number) => void
) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "home-images");

    formData.append("folder", "home");

    const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        formData,
        {
            onUploadProgress: (e) => {
                if (!onProgress) return;
                const percent = Math.round((e.loaded * 100) / (e.total || 1));
                onProgress(percent);
            },
        }
    );

    return res.data.secure_url;
};