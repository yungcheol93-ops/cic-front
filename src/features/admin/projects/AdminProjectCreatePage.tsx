import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuthState } from "../../../api/auth.api.ts";
import ProjectForm from "./ProjectForm.tsx";
import type {IProjectFormState} from "../../../types/admin/project/projectForm.ts";
import {uploadImages} from "../../../api/cloudinary.project.api.ts";

export default function AdminProjectCreatePage() {
    const auth = getAuthState();
    if (!auth) return <Navigate to="/Login" replace />;
    if (auth.role !== "admin") return <Navigate to="/MyProject" replace />;

    const navigate = useNavigate();

    const [form, setForm] = useState<IProjectFormState>({
        project: {
            id: 0,
            projectCode: "",
            completion: "",
            location: "",
            type: "",
            scope: "",
            photography: "",
            description: "",
            images: [],
            isPublic: true,
            status:"COMPLETED"
        },
        thumbnail: null,
    });

    const [error, setError] = useState<string | null>(null);


    const handleSave = async () => {
        const { project, thumbnail } = form;

        if (!project.projectCode) {
            setError("프로젝트 코드를 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();

            // 썸네일 업로드
            let thumbnailUrl = null;
            if (thumbnail?.file) {
                thumbnailUrl = await uploadImages(thumbnail.file);
            }

            // 이미지 업로드
            const newFiles = project.images.filter((img: any) => img.file);
            const uploadedUrls = await Promise.all(
                newFiles.map((img: any) => uploadImages(img.file))
            );

            // DTO
            const dto = {
                projectCode: project.projectCode,
                completion: project.completion,
                location: project.location,
                type: project.type,
                scope: project.scope,
                photography: project.photography,
                description: project.description,
                thumbnailUrl,
                imageUrls: uploadedUrls,
                isPublic: project.isPublic,
            };

            formData.append(
                "dto",
                new Blob([JSON.stringify(dto)], { type: "application/json" })
            );

            await axios.post(
                import.meta.env.VITE_API_URL + "/api/admin/project",
                formData
            );

            navigate("/Admin/ProjectList", { replace: true });


        } catch (e) {
            setError("저장 중 오류 발생");
            console.error(e);
        }
    }
    return (
        <div className="h-full min-h-screen px-16 py-16">
            <div className="flex items-start justify-between gap-6 mb-10">
                <h1 className="text-3xl font-cic font-light uppercase">
                    프로젝트 등록
                </h1>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                        onClick={() => navigate("/Admin/ProjectList")}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition disabled:opacity-50"
                        onClick={handleSave}
                        disabled={!form.project.projectCode}
                    >
                        저장
                    </button>
                </div>
            </div>

            <ProjectForm
                form={form}
                setForm={setForm}
                isEdit={true}
            />
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}

