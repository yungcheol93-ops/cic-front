// src/components/layout/Layout.tsx
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import LeftSidebar from "./LeftSidebar.tsx";
import RightSideBar from "./RightSideBar.tsx";
import MobileHeader from "./MobileHeader";

export default function Layout({ children }: PropsWithChildren) {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="w-screen h-screen overflow-hidden">
            {/* 모바일 헤더 */}
            <div className="block md:hidden">
                <MobileHeader isHome={isHome} />
            </div>

            {/* 데스크탑 레이아웃 */}
            <div className="hidden md:flex w-full h-full text-white">

                {/* 왼쪽 사이드바 */}
                <aside className="w-[20vw] h-full px-12 py-6 flex flex-col justify-between">
                    <LeftSidebar isHome={isHome} />
                </aside>
                {/* 메인 영역 */}
                <main className= { "w-[60vw] h-full " +
                (isHome
                    ? "overflow-hidden"                    // 메인에서는 스크롤 없음
                    : "overflow-y-auto no-scrollbar")      // 나머지 페이지: 가운데만 스크롤 + 스크롤바 숨김
                }>
                    {children}
                </main>
                {/*오른쪽 사이드바 바닥*/}
                <footer className="w-[20vw] h-full flex flex-col justify-end">
                    <RightSideBar isHome={isHome} />
                </footer>
            </div>

            {/* 모바일 컨텐츠 */}
            <div className="block md:hidden h-[calc(100%-60px)] overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
