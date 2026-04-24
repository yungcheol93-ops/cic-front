export default function ContactPage() {
    return (
        <div className="px-4 md:px-16 py-12 md:py-12 space-y-12 md:space-y-16">

            {/* 제목 */}
            <section className="text-center space-y-3 md:space-y-4">
                <h1 className="text-2xl md:text-3xl font-light tracking-wide">
                    CONTACT
                </h1>
                <p className="text-sm md:text-base text-gray-500">
                    공간 상담을 신청해보세요
                </p>
            </section>

            {/* 문의 폼 */}
            <section className="max-w-xl mx-auto space-y-4">
                <p>고객명</p>
                <input
                    placeholder="고객명"
                    className="w-full border border-gray-300 p-3 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-black transition"
                />
                <p>연락처</p>
                <input
                    placeholder="010-1234-5678"
                    className="w-full border border-gray-300 p-3 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-black transition"
                />
                <p>공사 예정지</p>
                <input
                    placeholder="서울시 강동구"
                    className="w-full border border-gray-300 p-3 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-black transition"
                />
                <p>예상 공사 시기</p>
                <input
                    placeholder="ex)2026.12"
                    className="w-full border border-gray-300 p-3 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-black transition"
                />
                <p>문의 내용</p>
                <textarea
                    placeholder="문의 내용은 자유롭게 적어주시면 됩니다."
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