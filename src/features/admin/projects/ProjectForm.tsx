import ImageUploader from "./ImageUploader.tsx";
import type {IProjectFormState} from "../../../types/admin/project/projectForm.ts";

interface Props {
    form: IProjectFormState;
    setForm: React.Dispatch<React.SetStateAction<IProjectFormState>>;
    isEdit: boolean;
}

export default function ProjectForm({ form, setForm, isEdit }: Props) {
    const { project, thumbnail } = form;

    const thumbnailSrc =
        thumbnail?.preview || thumbnail?.imageUrl || project.thumbnailUrl;

    const removeThumbnail = () => {
        setForm((prev) => ({
            ...prev,
            thumbnail: null,
        }));
    };

    return (
        <div className="space-y-4">

            {/* 썸네일 */}
            <section className="border p-2 bg-white shadow-sm">
                <div className="relative w-full bg-gray-100">

                    {thumbnailSrc ? (
                        <img src={thumbnailSrc} className="w-full object-cover" />
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-gray-400">
                            썸네일 없음
                        </div>
                    )}

                    {isEdit && (
                        <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer">
                            업로드
                            <input
                                type="file"
                                hidden
                                onChange={(e: any) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    setForm((prev) => ({
                                        ...prev,
                                        thumbnail: {
                                            file,
                                            preview: URL.createObjectURL(file),
                                        },
                                    }));
                                }}
                            />
                        </label>
                    )}

                    {isEdit && thumbnail && thumbnailSrc && (
                        <button
                            onClick={removeThumbnail}
                            className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1"
                        >
                            삭제
                        </button>
                    )}
                </div>
            </section>

            {/* 이미지 */}
            <ImageUploader
                images={project.images}
                setImages={(images) =>
                    setForm((prev) => ({
                        ...prev,
                        project: { ...prev.project, images },
                    }))
                }
                thumbnail={thumbnail}
                setThumbnail={(thumb) =>
                    setForm((prev) => ({ ...prev, thumbnail: thumb }))
                }
                isEdit={isEdit}
            />

            {/* 하단 정보 좌우 영역 */}
            <section className="bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">

                    {/* 좌측 */}
                    <div className="space-y-2 text-sm">

                        {[
                            { label: "코드", key: "projectCode" },
                            { label: "완공", key: "completion" },
                            { label: "소재지", key: "location" },
                            { label: "용도", key: "type" },
                            { label: "작업", key: "scope" },
                            { label: "사진촬영", key: "photography" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <span className="text-gray-400">{label} : </span>

                                {isEdit ? (
                                    <input
                                        value={(project as any)[key]}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                project: {
                                                    ...prev.project,
                                                    [key]: e.target.value,
                                                },
                                            }))
                                        }
                                        className="ml-2 outline-none"
                                    />
                                ) : (
                                    <span>{(project as any)[key]}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 우측 */}
                    <div className="text-sm">

                        {isEdit ? (
                            <>
                                <textarea
                                    value={project.description || ""}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            project: {
                                                ...prev.project,
                                                description: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full h-[200px] border p-3 resize-none leading-relaxed"
                                />
                                <p className="text-right text-xs text-gray-400">
                                    {project.description?.length} 자
                                </p>
                            </>
                        ) : (
                            <p className="whitespace-pre-line">
                                {project.description}
                            </p>
                        )}

                    </div>

                </div>
            </section>

        </div>
    );
}