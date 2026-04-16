// src/components/layout/Layout.tsx
import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import LeftSidebar from "./LeftSidebar.tsx";
import RightSideBar from "./RightSideBar.tsx";


export default function Layout({ children }: PropsWithChildren) {
    const location = useLocation();

    // 메인페이지 여부
    const isHome = location.pathname === "/";

    return (
        <div className="relative w-screen h-screen flex overflow-hidden text-white">
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
    );
}
