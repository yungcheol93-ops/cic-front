// src/components/layout/MobileHeader.tsx
import { useState } from "react";
import LeftSidebar from "./LeftSidebar";


export default function MobileHeader({ isHome }: { isHome: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* 상단 바 */}
            <div className="flex justify-between items-center px-4 h-[60px] border-b bg-white text-black">
                <p className="font-cic text-lg">CIC Studio</p>

                <button onClick={() => setOpen(true)}>
                    ☰
                </button>
            </div>

            {/* 슬라이드 메뉴 */}
            {open && (
                <div className="fixed inset-0 z-50">

                    {/* 배경 */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setOpen(false)}
                    />

                    {/* 메뉴 */}
                    <div className="absolute left-0 top-0 w-72 h-full bg-white p-6 shadow-lg">
                        <button
                            className="mb-6"
                            onClick={() => setOpen(false)}
                        >
                            ✕
                        </button>

                        <LeftSidebar isHome={false} />
                    </div>
                </div>
            )}
        </>
    );
}