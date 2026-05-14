// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";

import { useLocation } from "react-router-dom";
import LeftSidebar from "./LeftSidebar.tsx";
import RightSideBar from "./RightSideBar.tsx";
import MobileHeader from "./MobileHeader";



export default function Layout({  isScrollable = true }) {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className={`w-full h-screen overflow-hidden ${isHome ? "" : "bg-white"}`}>
            {/* 모바일 헤더 */}
            <header className="md:hidden h-[60px] flex items-center">
                <MobileHeader isHome={isHome} />
            </header>

            {/* 데스크탑 레이아웃 */}
            <div className="hidden md:flex w-full h-full">
                {/* 왼쪽 사이드바 */}
                <aside className="flex-none w-[180px] lg:w-[220px] xl:w-[270px] h-full px-8 pt-14 pb-8 flex flex-col justify-between">
                    <LeftSidebar isHome={isHome} />
                </aside>

                {/* 메인 콘텐츠 */}
                <main
                    className={`flex-1 h-full relative pt-14 pb-8 ${
                        isHome
                            ? "overflow-hidden"
                            : isScrollable
                                ? "overflow-y-auto no-scrollbar bg-white"
                                : "overflow-hidden bg-white"
                    }`}
                >
                    {/* 콘텐츠 최대 너비 제한 + 화면 기준 중앙 정렬 */}
                    <div className="w-full max-w-[1200px] mx-auto h-full">
                        <Outlet />
                    </div>
                </main>

                {/* 오른쪽 사이드바 */}
                <footer className="flex-none w-[180px] lg:w-[220px] xl:w-[270px] h-full px-6 py-8 flex flex-col justify-end">
                    <RightSideBar isHome={isHome} />
                </footer>
            </div>

            {/* 모바일 콘텐츠 */}
            <div
                id="mobile-container"
                className="md:hidden h-[calc(100vh-60px)] overflow-y-auto"
            >
                <Outlet />
            </div>
        </div>
    );
}