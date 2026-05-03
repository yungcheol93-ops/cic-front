import {useState} from "react";
import ImageCropModal from "./ImageCropModal.tsx";

export default function ThumbnailUploader({
                                              thumbnail,
                                              setThumbnail,
                                              isEdit,
                                          }: any) {

    const [tempImage, setTempImage] = useState<string | null>(null);

    const displaySrc = thumbnail?.preview || thumbnail?.imageUrl;

    return (
        <section className="border p-2 bg-white shadow-sm mb-4">
            <div className="relative aspect-square max-w-[300px] mx-auto flex items-center justify-center bg-gray-100 overflow-hidden">
                {displaySrc ? (
                    <img src={displaySrc} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-400 text-sm">썸네일 이미지</div>
                )}

                {isEdit && (
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer transition-opacity">
                        사진 변경 (1:1 비율)
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setTempImage(URL.createObjectURL(file));
                            }}
                        />
                    </label>
                )}
            </div>

            {tempImage && (
                <ImageCropModal
                    image={tempImage}
                    onCropComplete={(croppedFile) => {
                        setThumbnail({
                            file: croppedFile,
                            preview: URL.createObjectURL(croppedFile),
                        });
                        setTempImage(null);
                    }}
                    onClose={() => setTempImage(null)}
                />
            )}
        </section>
    );
}