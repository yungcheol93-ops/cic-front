// components/common/image-manager/ImageCropModal.tsx
import { useState } from "react";
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
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
            <div className="relative w-full h-[80vh]">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1} // 1:1 비율 고정
                    onCropChange={setCrop}
                    onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                    onZoomChange={setZoom}
                />
            </div>
            <div className="p-4 bg-white w-full flex justify-center gap-4">
                <button onClick={onClose} className="px-6 py-2 border">취소</button>
                <button onClick={handleComplete} className="px-6 py-2 bg-black text-white">확인</button>
            </div>
        </div>
    );
}