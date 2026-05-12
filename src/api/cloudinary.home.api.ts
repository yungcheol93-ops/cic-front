import axios from "axios";
import imageCompression from "browser-image-compression";

/**
 * DSLR 원본 사진(10MB~50MB 이상)을
 * 웹용 4K 배경 이미지 수준으로 최적화하여 Cloudinary에 업로드
 *
 * - maxWidthOrHeight: 3840  -> 4K 해상도 유지
 * - initialQuality: 0.95    -> 거의 원본 수준의 화질
 * - maxSizeMB: 3            -> 일반적으로 1~3MB 수준으로 압축
 * - useWebWorker: true      -> 브라우저 UI 멈춤 방지
 */

export const uploadImages = async (
    file: File,
    onProgress?: (percent: number) => void
) => {
    // 업로드 전 이미지 최적화 (고화질 유지)
    const compressedFile = await imageCompression(file, {
        maxSizeMB: 3,
        maxWidthOrHeight: 3840,
        initialQuality: 0.95,
        useWebWorker: true,
    });

    const formData = new FormData();
    formData.append("file", compressedFile);
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