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
        <div className="h-full min-h-screen md:px-16 py-10 md:py-16">

            <section className="bg-white shadow-sm mb-5">

                {/* 모바일: 이미지 리스트 */}
                <div className="block md:hidden space-y-4">
                    {images.map((img: string, index: number) => (
                        <img
                            key={index}
                            src={img}
                            className="w-full object-cover"
                        />
                    ))}
                </div>

                {/* 웹: 슬라이드 */}
                <div className="hidden md:flex relative w-[1200px] h-[800px] mx-auto items-center justify-center group">
                    {/* 이미지 */}
                    <img
                        src={images[currentIndex]}
                        className="w-full h-full object-contain"
                        alt={`슬라이드 이미지 ${currentIndex + 1}`}
                    />

                    {/* 왼쪽 클릭 영역 */}
                    <div
                        className="absolute left-0 top-0 w-1/2 h-full cursor-pointer flex items-center justify-start group/left"
                        onClick={handlePrev}
                    >
                        {/* 화살표 박스 */}
                        <div className="ml-6 opacity-0 group-hover/left:opacity-100
                            text-white w-24 h-52 flex items-center justify-center backdrop-blur-sm
                            transition-opacity duration-300 rounded-lg">

                            {/* 화살표 텍스트: text-6xl로 크기 조절 */}
                            <span className="text-6xl font-light select-none">
                            {"<"}
                        </span>
                        </div>
                    </div>

                    {/* 오른쪽 클릭 영역 */}
                    <div
                        className="absolute right-0 top-0 w-1/2 h-full cursor-pointer flex items-center justify-end group/right"
                        onClick={handleNext}
                    >
                        {/* 화살표 박스 */}
                        <div className="mr-6 opacity-0 group-hover/right:opacity-100
                        text-white w-24 h-52 flex items-center justify-center backdrop-blur-sm
                        transition-opacity duration-300 rounded-lg">

                            {/* 화살표 텍스트: text-6xl로 크기 조절 */}
                            <span className="text-6xl font-light select-none">
                            {">"}
                        </span>
                        </div>
                    </div>
                </div>
                {/* 하단 정보 */}
                <div className="mt-6 text-sm text-right text-zinc-500 px-2 md:px-0">
                    <p className="text-lg font-semibold">{project.projectCode}.</p>
                    <p className="text-sm ">Work scope
                        : schematic design, working design, construction</p>

                </div>

            </section>
        </div>
    );
}
