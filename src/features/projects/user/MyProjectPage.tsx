import { Navigate } from "react-router-dom";
import { getAuthState } from "../../../api/auth.api.ts";
import { getUserProject } from "../../../api/project.api";
import {useEffect, useState} from "react";

export default function MyProjectPage() {
    const auth = getAuthState();
    if (!auth) return <Navigate to="/Login" replace />;
    if (auth.role !== "customer") return <Navigate to="/ProjectList" replace />;
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        getUserProject().then(res => setProjects(res.data));
    }, []);

    return (
        <div className="h-full min-h-screen px-16 py-16">
            <h1 className="text-3xl font-cic font-light mb-6 uppercase">
                내 프로젝트
            </h1>
            {projects.map(p => (
                <div key={p.id}>
                    {p.projectCode} - {p.name}
                </div>
            ))}
        </div>
    );
}

