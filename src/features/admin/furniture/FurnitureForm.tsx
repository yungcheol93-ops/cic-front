import type {IFurnitureFormState} from "../../../types/admin/furniture/furnitureForm.ts";
import ImageUploader from "../../../components/common/image-manager/ImageUploader.tsx";
import {getThumbnail} from "../../../utils/imageUtils.ts";
import {useState} from "react";


interface Props {
    form: IFurnitureFormState
    setForm: React.Dispatch<React.SetStateAction<IFurnitureFormState>>;
    isEdit: boolean;
}

export default function FurnitureForm({ form, setForm, isEdit }: Props) {
    const { furniture, thumbnail } = form;
    const [isThumbnailDeleted, setIsThumbnailDeleted] = useState(false);

    const thumbnailSrc = (() => {
        if (thumbnail?.preview || thumbnail?.imageUrl) {
            return thumbnail.preview || thumbnail.imageUrl;
        }
        if (isThumbnailDeleted) return null;
        return furniture.thumbnailUrl;
    })();

    const removeThumbnail = () => {
        setForm((prev) => ({
            ...prev,
            thumbnail: null,
        }));
        setIsThumbnailDeleted(true);
    };

    return (
         <div className="w-full h-[calc(100vh-120px)] flex gap-6">

            {/* 왼쪽 - 이미지 영역 */}
            <div className="w-2/3 h-full overflow-y-auto space-y-6 pr-2 no-scrollbar">
                <div className="relative flex items-center justify-center ">
                {/* 썸네일 */}
                {thumbnailSrc ? (
                    <img
                        src={getThumbnail(thumbnailSrc)}
                        className=" object-cover" />
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
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setForm((prev) => ({
                                    ...prev,
                                    thumbnail: {
                                        file,
                                        preview: URL.createObjectURL(file),
                                    },
                                }));
                                setIsThumbnailDeleted(false);
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


                {/* 이미지 리스트 */}
                <ImageUploader
                    images={furniture.images}
                    setImages={(images) =>
                        setForm((prev): IFurnitureFormState => ({
                            ...prev,
                            furniture: { ...prev.furniture, images },
                        }))
                    }
                    thumbnail={thumbnail}
                    setThumbnail={(thumb) =>
                        setForm((prev) => ({ ...prev, thumbnail: thumb }))
                    }
                    isEdit={isEdit}
                    viewType="vertical"
                />

            </div>

            {/*오른쪽 - 정보 (고정) */}
            <div className="w-1/3 h-full flex flex-col">

                <div className="sticky top-10 space-y-6 bg-white p-4 shadow-sm">

                    {/* 기본 정보 */}
                    <div className="space-y-3 text-sm">

                        {[
                            { label: "code", key: "furnitureCode" },
                            { label: "title", key: "title" },
                            { label: "width", key: "width" },
                            { label: "height", key: "height" },
                            { label: "volume", key: "volume" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <span className="text-gray-400">{label} : </span>

                                {isEdit ? (
                                    <input
                                        value={(furniture as any)[key] ?? ""}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                furniture: {
                                                    ...prev.furniture,
                                                    [key]: e.target.value,
                                                },
                                            }))
                                        }
                                        className="ml-2 border-b outline-none"
                                    />
                                ) : (
                                    <span>{(furniture as any)[key]}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 설명 */}
                    <div>
                        {isEdit ? (
                            <>
                                <textarea
                                    value={furniture.description || ""}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            furniture: {
                                                ...prev.furniture,
                                                description: e.target.value,
                                            },
                                        }))
                                    }
                                    className="w-full h-[200px] border p-3 resize-none"
                                />
                                <p className="text-right text-xs text-gray-400">
                                    {furniture.description?.length} 자
                                </p>
                            </>
                        ) : (
                            <p className="whitespace-pre-line">
                                {furniture.description}
                            </p>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}