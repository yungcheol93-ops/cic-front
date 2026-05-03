
export const uploadImages = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "about-images");

    formData.append("folder", "about");

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