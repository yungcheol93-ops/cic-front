export default function RightSideBar({ isHome }: { isHome: boolean }) {
    const textColor = isHome ? "text-black" : "text-zinc-500";

    return (
        <aside className={`h-full flex flex-col justify-end ${textColor}`}>
            {/* pl-24는 너무 넓을 수 있으므로
               데스크탑 해상도에 따라 유동적으로 조절하거나 적절한 값으로 고정합니다.
            */}
            <div className="lg:pl-12 grid text-right">
                <div className="text-xs md:text-xs  space-y-1">
                    <p className="font-medium">씨아이씨스튜디오</p>
                    <p>서울 강동구 풍성로 42길 22, 102</p>
                    <p>T. 02-476-9116</p>
                    <p>E. cicstudio@cicworks.com</p>
                </div>


            </div>
        </aside>
    );
}
