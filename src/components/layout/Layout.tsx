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
        <div className="w-full h-screen overflow-hidden bg-black">
            {/* 모바일 헤더 */}
            <div className="md:hidden h-[60px]">
                <MobileHeader isHome={isHome} />
            </div>

            {/* 데스크탑 레이아웃 */}
            <div className="hidden md:flex w-full h-full text-white">
                {/* 왼쪽 사이드바 */}
                <aside className="flex-none w-[300px] h-full px-8 py-6 flex flex-col justify-between">
                    <LeftSidebar isHome={isHome} />
                </aside>
                {/* 메인 영역 */}
                <main className={`flex-1 h-full ${
                    isHome ? "overflow-hidden" : "overflow-y-auto no-scrollbar"
                }`}>
                    <div className="max-w-[1200px] mx-auto w-full h-full"> {/* 내부 컨텐츠 폭 제한 */}
                        {children}
                    </div>
                </main>
                {/*오른쪽 사이드바 바닥*/}
                <footer className="flex-none w-[300px] h-full px-8 py-6 flex flex-col justify-end">
                    <RightSideBar isHome={isHome} />
                </footer>
            </div>

            {/* 모바일 컨텐츠 */}
            <div className="md:hidden h-[calc(100vh-60px)] overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
