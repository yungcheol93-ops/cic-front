import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuthState } from "../../../api/auth.api.ts";
import {deleteAdminProject, getAdminProjectList, togglePublic} from "../../../api/project.api.ts";

export default function AdminProjectListPage() {
    const auth = getAuthState();
    if (!auth) return <Navigate to="/Login" replace />;
    if (auth.role !== "admin") return <Navigate to="/MyProject" replace />;

    const navigate = useNavigate();
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        getAdminProjectList().then(res => setProjects(res.data));
    }, []);

    const handleToggle = async (id: number, current: boolean) => {
        await togglePublic(id, !current);
        const res = await getAdminProjectList();
        setProjects(res.data);
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            await deleteAdminProject(id);

            // 리스트 갱신
            setProjects((prev) => prev.filter((p) => p.id !== id));

        } catch (e) {
            console.error(e);
            alert("삭제 실패");
        }
    };

    return (
        <div className="h-full min-h-screen px-16 py-16">
            <div className="flex items-start justify-between gap-6 mb-6">
                <h1 className="text-md md:text-3xl font-cic font-light uppercase">
                    프로젝트 리스트
                </h1>
                <button
                    type="button"
                    className="px-3 py-1.5 bg-zinc-900 text-white rounded text-xs hover:bg-zinc-800 transition-colors"
                    onClick={() => navigate("/Admin/ProjectCreate")}
                >
                    프로젝트 등록
                </button>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    {projects.map((p) => (
                        <section
                            key={p.id}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start cursor-pointer py-6"
                            onClick={() => navigate(`/Admin/Project/${p.id}`)}
                        >
                            {/* 이미지 */}
                            <img
                                src={p.thumbnailUrl}
                                className="w-full h-[200px] md:h-[240px] object-cover rounded"
                                alt={p.projectCode}
                            />

                            {/* 텍스트 */}
                            <div className="w-full text-left rounded p-2 md:p-4 flex flex-col justify-between gap-4 hover:bg-zinc-50 transition">

                                <div className="flex flex-col justify-center space-y-2 md:space-y-3">
                                    <p className="text-sm md:text-md text-zinc-700">{p.projectCode}.</p>
                                    <p className="text-sm text-zinc-500">{p.completion}</p>

                                    <div className="flex items-center gap-2 mt-2">

                                        {/* 공개 토글 */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggle(p.id, p.isPublic);
                                            }}
                                            className={`px-2 py-1 text-xs rounded ${
                                                p.isPublic
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {p.isPublic ? "공개" : "비공개"}
                                        </button>

                                        {/* 삭제 */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(p.id);
                                            }}
                                            className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded"
                                        >
                                            삭제
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

