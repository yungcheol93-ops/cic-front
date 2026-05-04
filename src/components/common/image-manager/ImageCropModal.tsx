// components/common/image-manager/ImageCropModal.tsx
import { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../../utils/imageUtils"; // 아까 만든 함수

interface Props {
    image: string; // 원본 이미지 preview URL
    onCropComplete: (croppedFile: File) => void;
    onClose: () => void;
}


export default function ImageCropModal({ image, onCropComplete, onClose }: Props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    useEffect(() => {
        // 현재 스크롤 위치 저장 및 고정
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const handleComplete = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
            const file = new File([croppedBlob], "thumbnail.jpg", { type: "image/jpeg" });
            onCropComplete(file);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col touch-none">
            {/* 헤더나 안내 문구 추가 가능 */}
            <div className="relative flex-1 w-full bg-neutral-900">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                    onZoomChange={setZoom}
                    // 모바일에서 두 손가락 줌을 더 부드럽게 하려면 아래 속성 추가
                    showGrid={false}
                />
            </div>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%] z-[101] bg-black/50 px-4 py-2 rounded-full">
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            {/* 하단 컨트롤 바: 모바일 하단바(Safe Area) 대응을 위해 pb-safe 등을 고려 */}
            <div className="p-4 pb-8 bg-white w-full flex justify-center gap-4 border-t">
                <button onClick={onClose} className="flex-1 max-w-[150px] py-3 border rounded-md">취소</button>
                <button onClick={handleComplete} className="flex-1 max-w-[150px] py-3 bg-black text-white rounded-md font-bold">확인</button>
            </div>
        </div>
    );
}