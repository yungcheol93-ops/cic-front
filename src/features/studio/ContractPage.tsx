
export default function ContactPage() {
    return (
        <div className="px-16 py-20 space-y-16">

            {/* 제목 */}
            <section className="text-center space-y-4">
                <h1 className="text-3xl font-light">CONTACT</h1>
                <p className="text-gray-500">공간 상담을 신청해보세요</p>
            </section>

            {/* 정보 */}
            <section className="grid grid-cols-3 gap-10 text-center">
                <div>
                    <p className="font-medium">PHONE</p>
                    <p className="text-gray-500">010-1234-5678</p>
                </div>
                <div>
                    <p className="font-medium">EMAIL</p>
                    <p className="text-gray-500">info@cic.com</p>
                </div>
                <div>
                    <p className="font-medium">LOCATION</p>
                    <p className="text-gray-500">서울 강남구</p>
                </div>
            </section>

            {/* 문의 폼 */}
            <section className="max-w-xl mx-auto space-y-4">
                <input
                    placeholder="이름"
                    className="w-full border p-3"
                />
                <input
                    placeholder="연락처"
                    className="w-full border p-3"
                />
                <textarea
                    placeholder="문의 내용"
                    className="w-full border p-3 h-40"
                />
                <button className="w-full bg-black text-white py-3">
                    문의 보내기
                </button>
            </section>

        </div>
    );
}