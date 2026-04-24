import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdminProject, patchAdminProject } from "../../../api/project.api.ts";
import {uploadImages} from "../../../api/cloudinary.project.api.ts";
import ProjectForm from "./ProjectForm.tsx";
import type {IProjectFormState} from "../../../types/admin/project/projectForm.ts";



export default function AdminProjectDetailPage() {


    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
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
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (!projectId) return;

        getAdminProject(Number(projectId)).then(res => {
            setForm({
                project: res.data,
                thumbnail: {
                    imageUrl: res.data.thumbnailUrl,
                },
            });
        });
    }, [projectId]);


    //  로딩 방어
    if (!form.project.id) return <div className="p-10">로딩중...</div>;


    //  저장
    const handleSave = async () => {
        const { project, thumbnail } = form;

        try {
            //  새로 추가된 파일만 추출
            let thumbnailUrl = project.thumbnailUrl;
            const newFiles = project.images.filter((img: any) => img.file);

            //  Cloudinary 업로드
            if (thumbnail?.file) {
                thumbnailUrl = await uploadImages(thumbnail.file);
            }

            const uploadedUrls = await Promise.all(
                newFiles.map((img: any) => uploadImages(img.file))
            );

            if (!thumbnail) {
                thumbnailUrl = null;
            }
            // 기존 이미지 id
            const existingImageIds = project.images
                .filter((img: any) => typeof img.id === "number")
                .map((img: any) => img.id);

            //  순서
            const orders = project.images.map((_: any, index: number) => index);

            //  patch 요청
            await patchAdminProject(project.id, {
                projectCode:project.projectCode,
                completion: project.completion,
                location: project.location,
                type: project.type,
                scope: project.scope,
                photography: project.photography,
                description:project.description,
                status: project.status,
                isPublic: project.isPublic,
                thumbnailUrl:thumbnailUrl,

                existingImageIds,
                orders,
                newImageUrls: uploadedUrls,
            });

            setIsEdit(false);
            alert("수정 완료");

        } catch (e) {
            console.error(e);
            alert("수정 실패");
        }
    };

    return (
        <div className="h-full min-h-screen px-4 md:px-16 py-6 md:py-10">
            <section className="flex items-center justify-between bg-white border px-5 py-2 mb-2 shadow-sm">

                {/* 좌측 */}
                <div className="flex gap-2">
                    {!isEdit ? (
                        <>
                            <button
                                onClick={() => setIsEdit(true)}
                                className="px-3 py-1 bg-black text-white text-xs hover:bg-gray-800 transition"
                            >
                                수정
                            </button>

                            <button
                                onClick={() => navigate("/Admin/ProjectList")}
                                className="px-3 py-1 border text-xs text-gray-600 hover:bg-gray-100"
                            >
                                목록
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700"
                            >
                                저장
                            </button>

                            <button
                                onClick={() => setIsEdit(false)}
                                className="px-3 py-1 bg-red-500 text-white text-xs hover:bg-red-600"
                            >
                                취소
                            </button>

                            <button
                                onClick={() => navigate("/Admin/ProjectList")}
                                className="px-3 py-1 border text-xs text-gray-600 hover:bg-gray-100"
                            >
                                목록
                            </button>
                        </>
                    )}
                </div>
                {/* 우측 공개 상태 */}
                <div className="flex items-center gap-3">

                    <span className="text-sm text-gray-500">공개여부</span>

                    {isEdit ? (
                        <div
                            onClick={() =>
                                setForm((prev) => ({
                                    ...prev,
                                    project: {
                                        ...prev.project,
                                        isPublic: !prev.project.isPublic,
                                    },
                                }))
                            }
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition
                            ${form.project.isPublic ? "bg-green-500" : "bg-gray-300"}`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full transition
                            ${form.project.isPublic ? "translate-x-6" : ""}`}
                            />
                        </div>
                    ) : (
                        <span
                            className={`px-3 py-1 text-xs rounded-full font-medium
                    ${
                                form.project.isPublic
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            {form.project.isPublic ? "공개" : "비공개"}
                        </span>
                    )}

                </div>

            </section>
            <ProjectForm
                form={form}
                setForm={setForm}
                isEdit={isEdit}
            />


        </div>
    );
}