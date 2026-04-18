// src/components/layout/MobileHeader.tsx
import { useState } from "react";
import LeftSidebar from "./LeftSidebar";

export default function MobileHeader({ isHome }: { isHome: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full h-[60px] bg-white">
            <div className="flex items-center justify-between h-full px-4">
                {/* 왼쪽: 로고 */}
                <p
                    className="font-cic text-lg cursor-pointer"
                    onClick={() => window.location.href = "/"}
                >
                    CIC Studio
                </p>

                {/* 오른쪽: 햄버거 버튼 */}
                <button
                    className="p-2 text-2xl"
                    onClick={() => setOpen(true)}
                >
                    ☰
                </button>
            </div>

            {/* 슬라이드 메뉴 오버레이 */}
            {open && (
                <div className="fixed inset-0 z-[100]">

                    {/* 배경 (딤 처리) */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* 메뉴 본체: 왼쪽에서 튀어나오는 화이트 보드 */}
                    <div className="absolute left-0 top-0 w-[260px] h-full bg-white p-4 shadow-xl flex flex-col">
                        <div className="flex justify-end mb-4">
                            <button
                                className="text-lg"
                                onClick={() => setOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* 내부 사이드바 컨텐츠 */}
                        <div className="flex-1 overflow-y-auto">
                            <LeftSidebar isHome={false} onClose={() => setOpen(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}