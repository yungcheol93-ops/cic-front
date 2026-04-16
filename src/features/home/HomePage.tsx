// src/features/home/pages/HomePage.tsx
import { useEffect, useState } from "react";

const heroImages = [
    "../src/assets/images/main/1.jpg",
    "../src/assets/images/main/2.jpg",
    "../src/assets/images/main/3.jpg",
    "../src/assets/images/main/4.jpg",
    "../src/assets/images/main/5.jpg",
    "../src/assets/images/main/6.jpg",
    "../src/assets/images/main/7.jpg",
    "../src/assets/images/main/8.jpg",

];



export default function HomePage() {

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % heroImages.length);
        }, 10000); // 10초마다 변경
        return () => clearInterval(id);
    }, []);


    return (
        <>
            {/* 메인 페이지에서만 전체 화면에 깔리는 배경 슬라이드 */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                {heroImages.map((src, i) => (
                    <img
                        key={src}
                        src={src}
                        alt=""
                        className={
                            "absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] " +
                            (i === index ? "opacity-100" : "opacity-0")
                        }
                    />
                ))}
                {/* 살짝 어둡게 */}
                <div className="absolute inset-0 bg-black/35" />
            </div>
        </>
    );
}