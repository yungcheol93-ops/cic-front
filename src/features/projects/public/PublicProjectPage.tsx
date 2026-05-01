// src/features/works/pages/InteriorPage.tsx
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getPublicProjectList} from "../../../api/project.api.ts";
import {getThumbnail} from "../../../utils/imageUtils.ts";

export default function PublicProjectPage() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        getPublicProjectList().then(res => setProjects(res.data));

    }, []);

    return (
        <div className="h-full min-h-screen py-16">
            <div className="space-y-6">
                <div className="space-y-4">
                    {projects.map((p) => (
                        <section
                            key={p.id}
                            // 1. items-center 대신 items-start를 사용하여 윗부분을 맞춤
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 items-start cursor-pointer pb-10"
                            onClick={() => navigate(`/Works/Interior/${p.projectCode}`)}
                        >
                            {/* 왼쪽 여백 */}
                            <div className="hidden md:block"></div>

                            {/* 중앙 이미지 */}
                            <div className="w-full aspect-square overflow-hidden bg-zinc-50">
                                <img
                                    src={getThumbnail(p.thumbnailUrl)}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    alt={p.projectCode}
                                />
                            </div>

                            {/* 오른쪽 텍스트 영역: 이미지 윗선과 맞춤 */}
                            <div className="flex flex-col pt-0 md:pt-1">
                                {/* 2. 상단 여백(pt)을 미세하게 조절하여 이미지의 테두리 두께와 시각적으로 맞춤 */}
                                <p className="text-sm md:text-md text-zinc-800 mb-1 font-medium leading-none">
                                    {p.projectCode}.
                                </p>
                                <p className="text-xs md:text-sm text-zinc-800 leading-none">
                                    {p.completion}
                                </p>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

