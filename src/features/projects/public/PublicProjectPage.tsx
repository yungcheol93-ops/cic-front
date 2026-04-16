// src/features/works/pages/InteriorPage.tsx
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getPublicProjectList} from "../../../api/project.api.ts";


export default function PublicProjectPage() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<any[]>([]);
console.log(projects);
    useEffect(() => {
        getPublicProjectList().then(res => setProjects(res.data));

    }, []);

    return (
        <div className="h-full min-h-screen px-16 py-16">
            <div className="flex items-start justify-between gap-6 mb-6">
                <h1 className="text-3xl font-cic font-light uppercase">
                    프로젝트 리스트
                </h1>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    {projects.map((p) => (
                        <section
                            key={p.id}
                            className="grid grid-cols-2 gap-10 items-start cursor-pointer py-6"
                            onClick={() => navigate(`/Works/Interior/${p.id}`)}
                        >
                            <img
                                src={p.thumbnailUrl}
                                className="w-full h-[240px] object-cover rounded"
                                alt={p.name}
                            />
                            <button
                                key={p.id}
                                type="button"
                                className="w-full text-left rounded p-4 flex items-start justify-between gap-4 hover:bg-zinc-50 transition"
                                onClick={() => navigate(`/Works/Interior/${p.id}`)}
                            >

                                <div className="flex flex-col justify-center space-y-3">
                                    <p className="text-md text-zinc-700">{p.projectCode}.</p>
                                    <p className="text-sm text-zinc-500">{p.name}</p>
                                    {/*<p className="text-xs text-zinc-500">{p.location}</p>*/}
                                    <p className="text-xs text-zinc-500">
                                        {p.startDate ?? "-"} ~ {p.endDate ?? "-"}
                                    </p>
                                </div>


                            </button>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

