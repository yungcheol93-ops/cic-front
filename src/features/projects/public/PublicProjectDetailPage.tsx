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

        getPublicProject(Number(projectId))
            .then(res => {
                    setProject(res.data);
            })
            .catch(err => {
                console.error("데이터 로딩 실패:", err);
            });
    }, [projectId]);

    if (!project) {
        return <div>로딩중...</div>;
    }
    if (!images || images.length === 0) {
        return <div className="p-10">이미지 없음</div>;
    }

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


    return (
        <div className="h-full min-h-screen px-4 md:px-16 py-10 md:py-16">

            <section className="bg-white shadow-sm mb-5">

                {/* 모바일: 이미지 리스트 */}
                <div className="block md:hidden space-y-4">
                    {images.map((img: string, index: number) => (
                        <img
                            key={index}
                            src={img}
                            className="w-full object-cover rounded-lg"
                        />
                    ))}
                </div>

                {/* 웹: 슬라이드 */}
                <div className="hidden md:block relative w-full  bg-gray-200">

                    {/* 좌 버튼 */}
                    <button
                        onClick={handlePrev}
                        className="
                        absolute left-6 top-1/2 -translate-y-1/2
                        bg-black/20 hover:bg-black/40 text-white
                        rounded-lg w-12 h-16 flex items-center justify-center
                        backdrop-blur-sm transition z-10
                        "
                    >
                        {"<"}
                    </button>

                    {/* 이미지 */}
                    <img
                        src={images[currentIndex]}
                        className="w-full h-full object-contain"
                    />

                    {/* 우 버튼 */}
                    <button
                        onClick={handleNext}
                        className="
                        absolute right-6 top-1/2 -translate-y-1/2
                        bg-black/20 hover:bg-black/40 text-white
                        rounded-lg w-12 h-16 flex items-center justify-center
                        backdrop-blur-sm transition z-10
                        "
                    >
                        {">"}
                    </button>
                </div>

                {/* 하단 정보 */}
                <div className="mt-6 space-y-2 text-sm text-zinc-500 px-2 md:px-0">
                    <p className="text-lg font-semibold">{project.projectCode}</p>
                    <p className="text-xl">{project.name}</p>
                    <p className="text-sm">
                        {project.startDate || "-"} ~ {project.endDate || "-"}
                    </p>
                </div>

            </section>
        </div>
    );
}
