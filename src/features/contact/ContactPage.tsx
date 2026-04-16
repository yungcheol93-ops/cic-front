export default function ContactPage() {
    return (
        <div className="px-4 md:px-16 py-12 md:py-20 space-y-12 md:space-y-16">

            {/* 제목 */}
            <section className="text-center space-y-3 md:space-y-4">
                <h1 className="text-2xl md:text-3xl font-light tracking-wide">
                    CONTACT
                </h1>
                <p className="text-sm md:text-base text-gray-500">
                    공간 상담을 신청해보세요
                </p>
            </section>

            {/* 정보 */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-center">

                <div className="bg-white p-5 md:p-6 rounded-lg shadow-sm border">
                    <p className="font-medium text-sm md:text-base">PHONE</p>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">
                        010-1234-5678
                    </p>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-lg shadow-sm border">
                    <p className="font-medium text-sm md:text-base">EMAIL</p>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">
                        info@cic.com
                    </p>
                </div>

                <div className="bg-white p-5 md:p-6 rounded-lg shadow-sm border">
                    <p className="font-medium text-sm md:text-base">LOCATION</p>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">
                        서울 강남구
                    </p>
                </div>

            </section>

            {/* 문의 폼 */}
            <section className="max-w-xl mx-auto space-y-4">

                <input
                    placeholder="이름"
                    className="w-full border border-gray-300 p-3 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-black transition"
                />

                <input
                    placeholder="연락처"
                    className="w-full border border-gray-300 p-3 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-black transition"
                />

                <textarea
                    placeholder="문의 내용"
                    className="w-full border border-gray-300 p-3 rounded-md h-40
                    focus:outline-none focus:ring-2 focus:ring-black transition"
                />

                <button
                    className="w-full md:w-auto px-6 py-3 bg-black text-white rounded-md
                    hover:bg-gray-800 active:scale-[0.98] transition"
                >
                    상담 문의하기
                </button>

            </section>

        </div>
    );
}