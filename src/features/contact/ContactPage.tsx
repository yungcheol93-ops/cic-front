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
        <div className="px-4 md:px-16 space-y-6 md:space-y-10 h-full">
            {/* 제목 */}
            <section className="text-center space-y-3 md:space-y-4">
                <h1 className="text-2xl md:text-3xl font-light tracking-wide">CONTACT</h1>
            </section>

            {/* 핵심: 2:1 레이아웃 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">

                {/*  좌측 (2) - 폼 */}
                <div className="md:col-span-2">
                    <form ref={formRef} onSubmit={handleSubmit}  className="max-w-lg flex flex-col">
                        <div className="space-y-0 md:space-y-4 text-sm order-1 md:order-2 text-left">
                            <div className="flex items-center gap-2 md:gap-4">
                                <span className="w-24 shrink-0">고객명 :</span>
                                <input
                                name="user_name"
                                required
                                placeholder="고객명"
                                className="flex-1 p-2 focus:outline-none "/>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                                <span className="w-24 shrink-0">연락처 :</span>
                                <input
                                    name="user_contact"
                                    required
                                    placeholder="010-1234-5678"
                                    className="flex-1 p-2 focus:outline-none "/>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                                <span className="w-24 shrink-0">공사 예정지 :</span>
                                <input
                                    name="location"
                                    placeholder="서울시 강동구"
                                    className="flex-1 p-2 focus:outline-none "/>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                                <span className="w-24 shrink-0">공사 시기 :</span>
                                <input
                                    name="period"
                                    placeholder="2026.12"
                                    className="flex-1 p-2 focus:outline-none "/>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                                <span className="w-24 shrink-0">예산 :</span>
                                <input
                                    name="budget"
                                    placeholder="00만원"
                                    className="flex-1 p-2 focus:outline-none "/>
                            </div>
                            <div className="mt-auto ">
                                <div className=" gap-2 md:gap-4">
                                    <p className="text-sm mb-2">문의 내용</p>
                                    <textarea
                                        name="message"
                                        required
                                        placeholder="문의 내용은 자유롭게 적어주시면 됩니다."
                                        className="w-full border border-gray-300 p-2 h-40 md:h-56"
                                    />
                                </div>
                                <div className="flex justify-center md:mt-1">
                                    <button
                                        type="submit"
                                        disabled={isSending}
                                        className="w-full md:w-auto px-10 py-3 bg-black text-white  hover:bg-gray-800 disabled:bg-gray-400 active:scale-[0.98] transition"
                                    >
                                        {isSending ? "전송 중..." : "상담 문의하기"}
                                    </button>
                                </div>
                             </div>
                        </div>
                    </form>
                </div>

                {/* 우측 (1) - SNS 영역 */}
                <div className="space-y-4">

                    {/* 인스타 */}
                    <a
                        href="https://www.instagram.com/cic_studio_/"
                        target="_blank"
                        className="block"
                    >
                        <p className="text-sm text-gray-500">Instagram</p>
                    </a>

                    {/* 블로그 */}
                    <a
                        href="https://blog.naver.com/cic_studio"
                        target="_blank"
                        className="block "
                    >
                        <p className="text-sm text-gray-500">Blog</p>
                    </a>
                    <div className="space-y-2">
                        <a
                            href="https://map.kakao.com/link/search/강동구 풍성로42길 22"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <p className="text-sm text-gray-500">
                                강동구 풍성로42길 22
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}