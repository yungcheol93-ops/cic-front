// src/features/home/pages/HomePage.tsx
import { useEffect, useState } from "react";
import {getHomeImage} from "../../api/home.api.ts";
import {optimizeImage} from "../../utils/imageUtils.ts";


type Slide = {
    id: number;
    imageUrl: string;
    orderIndex: number;
    isActive: boolean;
};


export default function HomePage() {

    const [slides, setSlides] = useState<Slide[]>([]);
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await getHomeImage();
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
    if (isLoading) return <div className="min-h-screen bg-black"/>;

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                {slides.length > 0 ? (
                    slides.map((slide, i) => {
                        const isFirst = i === 0; // 첫 번째 이미지인지 확인
                        return (
                            <img
                                key={slide.id}
                                src={optimizeImage(slide.imageUrl)}
                                alt=""
                                // 첫 번째 이미지는 즉시 로드(eager), 나머지는 천천히(lazy)
                                loading={isFirst ? "eager" : "lazy"}
                                // 브라우저에게 첫 번째 이미지의 우선순위가 높음을 알림
                                fetchPriority={isFirst ? "high" : "low"}
                                className={
                                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] " +
                                    (i === index ? "opacity-100" : "opacity-0")
                                }
                            />
                        );
                    })
                ) : (
                    <div className="absolute inset-0 bg-gray-800"/>
                )}
                <div className="absolute inset-0 bg-black/35"/>
            </div>
        </div>
    );
}