import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect, useRef } from "react";
import { getHomeImageList, postHomeImages, deleteHomeImage } from "../../../api/home.api"; // delete API 추가 가정
import { uploadImages } from "../../../api/cloudinary.home.api.ts";

type Slide = {
    id: number;
    imageUrl: string;
    orderIndex: number;
    isActive: boolean;
};

type UploadItem = {
    file: File;
    preview: string;
    progress: number;
    id: number;
};

const optimize = (url?: string) => {
    if (!url) return "/images/no-image.png";
    if (!url.includes("/upload/")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_1920,c_limit/");
};

export default function AdminHomeImagesPage() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const fetchSlides = async () => {
        const res = await getHomeImageList();

        const sortedData = (Array.isArray(res.data) ? res.data : []).sort((a, b) => a.orderIndex - b.orderIndex);
        setSlides(sortedData);
    };

    useEffect(() => { fetchSlides(); }, []);

    const addFiles = (files: FileList | File[]) => {
        if (!isEditing) setIsEditing(true);
        const newItems = Array.from(files).map((file, i) => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            id: -(Date.now() + i), // 임시 음수 ID
        }));
        setUploads((prev) => [...prev, ...newItems]);
    };

    const handleSave = async () => {
        try {
            // 1. 기존 이미지 중 삭제된 것 처리
            if (deletedIds.length > 0) {
                for (const id of deletedIds) {
                    await deleteHomeImage(id); // API 확인 필요
                }
            }

            // 2. 새 이미지 업로드 및 등록
            for (const item of uploads) {
                const url = await uploadImages(item.file, (percent) => {
                    setUploads(prev => prev.map(u => u.id === item.id ? { ...u, progress: percent } : u));
                });
                // 새 이미지는 리스트 가장 뒤에 추가되도록 순서 부여
                await postHomeImages({ imageUrl: url, orderIndex: slides.length, isActive: true });
            }

            // 3. 기존 이미지 순서 변경 업데이트 (선택 사항)
            // 만약 서버에서 전체 순서를 인덱스로 관리한다면 순서 변경 API를 여기서 호출해야 합니다.
            for (let i = 0; i < slides.length; i++) {
                if (slides[i].orderIndex !== i) {
                    await postHomeImages({ ...slides[i], orderIndex: i });
                }
            }

            alert("성공적으로 저장되었습니다.");
            setUploads([]);
            setDeletedIds([]);
            setIsEditing(false);
            fetchSlides();
        } catch (error) {
            console.error("저장 중 오류:", error);
            alert("저장에 실패했습니다.");
        }
    };

    const handleCancel = () => {
        setUploads([]);
        setDeletedIds([]);
        setIsEditing(false);
        fetchSlides(); // 원본 데이터 다시 불러와서 복구
    };

    const handleDragEndSlides = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setSlides((prev) => {
            const oldIndex = prev.findIndex((s) => s.id === active.id);
            const newIndex = prev.findIndex((s) => s.id === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    return (
        <div className=" space-y-10">
            <div className="flex justify-between items-center border-b pb-5">
                <div>
                    <h1 className="text-2xl font-bold">홈 이미지 관리</h1>
                    <p className="text-sm text-gray-500">
                        {isEditing ? "이미지를 드래그하여 순서를 변경하세요. 저장 버튼을 눌러야 반영됩니다." : "현재 메인 화면 슬라이드 구성입니다."}
                    </p>
                </div>

                <div className="flex gap-2">
                    <input type="file" multiple ref={fileInputRef} onChange={(e) => e.target.files && addFiles(e.target.files)} className="hidden" accept="image/*" />

                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">취소</button>
                            <button onClick={() => fileInputRef.current?.click()} className="px-5 py-2 rounded-lg bg-gray-800 text-white hover:bg-black flex items-center gap-2">
                                <PlusIcon /> 사진 추가
                            </button>
                            <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg">저장하기</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 flex items-center gap-2">
                            <EditIcon /> {slides.length > 0 ? "순서 변경 및 수정" : "첫 이미지 등록하기"}
                        </button>
                    )}
                </div>
            </div>

            <div
                className="min-h-[400px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            >
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndSlides}>
                    <SortableContext items={slides.map(s => s.id)} strategy={rectSortingStrategy} disabled={!isEditing}>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {/* 1. 기존 슬라이드 */}
                            {slides.map((slide, index) => (
                                <SortableCard
                                    key={slide.id}
                                    id={slide.id}
                                    imageUrl={optimize(slide.imageUrl)}
                                    index={index}
                                    isEditing={isEditing}
                                    onDelete={() => {
                                        setDeletedIds(prev => [...prev, slide.id]);
                                        setSlides(prev => prev.filter(s => s.id !== slide.id));
                                    }}
                                />
                            ))}

                            {/* 2. 새 업로드 대기 이미지 */}
                            {uploads.map((item) => (
                                <div key={item.id} className="relative  overflow-hidden ">
                                    <img src={item.preview} className="w-full h-40 object-cover opacity-70" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <span className="text-white font-bold text-xs px-2 py-1 ">NEW</span>
                                    </div>
                                    <button onClick={() => setUploads(prev => prev.filter(u => u.id !== item.id))} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><CloseIcon /></button>
                                    {item.progress > 0 && <div className="absolute bottom-0 w-full h-1 bg-blue-500" style={{ width: `${item.progress}%` }} />}
                                </div>
                            ))}

                            {/* 3. 빈 추가 박스 */}
                            {isEditing && (
                                <div onClick={() => fileInputRef.current?.click()} className="h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:text-blue-500 transition-all text-gray-400">
                                    <PlusIcon />
                                    <span className="text-xs mt-2 font-medium">사진 추가</span>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>

                {!isEditing && slides.length === 0 && (
                    <div className="py-20 text-center text-gray-400 border rounded-xl bg-gray-50">등록된 이미지가 없습니다.</div>
                )}
            </div>
        </div>
    );
}

// --- 하위 컴포넌트 및 아이콘 ---

function SortableCard({ id, imageUrl, index, isEditing, onDelete }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { transform: CSS.Translate.toString(transform), transition, zIndex: isDragging ? 50 : 1, touchAction: "none" };

    return (
        <div ref={setNodeRef} style={style} className={`relative rounded-xl overflow-hidden shadow-sm border transition-all ${isDragging ? "scale-105 shadow-xl ring-2 ring-blue-500" : ""}`}>
            <div {...(isEditing ? { ...attributes, ...listeners } : {})} className={`w-full h-40 ${isEditing ? "cursor-grab active:cursor-grabbing" : ""}`}>
                <img src={imageUrl} className="w-full h-full object-cover pointer-events-none" />
                {isEditing && <div className="absolute inset-0 bg-black/0 hover:bg-black/10 flex items-center justify-center"><div className="bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-gray-600 opacity-0 hover:opacity-100 transition-opacity">MOVE</div></div>}
            </div>
            <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">{index + 1}</div>
            {isEditing && <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-gray-500 p-1.5 rounded-lg transition-colors shadow-sm"><CloseIcon /></button>}
        </div>
    );
}

// 아이콘 컴포넌트들 (SVG)
const PlusIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const CloseIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>;