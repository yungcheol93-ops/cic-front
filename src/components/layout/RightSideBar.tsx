export default function RightSideBar({ isHome }: { isHome: boolean }) {
    const textColor = isHome ? "text-black" : "text-zinc-500";

    return (
        <aside className={`h-full flex flex-col justify-end ${textColor}`}>
            {/* pl-24는 너무 넓을 수 있으므로
               데스크탑 해상도에 따라 유동적으로 조절하거나 적절한 값으로 고정합니다.
            */}
            <div className="py-6 md:pl-10 lg:pl-16 grid text-right">
                <div className="text-xs md:text-sm leading-relaxed space-y-1">
                    <p className="font-medium">씨아이씨</p>
                    <p>강동구 풍성로42길 22 102호</p>
                </div>

                {/* 비어있는 영역도 구조를 잡아두면 나중에 텍스트 추가 시 레이아웃이 깨지지 않습니다. */}
                <div className="text-[10px] md:text-xs leading-relaxed pt-4 opacity-70">
                    <p>010 8234 6833</p>
                    <p>cicstudio@cicworks.com</p>
                </div>
            </div>
        </aside>
    );
}
