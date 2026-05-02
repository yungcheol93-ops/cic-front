import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getPublicFurniture, getPublicFurnitureList } from "../../api/furniture.api.ts";
import { optimizeImage } from "../../utils/imageUtils.ts";

export default function FurnitureDetailPage() {
    const { furnitureCode } = useParams<{ furnitureCode: string }>();
    const navigate = useNavigate();
    const [furniture, setFurniture] = useState<any>(null);
    const [furnitureList, setFurnitureList] = useState<any[]>([]);
    const images = furniture?.imageUrls || [];

    useEffect(() => {
        if (!furnitureCode) return;

        // 상세 데이터 로드
        getPublicFurniture(furnitureCode).then(res => {
            setFurniture(res.data);
        });

        // 모바일 리스트 데이터 로드
        if (window.innerWidth < 768) {
            getPublicFurnitureList().then(res => setFurnitureList(res.data));
        }
    }, [furnitureCode]);

    // 모바일 전용: 현재 가구 이후의 리스트 필터링
    const nextFurnitures = useMemo(() => {
        const index = furnitureList.findIndex(f => f.furnitureCode === furnitureCode);
        return furnitureList.slice(index + 1);
    }, [furnitureList, furnitureCode]);

    if (!furniture) return <div className="flex h-screen items-center justify-center">로딩중...</div>;

    return (
        <div className="w-full flex flex-col md:flex-row bg-white">

            {/* ================= 1. 이미지 영역 ================= */}
            {/* 웹: 3/4 너비, 자체 스크롤 / 모바일: 세로 나열 */}
            <div className="w-full md:w-3/4">
                {/* 모바일 이미지 나열 */}
                <div className="block md:hidden space-y-4 px-4">
                    {images.map((img: string, index: number) => (
                        <img
                            key={index}
                            src={optimizeImage(img, 800)}
                            className="w-full object-cover rounded-sm"
                            alt="mobile-img"
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                    ))}
                </div>

                {/* 웹 이미지 나열 (자체 스크롤) */}
                <div className="hidden md:flex flex-col items-center h-[calc(100vh-100px)] overflow-y-auto pb-20 space-y-4 no-scrollbar">
                    {images.map((img: string, index: number) => (
                        <img
                            key={index}
                            src={optimizeImage(img, 1000)}
                            className="w-full max-w-[500px] object-cover"
                            alt="furniture"
                        />
                    ))}
                </div>
            </div>

            {/* ================= 2. 정보 영역 ================= */}
            {/* 웹: 우측 고정 / 모바일: 하단 노출 */}
            <div className="w-full md:w-1/4 px-6 md:pl-10 py-10 md:py-0">
                <div className="md:sticky md:top-0 space-y-3">
                    <p className="text-sm text-zinc-800 font-medium tracking-tighter">
                        {furnitureCode}.
                    </p>
                    <p className="text-sm text-zinc-600">
                        {furniture.title}
                    </p>
                    <p className="text-sm text-zinc-500">
                        {furniture.width} * {furniture.height} * {furniture.volume}
                    </p>

                    {/* 웹에서는 설명글이 길어질 경우 대비하여 개별 스크롤 가능하게 설정 */}
                    <p className="whitespace-pre-line text-sm text-zinc-600 pt-6 leading-relaxed md:max-h-[50vh] md:overflow-y-auto no-scrollbar">
                        {furniture.description}
                    </p>
                </div>

                {/* ================= 3. 모바일 전용 하단 리스트 ================= */}
                {nextFurnitures.length > 0 && (
                    <section className="mt-20 space-y-10 md:hidden border-t border-zinc-100 pt-10">
                        <div className="space-y-16">
                            {nextFurnitures.map((nf) => (
                                <div
                                    key={nf.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/works/furniture/${nf.furnitureCode}`)}
                                >
                                    <img
                                        src={optimizeImage(nf.thumbnailUrl, 700)}
                                        className="w-full"
                                        alt={nf.furnitureCode}
                                    />
                                    <div className="mt-4 text-left">
                                        <p className="text-sm font-medium tracking-tight text-zinc-800">{nf.furnitureCode}.</p>
                                        <p className="text-xs text-zinc-500 mt-1">{nf.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}