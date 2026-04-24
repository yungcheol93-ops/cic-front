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
                'template_oesf8ys',  // 템플릿 ID
                formRef.current!,
                'xpv32StUDYZ9Fkibm'    // 공개 키
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
        <div className="px-4 md:px-16 py-12 md:py-12 space-y-12 md:space-y-16">
            <section className="text-center space-y-3 md:space-y-4">
                <h1 className="text-2xl md:text-3xl font-light tracking-wide">CONTACT</h1>
                <p className="text-sm md:text-base text-gray-500">공간 상담을 신청해보세요</p>
            </section>

            {/* form 태그로 감싸고 ref와 name 속성을 추가합니다 */}
            <form ref={formRef} onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
                <div>
                    <p className="text-sm mb-1">고객명</p>
                    <input
                        name="user_name" // EmailJS 템플릿의 {{user_name}}과 매칭
                        required
                        placeholder="고객명"
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>
                <div>
                    <p className="text-sm mb-1">연락처</p>
                    <input
                        name="user_contact"
                        required
                        placeholder="010-1234-5678"
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>
                <div>
                    <p className="text-sm mb-1">공사 예정지</p>
                    <input
                        name="location"
                        placeholder="서울시 강동구"
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>
                <div>
                    <p className="text-sm mb-1">예상 공사 시기</p>
                    <input
                        name="period"
                        placeholder="2026.12"
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>
                <div>
                    <p className="text-sm mb-1">공사 예산</p>
                    <input
                        name="budget"
                        placeholder="00만원"
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>
                <div>
                    <p className="text-sm mb-1">문의 내용</p>
                    <textarea
                        name="message"
                        required
                        placeholder="문의 내용은 자유롭게 적어주시면 됩니다."
                        className="w-full border border-gray-300 p-3 rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-black transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSending}
                    className="w-full md:w-auto px-10 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 active:scale-[0.98] transition"
                >
                    {isSending ? "전송 중..." : "상담 문의하기"}
                </button>
            </form>
        </div>
    );
}