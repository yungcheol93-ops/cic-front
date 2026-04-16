import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getAuthState } from "../../../api/auth.api.ts";
import { getAdminProject, patchAdminProject } from "../../../api/project.api.ts";

import {DndContext, closestCenter} from "@dnd-kit/core";

import {SortableContext, arrayMove, rectSortingStrategy ,useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {uploadImage} from "../../../utils/upload.ts";


export default function AdminProjectDetailPage() {
    const auth = getAuthState();
    if (!auth) return <Navigate to="/Login" replace />;
    if (auth.role !== "admin") return <Navigate to="/MyProject" replace />;

    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<any>(null);
    const [thumbnail, setThumbnail] = useState<any>(null);
    const [isEdit, setIsEdit] = useState(false);
    const thumbnailSrc = thumbnail?.preview || thumbnail?.imageUrl || project?.thumbnailUrl;


    function SortableItem({ img, index, currentIndex, setCurrentIndex } :any) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
        } = useSortable({ id: img.id });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <img
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                src={img.imageUrl || img.preview}
                onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                }}
                style={style}
                className={`w-full h-[100px] object-cover cursor-pointer ${
                    currentIndex === index ? "border-2 border-black" : ""
                }`}
            />
        );
    }

    useEffect(() => {
        if (!projectId) return;
        getAdminProject(Number(projectId)).then(res => {

            setProject(res.data);

            setThumbnail({
                imageUrl: res.data.thumbnailUrl,
            });
        });
    }, [projectId]);

    const removeThumbnail = () => {
        setThumbnail(null);
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? project.images.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev === project.images.length - 1 ? 0 : prev + 1
        );
    };

    //  로딩 방어
    if (!project) return <div className="p-10">로딩중...</div>;

    //  이미지 업로드
    const handleImageUpload = (e: any) => {
        const files = Array.from(e.target.files || []);

        const newImages = files.map((file: any, index: number) => ({
            id: `temp-${Date.now()}-${index}`,
            file,
            preview: URL.createObjectURL(file),
        }));

        setProject((prev: any) => ({
            ...prev,
            images: [...(prev.images || []), ...newImages],
        }));
    };

    // 이미지 삭제
    const removeImage = (id: any) => {
        setProject((prev: any) => {
            const newImages = prev.images.filter((img: any) => img.id !== id);

            //  index 보정
            setCurrentIndex((prevIndex) =>
                newImages.length === 0
                    ? 0
                    : Math.min(prevIndex, newImages.length - 1)
            );

            return {
                ...prev,
                images: newImages,
            };
        });
    };

    //  드래그 정렬
    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = project.images.findIndex((i: any) => i.id === active.id);
        const newIndex = project.images.findIndex((i: any) => i.id === over.id);

        const newImages = arrayMove(project.images, oldIndex, newIndex);

        setProject((prev: any) => ({
            ...prev,
            images: newImages,
        }));
    };

    //  저장
    const handleSave = async () => {
        try {
            //  새로 추가된 파일만 추출
            let thumbnailUrl = project.thumbnailUrl;
            const newFiles = project.images.filter((img: any) => img.file);

            //  Cloudinary 업로드
            if (thumbnail?.file) {
                thumbnailUrl = await uploadImage(thumbnail.file);
            }

            const uploadedUrls = await Promise.all(
                newFiles.map((img: any) => uploadImage(img.file))
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
                name: project.name,
                status: project.status,
                isPublic: project.isPublic,

                startDate: project.startDate,
                endDate: project.endDate,

                thumbnailUrl:thumbnailUrl,

                existingImageIds,
                orders,
                newImageUrls: uploadedUrls,
            });

            alert("수정 완료");

        } catch (e) {
            console.error(e);
            alert("수정 실패");
        }
    };

    return (
        <div className="h-full min-h-screen px-16 py-16">
            {/* 상단 */}
            <section className="bg-white border rounded-xl p-6 mb-6 shadow-sm flex justify-between items-start">

                {/* 좌측: 정보 */}
                <div className="space-y-5 w-full max-w-xl">

                    <div className="flex items-center gap-4">
                        <p className="w-24 text-sm text-gray-500">프로젝트</p>

                        <div className="flex-1 flex items-center gap-2">

                            {/* 코드 */}
                            {isEdit ? (
                                <input
                                    value={project.projectCode}
                                    onChange={(e) =>
                                        setProject({ ...project, projectCode: e.target.value })
                                    }
                                    className="flex-1 border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            ) : (
                                <p className="flex-1 px-3 py-2 text-gray-700 border rounded-md bg-gray-50">
                                    {project.projectCode}
                                </p>
                            )}

                            {/* 이름 */}
                            {isEdit ? (

                                <input
                                    value={project.name}
                                    onChange={(e) =>
                                        setProject({ ...project, name: e.target.value })
                                    }
                                    className="flex-1 border rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            ) : (
                                <p className="flex-1 px-3 py-2 text-gray-700 border rounded-md bg-gray-50">
                                    {project.name}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 기간 */}
                    <div className="flex items-center gap-4">

                        {/* 기간 */}
                        <div className="flex-1 flex items-center gap-2">
                            <p className="w-24 text-sm text-gray-500">기간</p>

                            {isEdit ? (
                                <div className="flex items-center gap-2 flex-1">
                                    <input
                                        type="date"
                                        value={project.startDate || ""}
                                        onChange={(e) =>
                                            setProject({ ...project, startDate: e.target.value })
                                        }
                                        className="border rounded-md px-3 py-2 text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-black"
                                    />

                                    <span className="text-gray-400">~</span>

                                    <input
                                        type="date"
                                        value={project.endDate || ""}
                                        onChange={(e) =>
                                            setProject({ ...project, endDate: e.target.value })
                                        }
                                        className="border rounded-md px-3 py-2 text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                </div>
                            ) : (
                                <p className="flex-1 px-3 py-2 text-gray-700 border rounded-md bg-gray-50">
                                    {project.startDate || "-"} ~ {project.endDate || "-"}
                                </p>
                            )}
                        </div>

                        {/*  공개 상태 (오른쪽) */}
                        <div className="flex items-center gap-2 ml-4 w-[120px] justify-end">

                            {/* 텍스트 */}
                            <span className={`text-sm font-medium ${
                                project.isPublic ? "text-green-600" : "text-gray-400"
                            }`}>
                                {project.isPublic ? "공개" : "비공개"}
                            </span>

                            {/* 토글 */}
                            {isEdit && (
                                <div
                                    onClick={() =>
                                        setProject({ ...project, isPublic: !project.isPublic })
                                    }
                                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition
                                        ${project.isPublic ? "bg-green-500" : "bg-gray-300"}
                                    `}
                                >
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow transform transition
                                        ${project.isPublic ? "translate-x-6" : ""}
                                    `}
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                </div>

                {/* 우측 버튼 */}
                <div className="flex gap-2 ml-6">
                    {!isEdit ? (
                        <button
                            onClick={() => setIsEdit(true)}
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                        >
                            수정
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            >
                                저장
                            </button>
                            <button
                                onClick={() => setIsEdit(false)}
                                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition"
                            >
                                취소
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => navigate("/Admin/ProjectList")}
                        className="px-4 py-2 border rounded-md text-gray-500 hover:bg-gray-100 transition"
                    >
                        목록
                    </button>
                </div>

            </section>

            {/* 썸네일 */}
            <section className="border rounded-xl p-4 bg-white shadow-sm">
                <p className="text-sm text-gray-500 mb-3">썸네일</p>

                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">

                    {thumbnailSrc ? (
                        <img
                            src={thumbnailSrc}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            썸네일 업로드
                        </div>
                    )}

                    {isEdit && (
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition cursor-pointer">
                            이미지 변경
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    setThumbnail({
                                        file,
                                        preview: URL.createObjectURL(file),
                                    });
                                }}
                            />
                        </label>
                    )}
                    {isEdit && thumbnail && (
                        <button
                            onClick={removeThumbnail}
                            className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                        >
                            삭제
                        </button>
                    )}
                </div>
            </section>

            {/* 이미지 */}
            <section className="border p-5 mb-6">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={project.images.map((img: any) => img.id)}
                        strategy={rectSortingStrategy }
                    >
                        {/*  슬라이드 */}
                        <div className="relative w-full h-[650px] flex items-center justify-center bg-gray-200 rounded mb-4">

                            {/* 좌 버튼 */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-6 top-1/2 -translate-y-1/2
                   bg-black/20 hover:bg-black/40 text-white
                   rounded-lg w-12 h-16 flex items-center justify-center
                   backdrop-blur-sm transition z-10"
                            >
                                {"<"}
                            </button>

                            {/* 이미지 */}
                            {(project.images?.length ?? 0) === 0 ? (
                                <div className="text-gray-400">이미지 없음</div>
                            ) : (
                                <img
                                    src={
                                        project.images[currentIndex]?.imageUrl ||
                                        project.images[currentIndex]?.preview ||
                                        undefined
                                    }
                                    className="h-full max-w-full object-contain"
                                />
                            )}

                            {/* 우 버튼 */}
                            <button
                                onClick={handleNext}
                                className="absolute right-6 top-1/2 -translate-y-1/2
                   bg-black/20 hover:bg-black/40 text-white
                   rounded-lg w-12 h-16 flex items-center justify-center
                   backdrop-blur-sm transition z-10"
                            >
                                {">"}
                            </button>

                            {/* 삭제 버튼 */}
                            {isEdit && (
                                <button
                                    onClick={() =>
                                        removeImage(project.images[currentIndex]?.id)
                                    }
                                    className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded z-10"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                        <div className="flex justify-end mb-4 mt-2">
                            {isEdit && (
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition">
                                    + 이미지 추가
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>

                        {/*  썸네일 리스트 */}
                        <div className="grid grid-cols-3 gap-4">
                            {project.images.map((img: any, index: number) => (
                                <SortableItem
                                    key={img.id}
                                    img={img}
                                    index={index}
                                    currentIndex={currentIndex}
                                    setCurrentIndex={setCurrentIndex}
                                />
                            ))}
                        </div>

                    </SortableContext>
                </DndContext>
            </section>

            {/* 계약서 */}
            <section className="border rounded-xl p-4 bg-white shadow-sm">
                <p className="text-sm text-gray-500 mb-3">계약서</p>

                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">

                    {thumbnailSrc ? (
                        <img
                            src={thumbnailSrc}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            썸네일 업로드
                        </div>
                    )}

                    {isEdit && (
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition cursor-pointer">
                            이미지 변경
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    setThumbnail({
                                        file,
                                        preview: URL.createObjectURL(file),
                                    });
                                }}
                            />
                        </label>
                    )}
                    {isEdit && thumbnail && (
                        <button
                            onClick={removeThumbnail}
                            className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                        >
                            삭제
                        </button>
                    )}
                </div>
            </section>

            {/* 공사 일정표 */}
            <section className="border rounded-xl p-4 bg-white shadow-sm">
                <p className="text-sm text-gray-500 mb-3">공사 일정표</p>

                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">

                    {thumbnailSrc ? (
                        <img
                            src={thumbnailSrc}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            썸네일 업로드
                        </div>
                    )}

                    {isEdit && (
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition cursor-pointer">
                            이미지 변경
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e: any) => {
                                    const file = e.target.files[0];
                                    setThumbnail({
                                        file,
                                        preview: URL.createObjectURL(file),
                                    });
                                }}
                            />
                        </label>
                    )}
                    {isEdit && thumbnail && (
                        <button
                            onClick={removeThumbnail}
                            className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                        >
                            삭제
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}