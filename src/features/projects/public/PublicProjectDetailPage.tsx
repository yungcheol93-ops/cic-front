import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicProject } from "../../../api/project.api.ts";
import { optimizeImage } from "../../../utils/imageUtils.ts"; // 분리한 함수 사용

export default function PublicProjectDetailPage() {
    const { projectCode } = useParams<{ projectCode: string }>();
    const [project, setProject] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = project?.imageUrls || [];
    const [tab, setTab] = useState<"info" | "desc">("info");

    useEffect(() => {
        if (!projectCode) return;
        getPublicProject(projectCode)
            .then(res => setProject(res.data))
            .catch(err => console.error("데이터 로딩 실패:", err));
    }, [projectCode]);

    if (!project) return <div className="flex h-screen items-center justify-center">로딩중...</div>;
    if (!images || images.length === 0) return <div className="p-10 text-center">이미지 없음</div>;

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="w-full h-full bg-white flex justify-center overflow-hidden">

            <section className="w-full max-w-[650px] h-full flex flex-col min-h-0">

                {/* ================= 상단 영역 ================= */}
                <div className="flex-1 min-h-0">

                    {/* ================= 모바일 ================= */}
                    <div className="block md:hidden space-y-4 overflow-y-auto h-full scrollbar-hide">
                        {images.map((img: string, index: number) => (
                            <img
                                key={index}
                                src={optimizeImage(img, 800)}
                                className="w-full object-cover rounded-sm"
                                alt="mobile-img"
                                loading={index === 0 ? "eager" : "lazy"}
                            />
                        ))}
                    </div>

                    {/* ================= 웹 ================= */}
                    <div className="hidden md:flex flex-col h-full">

                        <div className="relative flex-1 flex items-center justify-center min-h-0">

                            <img
                                src={optimizeImage(images[currentIndex], 1000)}
                                className="max-h-full max-w-full object-contain"
                                alt=""
                            />

                            {/* 왼쪽 */}
                            <div
                                className="absolute left-0 top-0 w-1/2 h-full group/left cursor-pointer"
                                onClick={handlePrev}
                            >
                                <button
                                    className="absolute left-4 top-1/2 -translate-y-1/2
              opacity-0 group-hover/left:opacity-100 transition
              text-zinc-900/40 hover:text-zinc-900"
                                >
                                    <span className="text-5xl font-extralight">{"<"}</span>
                                </button>
                            </div>

                            {/* 오른쪽 */}
                            <div
                                className="absolute right-0 top-0 w-1/2 h-full group/right cursor-pointer"
                                onClick={handleNext}
                            >
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2
              opacity-0 group-hover/right:opacity-100 transition
              text-zinc-900/40 hover:text-zinc-900"
                                >
                                    <span className="text-5xl font-extralight">{">"}</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ================= 하단 (고정 영역) ================= */}
                <section className="pt-6 px-4 md:px-0 flex-shrink-0">

                    {/* ================= 모바일 ================= */}
                    <div className="md:hidden">

                        {/* 탭 */}
                        <div className="flex justify-between border-b text-sm">
                            <button
                                onClick={() => setTab("info")}
                                className={`pb-2 ${tab === "info" ? "font-bold border-b border-black" : "text-gray-400"}`}
                            >
                                Information
                            </button>

                            <button
                                onClick={() => setTab("desc")}
                                className={`pb-2 ${tab === "desc" ? "font-bold border-b border-black" : "text-gray-400"}`}
                            >
                                Description
                            </button>
                        </div>

                        {/* 내용 */}
                        <div className="min-h-[140px]">

                            {/* 정보 */}
                            {tab === "info" && (
                                <div className="space-y-1 text-sm text-gray-700">
                                    <div className="font-bold">{project.projectCode}.</div>
                                    <div>완공 : {project.completion}</div>
                                    <div>소재지 : {project.location}</div>
                                    <div>용도 : {project.type}</div>
                                    <div>작업 : {project.scope}</div>
                                    <div>사진촬영 : {project.photography}</div>
                                </div>
                            )}

                            {/* 설명 */}
                            {tab === "desc" && (
                                <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed
                        max-h-[140px] overflow-y-auto scrollbar-hide">
                                    {project.description}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* ================= 웹 ================= */}
                    <div className="hidden md:grid grid-cols-2 gap-0">

                        {/* 좌측 (웹: 설명) */}
                        <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed
                                        order-2 md:order-1 max-h-[200px] overflow-y-auto scrollbar-hide">
                            {project.description}
                        </div>

                        {/* 우측 (웹: 정보) */}
                        <div className="space-y-2 text-sm text-gray-700 order-1 md:order-2 md:text-right">
                            <div className="font-bold">{project.projectCode}.</div>
                            <div>완공 : {project.completion}</div>
                            <div>소재지 : {project.location}</div>
                            <div>용도 : {project.type}</div>
                            <div>작업 : {project.scope}</div>
                            <div>사진촬영 : {project.photography}</div>
                        </div>

                    </div>

                </section>

            </section>
        </div>
    );
}