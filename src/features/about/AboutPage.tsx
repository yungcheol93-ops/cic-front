export default function AboutPage() {
    return (
        <div className="px-16 py-20 space-y-24">

            {/* 히어로 */}
            <section className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                <p className="text-3xl text-gray-500">공간을 디자인하다</p>
            </section>

            {/* 브랜드 소개 */}
            <section className="max-w-4xl mx-auto text-center space-y-6">
                <h2 className="text-3xl font-light">ABOUT US</h2>
                <p className="text-gray-600 leading-relaxed">
                    우리는 공간의 가치를 재해석합니다.
                    단순한 인테리어를 넘어, 사람의 삶을 담는 공간을 만듭니다.
                </p>
            </section>

            {/* 가치 */}
            <section className="grid grid-cols-3 gap-10">
                {[
                    { title: "DESIGN", desc: "감각적인 공간 디자인" },
                    { title: "QUALITY", desc: "높은 시공 품질" },
                    { title: "DETAIL", desc: "디테일에 집중" },
                ].map((item, i) => (
                    <div key={i} className="text-center space-y-3">
                        <p className="text-xl font-medium">{item.title}</p>
                        <p className="text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </section>


        </div>
    );
}