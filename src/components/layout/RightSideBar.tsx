export default function RightSideBar({ isHome }: { isHome: boolean }) {
    return (
        <div className={isHome ? "text-black" : "text-zinc-500"}>
            <div className="py-6 pl-24 grid text-right ">
                <div className="max-w-l text-sm leading-relaxed">
                    <p>씨아이씨</p>
                </div>
                <div className="max-w-xl text-sm  leading-relaxed pt-2">
                    <p>강동구 풍성로42길 22 102호</p>
                </div>
                <div className="max-w-xl text-sm leading-relaxed pt-2">
                    <p>010 8234 6833</p>
                    <p>cic studio@cicworks.com</p>
                </div>
            </div>
        </div>
    );
}