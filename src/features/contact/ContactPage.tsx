import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        try {
            await emailjs.sendForm(
                'service_cic_contact',   // 서비스 ID
                import.meta.env.VITE_EMAILJS_TEMPLATEID,  // 템플릿 ID
                formRef.current!,
                import.meta.env.VITE_EMAILJS_KEY    // 공개 키
            );
            alert("상담 문의가 성공적으로 전송되었습니다.");
            formRef.current?.reset(); // 폼 초기화
        } catch (error) {
            console.error(error);
            alert("전송에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="px-4 md:px-16 py-12 space-y-12 md:space-y-16">

            {/* 제목 */}
            <section className="text-center space-y-3 md:space-y-4">
                <h1 className="text-2xl md:text-3xl font-light tracking-wide">CONTACT</h1>
            </section>

            {/* 핵심: 2:1 레이아웃 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                {/*  좌측 (2) - 폼 */}
                <div className="md:col-span-2">
                    <form ref={formRef} onSubmit={handleSubmit} className="max-w-lg space-y-2">
                        <div>
                            <p className="text-sm mb-1">고객명</p>
                            <input
                                name="user_name"
                                required
                                placeholder="고객명"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        <div>
                            <p className="text-sm mb-1">연락처</p>
                            <input
                                name="user_contact"
                                required
                                placeholder="010-1234-5678"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        <div>
                            <p className="text-sm mb-1">공사 예정지</p>
                            <input
                                name="location"
                                placeholder="서울시 강동구"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        <div>
                            <p className="text-sm mb-1">예상 공사 시기</p>
                            <input
                                name="period"
                                placeholder="2026.12"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        <div>
                            <p className="text-sm mb-1">공사 예산</p>
                            <input
                                name="budget"
                                placeholder="00만원"
                                className="w-full border border-gray-300 p-2  focus:outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>

                        <div>
                            <p className="text-sm mb-1">문의 내용</p>
                            <textarea
                                name="message"
                                required
                                placeholder="문의 내용은 자유롭게 적어주시면 됩니다."
                                className="w-full border border-gray-300 p-2 h-40 focus:outline-none focus:ring-2 focus:ring-black transition"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full md:w-auto px-10 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 active:scale-[0.98] transition"
                            >
                                {isSending ? "전송 중..." : "상담 문의하기"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 우측 (1) - SNS 영역 */}
                <div className="space-y-6">

                    <div className="space-y-2">
                        <h2 className="text-lg font-normal">SNS</h2>
                        <p className="text-sm text-gray-500">
                            더 많은 시공 사례는 아래에서 확인하세요.
                        </p>
                    </div>

                    {/* 인스타 */}
                    <a
                        href="https://www.instagram.com/cic_studio_/"
                        target="_blank"
                        className="block border border-gray-300 p-4  hover:bg-gray-50 transition"
                    >
                        <p className="font-medium">Instagram</p>
                    </a>

                    {/* 블로그 */}
                    <a
                        href="https://blog.naver.com/cic_studio"
                        target="_blank"
                        className="block border border-gray-300 p-4 hover:bg-gray-50 transition"
                    >
                        <p className="font-medium">Blog</p>
                    </a>
                    {/* 전화 */}
                    <a
                        href="tel:024769116 "
                        className="block border border-gray-300 p-4 hover:bg-gray-50 transition"
                    >
                        <p className="font-medium">전화 문의</p>
                        <p className="text-sm text-gray-500">T. 02 476 9116 </p>
                    </a>
                </div>
            </div>
        </div>
    );
}