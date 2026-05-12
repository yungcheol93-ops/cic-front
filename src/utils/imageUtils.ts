export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
    });

export const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas context를 생성할 수 없습니다.");

    canvas.width = Math.ceil(pixelCrop.width);
    canvas.height = Math.ceil(pixelCrop.height);

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
    );
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) reject(new Error("Canvas가 비어있습니다."));
            else resolve(blob);
        }, "image/jpeg", 0.85);
    });
};
/**
 * Cloudinary 이미지 최적화 함수
 * @param url 원본 이미지 URL
 * @param width 원하는 이미지 너비 (기본값 1920)
 */
export const getThumbnail = (url?: string) => {
    if (!url) return undefined;

    return url.replace(
        "/upload/",
        "/upload/f_auto,q_auto:good,w_600,c_limit/"
    );
};


export const optimizeImage = (url?: string, width: number = 700) => {
    if (!url) return undefined;
    if (!url.includes("/upload/")) return url;

    // dpr_auto: 사용자 기기 화질에 맞춤
    // f_auto: 최적 포맷(WebP 등) 변환
    // q_auto:good: 화질과 용량의 최적 밸런스
    return url.replace(
        "/upload/",
        `/upload/f_auto,q_auto:best,w_${width},c_limit,dpr_auto/`
    );
};

export const optimizeHomeImage = (url?: string) => {
    if (!url) return "/images/no-image.png";
    if (!url.includes("/upload/")) return url;

    return url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_3840,c_limit/"
    );
};