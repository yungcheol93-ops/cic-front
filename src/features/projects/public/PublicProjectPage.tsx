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
        <div className="h-full min-h-screen py-16">
            <div className="flex items-start justify-between gap-6 mb-6">

            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    {projects.map((p) => (
                        <section
                            key={p.id}
                            className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-10 items-start cursor-pointer py-6"
                            onClick={() => navigate(`/Works/Interior/${p.id}`)}
                        >
                            <img
                                src={p.thumbnailUrl}
                                className="w-full h-[200px] md:h-[340px] object-cover "
                                alt={p.name}
                            />
                            <div className="flex flex-col justify-center p-2">
                                <p className="text-sm md:text-md text-zinc-800 mb-2">{p.projectCode}.</p>
                                <p></p>
                                {/*<p className="text-sm text-zinc-500">{p.name}</p>*/}
                                <p className="text-sm text-zinc-500">{p.startDate}</p>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

