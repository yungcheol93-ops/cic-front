import {optimizeImage} from "../../../utils/imageUtils.ts";

export default function ImageGalleryVertical({
                                                 images,
                                                 onRemove,
                                                 isEdit,
                                             }: any) {
    return (
        <div className="space-y-4">
            {images.map((img: any, index: number) => {

                const src = img.imageUrl;

                if (!src) return null;

                return (
                    <div key={img.id} className="relative">
                        <img
                            src={optimizeImage(src)}
                            className="w-full h-full object-contain max-h-[75vh]"
                            alt={`image-${index}`}
                        />

                        {isEdit && (
                            <button
                                onClick={() => onRemove(index)}
                                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                            >
                                삭제
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}