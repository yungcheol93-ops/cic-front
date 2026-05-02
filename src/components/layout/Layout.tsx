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
        <div className={`w-full h-screen overflow-hidden ${isHome ? "bg-transparent" : "bg-white"}`}>

            {/* 1. 모바일 헤더 (768px 미만에서만 보임) */}
            <header className="md:hidden h-[60px] flex items-center">
                <MobileHeader isHome={isHome} />
            </header>

            {/* 2. 데스크탑 레이아웃 (768px 이상에서만 flex로 작동) */}
            <div className="hidden md:flex w-full h-full">

                {/* 왼쪽 사이드바: vw 대신 고정 너비 사용 (화면 크기에 따라 너비 조절) */}
                <aside className="flex-none w-[200px] lg:w-[250px] xl:w-[300px] h-full px-8 pt-14 pb-8 flex flex-col justify-between ">
                    <LeftSidebar isHome={isHome} />
                </aside>

                {/* 메인 컨텐츠 영역: 남는 공간을 모두 차지(flex-1) */}
                <main className={`flex-1 h-full relative pt-14 pb-8 ${
                    isHome 
                        ? "overflow-hidden bg-transparent"
                        : isScrollable
                            ? "overflow-y-auto no-scrollbar bg-white"
                            : "overflow-hidden bg-white"
                }`}>
                    <Outlet />
                </main>

                {/* 오른쪽 사이드바/푸터 */}
                <footer className="flex-none w-[200px] lg:w-[250px] xl:w-[300px] h-full px-6 py-8 flex flex-col justify-end ">
                    <RightSideBar isHome={isHome} />
                </footer>
            </div>

            {/* 3. 모바일 컨텐츠 영역 (헤더 높이 60px 제외) */}
            <div id="mobile-container" className="md:hidden h-[calc(100vh-60px)] overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}