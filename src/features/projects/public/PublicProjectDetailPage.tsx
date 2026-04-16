import {  useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {getPublicProject} from "../../../api/project.api.ts";

export default function PublicProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = project?.imageUrls || [];

    useEffect(() => {
        if (!projectId) return;
        getPublicProject(Number(projectId)).then(res => {
                console.log("api응답", res.data);
                    setProject(res.data);
            });
    }, [projectId]);

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    if (!project) {
        return <div>로딩중</div>;
    }
    if (images.length === 0) {
        return <div className="p-10">이미지 없음</div>;
    }

    return (
        <div className="h-screen flex flex-col px-16 py-16">

            {/* 이미지 영역 */}
            <div className="relative w-full h-[850px] flex items-center justify-center ">

                {/* 좌 버튼 (회색 영역) */}
                <button
                    onClick={handlePrev}
                    className="absolute left-6 top-1/2 -translate-y-1/2
                   bg-black/20 hover:bg-black/40 text-white
                   rounded-lg w-12 h-16 flex items-center justify-center
                   backdrop-blur-sm transition"
                >
                    {"<"}
                </button>

                {/* 이미지 */}
                {images.length === 0 ? (
                    <div className="text-gray-400">이미지 없음</div>
                ) : (
                    <img
                        src={images[currentIndex] || undefined}
                        className="h-full w-auto object-contain"
                    />
                )}

                {/* 우 버튼 (회색 영역) */}
                <button
                    onClick={handleNext}
                    className="absolute right-6 top-1/2 -translate-y-1/2
                   bg-black/20 hover:bg-black/40 text-white
                   rounded-lg w-12 h-16 flex items-center justify-center
                   backdrop-blur-sm transition"
                >
                    {">"}
                </button>

            </div>
            {/* 🔥 하단 고정 */}
            <div className="mt-auto space-y-2 text-sm text-zinc-200">
                <p className="text-lg text-bold text-zinc-500">{project.projectCode}</p>
                <p className="text-xl text-zinc-500">{project.name}</p>
                <p className="text-sm text-zinc-500">{project.startDate || "-"} ~ {project.endDate || "-"}</p>

            </div>

        </div>
    );
}

