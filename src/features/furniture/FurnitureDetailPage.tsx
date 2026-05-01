import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getPublicFurniture} from "../../api/furniture.api.ts";
import {optimizeImage} from "../../utils/imageUtils.ts";

export default function FurnitureDetailPage() {
    const { furnitureCode } = useParams<{ furnitureCode: string }>();
    const [furniture, setFurniture] = useState<any>(null);
    const images = furniture?.imageUrls || [];

    useEffect(() => {
        if (!furnitureCode) return;
        getPublicFurniture(furnitureCode)
            .then(res => setFurniture(res.data))
            .catch(err => console.error("데이터 로딩 실패:", err));
    }, [furnitureCode]);


    if (!furniture) return <div className="flex h-screen items-center justify-center">로딩중...</div>;
    if (!images || images.length === 0) return <div className="p-10 text-center">이미지 없음</div>;

    return (
        <div className="w-full h-screen flex flex-col md:flex-row bg-white">

            {/* 모바일: 슬라이드 */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory">
                {images.map((img: string, index: number) => (
                    <img
                        key={index}
                        src={optimizeImage(img, 800)}
                        className="w-full h-full object-cover snap-center flex-shrink-0"
                        alt="furniture"
                    />
                ))}
            </div>

            {/* PC: 왼쪽 (이미지 영역) */}
            <div className="hidden md:flex md:w-3/4 flex-col items-center h-full overflow-y-auto pb-20 space-y-4 no-scrollbar">
                {images.map((img: string, index: number) => (
                    <img
                        key={index}
                        src={optimizeImage(img, 800)}
                        className="w-full max-w-[500px] object-cover"
                        alt="furniture"
                    />
                ))}
            </div>

            {/* 오른쪽 (정보 영역) */}
            <div className="md:w-1/4 h-auto md:h-full flex md:items-start md:justify-end px-6 md:pl-16 py-6 md:py-0">
                <div className="md:sticky space-y-3">

                    <p className="text-sm text-zinc-500 font-medium">
                        {furnitureCode}.
                    </p>

                    <p className="text-sm text-zinc-500">
                        {furniture.title}
                    </p>

                    <p className="text-sm text-zinc-500">
                        {furniture.width} * {furniture.height} * {furniture.volume}
                    </p>

                    <p className="text-sm text-zinc-500 pt-6">
                        {furniture.description}
                    </p>

                </div>
            </div>

        </div>
    );
}
