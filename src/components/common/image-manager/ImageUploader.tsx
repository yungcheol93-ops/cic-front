import ThumbnailUploader from "./ThumbnailUploader.tsx";
import ImageGallerySlider from "./ImageGallerySlider.tsx";
import SortableImageList from "./SortableImageList.tsx";
import { useState } from "react";
import type {IProjectImage} from "../../../types/admin/project/IProjectImage.ts";
import ImageGalleryVertical from "./ImageGalleryVertical.tsx";

interface Props {
    images: IProjectImage[];
    setImages: (images: IProjectImage[]) => void;
    thumbnail: any;
    setThumbnail: (thumb: any) => void;
    isEdit?: boolean;
    viewType?: "slider" | "vertical"; //좌우 슬라이드(인테리어), 세로 나열(가구)
}

export default function ImageUploader({
                                          images,
                                          setImages,
                                          thumbnail,
                                          setThumbnail,
                                          isEdit = true,
                                          viewType
                                      }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // 이미지 업로드
    const handleImageUpload = (files: FileList) => {
        const newImages = Array.from(files).map((file, index) => ({
            // id: Date.now() + index,
            file,
            preview: URL.createObjectURL(file),
        }));

        setImages([...images, ...newImages]);
    };

    // 삭제
    const handleRemoveImage = (id: string | number) => {
        const newImages = images.filter((img) => img.id !== id);
        setImages(newImages);
        setCurrentIndex((prev) =>
            newImages.length === 0 ? 0 : Math.min(prev, newImages.length - 1)
        );
    };

    // 정렬
    const handleReorder = (newImages: IProjectImage[]) => {
        setImages(newImages);
    };

    return (
        <div className="space-y-1">
            {/* 썸네일 */}
            <ThumbnailUploader
                thumbnail={thumbnail}
                setThumbnail={setThumbnail}
                isEdit={isEdit}
            />

            {/* 메인 이미지 */}

            {viewType === "slider" ? (
                <ImageGallerySlider
                    images={images}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    onRemove={handleRemoveImage}
                    isEdit={isEdit}
                />
                ) : (
                <ImageGalleryVertical
                images={images}
                onRemove={handleRemoveImage}
                isEdit={isEdit}
                />
            )}

            <div className="flex justify-end mb-2 mt-2">
            {/* 업로드 버튼 */}
            {isEdit && (
                <label className="inline-flex items-center gap-2 px-4 bg-black text-white cursor-pointer hover:bg-gray-800 transition">
                    + 이미지 추가
                    <input
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => handleImageUpload(e.target.files!)}
                    />
                </label>
            )}
            </div>
            {/* 정렬 리스트 */}
            <SortableImageList
                images={images}
                setImages={handleReorder}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            />
        </div>
    );
}