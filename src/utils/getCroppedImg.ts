// 유틸리티 함수 예시: Canvas를 이용해 크롭된 이미지 추출

/**
 * 이미지 URL을 HTML Image 객체로 변환하는 헬퍼 함수
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        // 교차 출처(CORS) 문제를 방지하기 위해 설정 (Cloudinary 이미지 등 외부 URL 사용 시 필수)
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
    });


export const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob); // 이 Blob을 File 객체로 변환해 업로드
        }, 'image/jpeg');
    });
};