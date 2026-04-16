import {getDeletedProjects, restoreProject} from "../../../api/project.api.ts";
import {useEffect, useState} from "react";

export default function AdminProjectTrashPage() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getDeletedProjects().then(res => setProjects(res.data));
    }, []);

    const handleRestore = async (id: number) => {
        await restoreProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl mb-6">휴지통</h1>

            {projects.map((p: any) => (
                <div key={p.id} className="flex justify-between border p-4 mb-3">
                    <span>{p.name}</span>

                    <button
                        onClick={() => handleRestore(p.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                        복구
                    </button>
                </div>
            ))}
        </div>
    );
}