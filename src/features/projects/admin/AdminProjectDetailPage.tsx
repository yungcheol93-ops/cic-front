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
        <div className="h-full min-h-screen px-4 md:px-16 py-10 md:py-16">
            {/* 상단 */}
            <section className="bg-white border rounded-xl p-4 md:p-6 mb-6 shadow-sm
                flex flex-col md:flex-row md:justify-between md:items-start gap-6">

                {/* 좌측 */}
                <div className="space-y-5 w-full md:max-w-xl">

                    {/* 프로젝트 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <p className="text-sm text-gray-500 md:w-24">프로젝트</p>

                        <div className="flex flex-col md:flex-row gap-2 w-full">
                            {isEdit ? (
                                <>
                                    <input
                                        value={project.projectCode}
                                        onChange={(e) =>
                                            setProject({ ...project, projectCode: e.target.value })
                                        }
                                        className="w-full border px-3 py-2 rounded text-gray-500"
                                    />
                                    <input
                                        value={project.name}
                                        onChange={(e) =>
                                            setProject({ ...project, name: e.target.value })
                                        }
                                        className="w-full border px-3 py-2 rounded text-gray-500"
                                    />
                                </>
                            ) : (
                                <>
                                    <p className="w-full px-3 py-2 border bg-gray-50 rounded text-gray-500">
                                        {project.projectCode}
                                    </p>
                                    <p className="w-full px-3 py-2 border bg-gray-50 rounded text-gray-500">
                                        {project.name}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 기간 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <p className="text-sm text-gray-500 md:w-24">기간</p>

                        {isEdit ? (
                            <div className="flex flex-col md:flex-row gap-2 w-full ">
                                <input
                                    type="date"
                                    value={project.startDate || ""}
                                    onChange={(e) =>
                                        setProject({ ...project, startDate: e.target.value })
                                    }
                                    className="w-full border px-3 py-2 rounded text-gray-500"
                                />
                                <input
                                    type="date"
                                    value={project.endDate || ""}
                                    onChange={(e) =>
                                        setProject({ ...project, endDate: e.target.value })
                                    }
                                    className="w-full border px-3 py-2 rounded text-gray-500"
                                />
                            </div>
                        ) : (
                            <p className="w-full px-3 py-2 border bg-gray-50 rounded text-gray-500">
                                {project.startDate} ~ {project.endDate}
                            </p>
                        )}

                        {/* 공개 */}
                        <div className="flex items-center gap-2 md:ml-auto shrink-0 whitespace-nowrap">

                            {isEdit ? (
                                <div className="flex items-center gap-2 md:ml-auto shrink-0 whitespace-nowrap">

                                    {/* 텍스트 */}
                                    <span className={project.isPublic ? "text-green-600" : "text-gray-400"}>
                                        {project.isPublic ? "공개" : "비공개"}
                                    </span>

                                    {/* 토글 */}
                                    <div
                                        onClick={() => {
                                            if (!isEdit) return;
                                            setProject({ ...project, isPublic: !project.isPublic });
                                        }}
                                        className={`w-12 h-6 flex items-center rounded-full p-1 transition
                                        ${project.isPublic ? "bg-green-500" : "bg-gray-300"}
                                        ${isEdit ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}
                                        `}
                                        >
                                        <div
                                            className={`w-4 h-4 bg-white rounded-full transition
                                            ${project.isPublic ? "translate-x-6" : ""}
                                            `}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <span className={`px-2 py-1 text-xs rounded ${
                                    project.isPublic
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-200 text-gray-600"
                                }`}>
                                {project.isPublic ? "공개" : "비공개"}
                            </span>
                            )}

                        </div>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto md:ml-6">

                    {!isEdit ? (
                        <button
                            onClick={() => setIsEdit(true)}
                            className="w-full md:w-auto px-4 py-2 bg-black text-white rounded"
                        >
                            수정
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                저장
                            </button>
                            <button
                                onClick={() => setIsEdit(false)}
                                className="w-full md:w-auto px-4 py-2 border rounded bg-red-500 text-black"
                            >
                                취소
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => navigate("/Admin/ProjectList")}
                        className="w-full md:w-auto px-4 py-2 border rounded bg-gray-300 text-black"
                    >
                        목록
                    </button>
                </div>
            </section>

            {/* 썸네일 */}
            <section className="border rounded-xl p-4 bg-white shadow-sm mb-5">
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
            <section className="border rounded-xl p-4 bg-white shadow-sm mb-5">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={project.images.map((img: any) => img.id)}
                        strategy={rectSortingStrategy }
                    >
                        {/*  슬라이드 */}
                        <div className="relative w-full aspect-[16/9] md:h-[650px] bg-gray-200">
                            {/* 좌 버튼 */}
                            <button
                                onClick={handlePrev}
                                className="
                                absolute left-2 md:left-6 top-1/2 -translate-y-1/2
                                bg-black/20 hover:bg-black/40 text-white
                                rounded-md md:rounded-lg
                                w-8 h-10 md:w-12 md:h-16
                                text-sm md:text-base
                                flex items-center justify-center
                                backdrop-blur-sm transition z-10
                                "
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
                                    className="w-full h-full object-contain "
                                />
                            )}

                            {/* 우 버튼 */}
                            <button
                                onClick={handleNext}
                                className="
                                absolute right-2 md:right-6 top-1/2 -translate-y-1/2
                                bg-black/20 hover:bg-black/40 text-white
                                rounded-md md:rounded-lg
                                w-8 h-10 md:w-12 md:h-16
                                text-sm md:text-base
                                flex items-center justify-center
                                backdrop-blur-sm transition z-10
                                "
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