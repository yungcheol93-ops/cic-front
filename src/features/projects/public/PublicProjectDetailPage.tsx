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
        <div className="w-full h-screen overflow-hidden bg-white">
            <section className="h-full flex flex-col pt-8 md:pt-14">

                {/* 모바일: 이미지 리스트 (모바일은 스크롤이 필요하므로 예외 처리) */}
                <div className="block md:hidden space-y-4 overflow-y-auto h-full">
                    {images.map((img: string, index: number) => (
                        <img key={index} src={img} className="w-full object-cover" alt="mobile-img" />
                    ))}
                </div>

                {/* 웹: 슬라이드 영역 (높이를 화면 비례로 조절) */}
                <div className="hidden md:flex relative flex-1 w-full max-w-[1000px] max-h-[70vh] mx-auto items-center justify-center group bg-zinc-50">
                    {/* 2. object-contain을 사용하여 이미지가 잘리지 않으면서 고정된 높이 내에 들어오게 함 */}
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
                            text-white w-24 h-42 flex items-center justify-center
                            transition-opacity duration-300 rounded-lg">

                            {/* 화살표 텍스트: text-6xl로 크기 조절 */}
                            <span className="text-4xl font-light select-none">
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
                        text-white w-24 h-40 flex items-center justify-center
                        transition-opacity duration-300 rounded-lg">

                            {/* 화살표 텍스트: text-6xl로 크기 조절 */}
                            <span className="text-4xl font-light select-none">
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
