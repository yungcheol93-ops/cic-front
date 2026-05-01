import FurnitureForm from "./FurnitureForm.tsx";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getAdminFurniture, patchAdminFurniture} from "../../../api/furniture.api.ts";
import type {IFurnitureFormState} from "../../../types/admin/furniture/furnitureForm.ts";
import {transformFurniture} from "./utils/furniture.transform.ts";
import AlertModal from "../../../components/common/modal/AlertModal.tsx";
import {uploadImages} from "../../../api/cloudinary.furniture.api.ts";

export default function AdminFurnitureDetailPage() {
    const navigate = useNavigate();
    const { furnitureId } = useParams<{ furnitureId: string }>();

    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState<IFurnitureFormState>({
        furniture: {
            id: 0,
            furnitureCode: "",
            title: "",
            width: "",
            height: "",
            volume: "",
            description: "",
            images: [],
            isPublic: true,
            status: "COMPLETED"
        },
        thumbnail: null,
    });

    const [error, setError] = useState<string | null>(null);

    // 데이터 가져오기
    useEffect(() => {
        if (!furnitureId) return;

        getAdminFurniture(Number(furnitureId)).then(res => {
            // const data = transformFurniture(res.data);
            // console.log(res.data);
            // setForm(data);
            setForm({
                furniture: res.data,
                thumbnail: {
                    imageUrl: res.data.thumbnailUrl,
                },
            });
        });

    }, [furnitureId]);

    if (!form.furniture.id) return <div className="p-10">로딩중...</div>;


    const handleSave = async () => {
        const { furniture, thumbnail } = form;

        try {
            //  새로 추가된 파일만 추출
            let thumbnailUrl = furniture.thumbnailUrl;
            const newFiles = furniture.images.filter((img: any) => img.file);

            //  Cloudinary 업로드
            if (thumbnail?.file) {
                thumbnailUrl = await uploadImages(thumbnail.file);
            }
            const uploadedUrls = await Promise.all(
                newFiles.map((img: any) => uploadImages(img.file))
            );
            let uploadIndex = 0;


            const imagesPayload = furniture.images.map((img: any, index: number) => {
                if (typeof img.id === "number") {
                    return {
                        id: img.id,
                        imageUrl: img.imageUrl,
                        orderIndex: index,
                    };
                }

                const url = uploadedUrls[uploadIndex++];

                return {
                    id: null,
                    imageUrl: url,
                    orderIndex: index,
                };
            });

            if (!thumbnail) {
                thumbnailUrl = undefined;
            }
            // 기존 이미지 id
            // const existingImageIds = furniture.images
            //     .filter((img: any) => typeof img.id === "number")
            //     .map((img: any) => img.id);
            //
            // //  순서
            // const orders = furniture.images.map((_: any, index: number) => index);
            //

            await patchAdminFurniture(Number(furnitureId), {
                    furnitureCode:furniture.furnitureCode,
                    title: furniture.title,
                    width: furniture.width,
                    height: furniture.height,
                    volume: furniture.volume,
                    description:furniture.description,
                    status: furniture.status,
                    isPublic: furniture.isPublic,
                    thumbnailUrl:thumbnailUrl,
                    images: imagesPayload,
                    // existingImageIds,
                    // orders,
                    // newImageUrls: uploadedUrls,
            });

            setIsEdit(false);
            setError("수정 완료");
        } catch {
            setError("수정 실패");
        }
    };

    //수정 취소
    const handleCancel = async () => {
        const res = await getAdminFurniture(Number(furnitureId));
        setForm(transformFurniture(res.data));
        setIsEdit(false);
    };


    return (
        <div className="h-full min-h-screen">

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
                                onClick={() => navigate("/admin/furniture/list")}
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
                                onClick={handleCancel}
                                className="px-3 py-1 bg-red-500 text-white text-xs hover:bg-red-600"
                            >
                                취소
                            </button>

                            <button
                                onClick={() => navigate("/admin/furniture/list")}
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
                                    furniture: {
                                        ...prev.furniture,
                                        isPublic: !prev.furniture.isPublic,
                                    },
                                }))
                            }
                            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition
                            ${form.furniture.isPublic ? "bg-green-500" : "bg-gray-300"}`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full transition
                            ${form.furniture.isPublic ? "translate-x-6" : ""}`}
                            />
                        </div>
                    ) : (
                        <span
                            className={`px-3 py-1 text-xs rounded-full font-medium
                    ${
                                form.furniture.isPublic
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-200 text-gray-600"
                            }`}
                        >
                            {form.furniture.isPublic ? "공개" : "비공개"}
                        </span>
                    )}

                </div>

            </section>

            <FurnitureForm
                form={form}
                setForm={setForm}
                isEdit={isEdit}
            />
            <AlertModal
                open={!!error}
                message={error || ""}
                onClose={() => setError(null)}
            />
        </div>
    );
}
