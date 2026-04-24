import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicProject } from "../../../api/project.api.ts";
import { optimizeImage } from "../../../utils/imageUtils.ts"; // 분리한 함수 사용

export default function PublicProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = project?.imageUrls || [];

    useEffect(() => {
        if (!projectId) return;
        getPublicProject(Number(projectId))
            .then(res => setProject(res.data))
            .catch(err => console.error("데이터 로딩 실패:", err));
    }, [projectId]);

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
        <div className="w-full h-screen bg-white flex justify-center py-16">

            <section className="w-full max-w-[650px] h-full flex flex-col px-4 md:px-0">


            {/* ================= 모바일 ================= */}
                <div className="block md:hidden space-y-4 overflow-y-auto h-full px-4">
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
                <div className="hidden md:flex flex-col min-h-0">

                    {/* 이미지 영역 (남은 공간 자동 사용) */}
                    <div className="relative flex-1 flex items-center justify-center ">

                        <img
                            src={optimizeImage(images[currentIndex], 1200)}
                            className="max-h-[60vh] max-w-full object-contain"
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

                    {/* 하단 정보 (고정 영역) */}
                    <section className="py-6 px-4 md:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                            {/* 좌측 */}
                            <div className="space-y-2 text-sm text-gray-700">
                                <div><span className="text-gray-400">완공 </span>{project.completion}</div>
                                <div><span className="text-gray-400">소재지 </span>{project.location}</div>
                                <div><span className="text-gray-400">용도 </span>{project.type}</div>
                                <div><span className="text-gray-400">작업 </span>{project.scope}</div>
                                <div><span className="text-gray-400">사진촬영 </span>{project.photography}</div>
                            </div>

                            {/* 우측 */}
                            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                {project.description}
                            </div>

                        </div>
                    </section>

                </div>
            </section>
        </div>
    );
}