// src/features/home/pages/HomePage.tsx
import { useEffect, useState } from "react";
import {getHomeImageList} from "../../api/home.api.ts";


type Slide = {
    id: number;
    imageUrl: string;
    orderIndex: number;
    isActive: boolean;
};

// 이미지 최적화
const optimize = (url?: string) => {
    if (!url) return "";
    if (!url.includes("/upload/")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_1920,c_limit/");
};

export default function HomePage() {

    const [slides, setSlides] = useState<Slide[]>([]);
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await getHomeImageList();
                // 활성화된 이미지만 필터링하고 순서대로 정렬
                const activeSlides = (Array.isArray(res.data) ? res.data : [])
                    .filter((s: Slide) => s.isActive)
                    .sort((a, b) => a.orderIndex - b.orderIndex);

                setSlides(activeSlides);
            } catch (error) {
                console.error("Failed to fetch home images:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return; // 이미지가 1개 이하면 넘길 필요 없음

        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000); //5초마다 슬라이드

        return () => clearInterval(id);
    }, [slides.length]);

    // 데이터 로딩 중이거나 이미지가 없을 때의 처리
    if (isLoading) return <div className="min-h-screen bg-black" />;

    return (
        <div className="relative min-h-screen">
            {/* 메인 페이지에서만 전체 화면에 깔리는 배경 슬라이드 */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                {slides.length > 0 ? (
                    slides.map((slide, i) => (
                        <img
                            key={slide.id}
                            src={optimize(slide.imageUrl)}
                            alt=""
                            className={
                                "absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] " +
                                (i === index ? "opacity-100" : "opacity-0")
                            }
                        />
                    ))
                ) : (
                    /* 이미지가 하나도 없을 때 보여줄 기본 배경 */
                    <div className="absolute inset-0 bg-gray-800" />
                )}

                {/* 오버레이 (텍스트 가독성을 위해 살짝 어둡게) */}
                <div className="absolute inset-0 bg-black/35" />
            </div>

            {/* 메인 컨텐츠가 들어갈 자리 */}
            <div className="relative z-10">
                {/* 여기에 메인 문구나 버튼 등을 추가하세요 */}
            </div>
        </div>
    );
}