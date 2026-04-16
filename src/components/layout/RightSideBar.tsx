export default function RightSideBar({ isHome }: { isHome: boolean }) {
    return (
        <div className={isHome ? "text-white" : "text-zinc-500"}>
            <div className="py-6 pl-24 grid">
                <div className="max-w-l text-sm leading-relaxed">
                    <p>씨아이씨</p>
                    <p>698-51-00740</p>
                </div>
                <div className="max-w-xl text-l  leading-relaxed pt-2">
                    <p>강남구 봉은사로 174, 401</p>
                </div>
                <div className="max-w-xl text-sm leading-relaxed pt-2">
                    <p>02) 0440-3845</p>
                    <p>studio@cicworks.com</p>
                </div>
            </div>
        </div>
    );
}