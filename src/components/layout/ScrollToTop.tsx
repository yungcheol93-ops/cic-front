// src/components/layout/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // 1. 일반적인 윈도우 스크롤 리셋
        window.scrollTo(0, 0);

        // 2. 현재 레이아웃 구조상 모바일 스크롤 컨테이너가 별도로 존재하므로 해당 영역도 리셋
        // Layout.tsx의 모바일 영역 div에 id="mobile-container"를 추가해야 합니다.
        const mobileContainer = document.getElementById("mobile-container");
        if (mobileContainer) {
            mobileContainer.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
}