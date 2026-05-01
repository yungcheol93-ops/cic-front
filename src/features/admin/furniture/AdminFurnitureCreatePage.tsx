import FurnitureForm from "./FurnitureForm.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {createAdminFurniture} from "../../../api/furniture.api.ts";
import type {IFurnitureFormState} from "../../../types/admin/furniture/furnitureForm.ts";
import AlertModal from "../../../components/common/modal/AlertModal.tsx";

export default function AdminFurnitureCreatePage() {
    const navigate = useNavigate();

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

    const handleSave = async () => {

        if (!form.furniture.furnitureCode) {
            setError("프로젝트 코드를 입력해주세요.");
            return;
        }

        try {

            await createAdminFurniture(form);

            navigate("/admin/furniture/list", { replace: true });

        } catch (e) {
            setError("저장 중 오류 발생");
            console.error(e);
        }
    };

    return (
        <div className="h-full min-h-screen">


            <div className="flex items-start justify-between gap-6 mb-4">
                <h1 className="text-3xl font-cic font-light uppercase">
                    가구 등록
                </h1>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate("/admin/furniture/list")}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1 text-xs bg-zinc-800 text-zinc-200 hover:bg-gray-600 cursor-pointer"
                        onClick={handleSave}

                    >
                        저장
                    </button>
                </div>
            </div>

            <FurnitureForm
                form={form}
                setForm={setForm}
                isEdit={true}
            />
            <AlertModal
                open={!!error}
                message={error || ""}
                onClose={() => setError(null)}
            />
        </div>
    );
}
