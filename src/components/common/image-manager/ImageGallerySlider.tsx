//이미지 슬라이드, 삭제
import {optimizeImage} from "../../../utils/imageUtils.ts";

export default function ImageGallerySlider({
                                         images,
                                         currentIndex,
                                         setCurrentIndex,
                                         onRemove,
                                         isEdit,
                                     }: any) {

    const current = images[currentIndex];

    return (
        <div className="hidden md:flex relative flex-1 w-full  items-center justify-center bg-zinc-50 overflow-hidden">   {/* 메인 이미지 */}
            {current ? (
                <img
                    src={optimizeImage(current.imageUrl || current.preview || undefined)}
                    className="w-full h-full object-contain max-h-[75vh]"
                    alt={`Project Image ${currentIndex + 1}`}
                    fetchPriority="high"
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    이미지 없음
                </div>
            )}
            <div
                className="absolute left-0 top-0 w-1/2 h-full z-20 group/left cursor-pointer"
            >
                <button
                    onClick={() => setCurrentIndex((p: number) => (p === 0 ? images.length - 1 : p - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2
                           opacity-0 group-hover/left:opacity-100 transition-opacity duration-300
                           text-zinc-900/40 hover:text-zinc-900"
                    aria-label="Previous"
                >
                    <span className="text-5xl font-extralight">{"<"}</span>
                </button>
            </div>
            <div
                className="absolute right-0 top-0 w-1/2 h-full z-20 group/right cursor-pointer"
            >
                <button onClick={() => setCurrentIndex((p: number) => (p === images.length - 1 ? 0 : p + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2
                           opacity-0 group-hover/right:opacity-100 transition-opacity duration-300
                           text-zinc-900/40 hover:text-zinc-900"
                        aria-label="Next"
                >
                    <span className="text-5xl font-extralight">{">"}</span>
                </button>
            </div>

            {/* 삭제 */}
            {isEdit && current && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(currentIndex);
                    }}
                    className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 z-50 "
                >
                    삭제
                </button>
            )}
        </div>
    );
}