
export default function AboutPage() {
    return (
        <div className="h-full flex flex-col pt-8 md:pt-14 pb-8 w-full max-w-[1200px] mx-auto">

            <section className="hidden md:flex relative flex-1 w-full max-h-[65vh] items-center justify-center bg-zinc-50 overflow-hidden group rounded-md">
                <img
                    src="/images/about/about.png"
                    className="w-full h-full object-contain transition-all duration-500"
                    alt="About Image"
                />
            </section>

            {/* 브랜드 소개 */}
            <section className=" absolute bottom-0 mt-6 mb-10 text-right px-2 md:px-0 w-full">

                <p className="text-gray-600 leading-relaxed">
                    씨아이씨(CIC) 라고 읽습니다.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    저희는 의자, 테이블 같은 가구디자인부터 전체 공간디자인까지 작업하는

                    실내건축 작업자 그룹입니다.
                </p>
            </section>


        </div>
    );
}