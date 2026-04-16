export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "cic-image");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpkao0kjk/image/upload",
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await res.json();
    return data.secure_url;
};