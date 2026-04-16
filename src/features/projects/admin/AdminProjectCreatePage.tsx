import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuthState } from "../../../api/auth.api.ts";
import {getEstimateDraft, subscribeEstimateDraftChanged} from "../estimateStore.ts";

function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let value = bytes;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }
    return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function AdminProjectCreatePage() {
    const auth = getAuthState();
    if (!auth) return <Navigate to="/Login" replace />;
    if (auth.role !== "admin") return <Navigate to="/MyProject" replace />;

    const navigate = useNavigate();
    
    const [projectCode, setProjectCode] = useState("sp.0001");
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [contract, setContract] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasEstimateDraft, setHasEstimateDraft] = useState(false);
    const [estimateTitle, setEstimateTitle] = useState<string>("");

    const canSave = useMemo(() => name.trim().length > 0, [name]);

    useEffect(() => {
        // 기존 프로젝트 개수 기반 자동 증가 (임시)
        const stored = localStorage.getItem("admin_projects");
        const list = stored ? JSON.parse(stored) : [];
        const next = list.length + 1;
    
        const formatted = `sp.${String(next).padStart(4, "0")}`;
        setProjectCode(formatted);
    }, []);

    useEffect(() => {
        const draft = getEstimateDraft();
        setHasEstimateDraft(!!draft);
        setEstimateTitle(draft?.title ?? "");
        return subscribeEstimateDraftChanged(() => {
            const next = getEstimateDraft();
            setHasEstimateDraft(!!next);
            setEstimateTitle(next?.title ?? "");
        });
    }, []);

    async function handleSave() {
        if (!canSave) {
            setError("프로젝트명을 입력해주세요.");
            return;
        }

        try {
            const formData = new FormData();

            const dto = {
                projectCode,
                name,
                startDate,
                endDate,
            };

            formData.append(
                "dto",
                new Blob([JSON.stringify(dto)], { type: "application/json" })
            );

            //  썸네일
            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }

            //  이미지 여러장
            images.forEach((img) => {
                formData.append("images", img);
            });

            //  계약서
            if (contract) {
                formData.append("contract", contract);
            }

            await axios.post( import.meta.env.VITE_API_URL + "/api/admin/project", formData);

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
                        disabled={!canSave}
                    >
                        저장
                    </button>
                </div>
            </div>

            <div className="max-w-xl space-y-8">
            <div className="space-y-2">
                    <label className="block text-sm text-zinc-500">프로젝트 코드</label>
                    <input
                        value={projectCode}
                        onChange={(e) => setProjectCode(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-zinc-100 border border-zinc-300 text-zinc-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm text-zinc-500">프로젝트명</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded bg-transparent border border-zinc-300 text-zinc-700 outline-none focus:border-zinc-700 transition"
                    />
                </div>
                <div className="space-y-2 flex">
                    <label className="block text-sm text-zinc-500">프로젝트 기간</label>
                    <input
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        type="date"
                        className="w-full px-3 py-2 rounded bg-transparent border border-zinc-300 text-zinc-700 outline-none focus:border-zinc-700 transition"
                    />
                    <input
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        type="date"
                        className="w-full px-3 py-2 rounded bg-transparent border border-zinc-300 text-zinc-700 outline-none focus:border-zinc-700 transition"
                    />
                </div>
                {/* 썸네일 */}
                <div className="space-y-3">
                    <p className="text-sm text-zinc-500">프로젝트 썸네일</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files) {
                                setThumbnail(e.target.files[0]);
                            }
                        }}
                    />
                    {thumbnail && (
                        <p className="text-xs text-zinc-500">
                            {thumbnail.name} ({formatBytes(thumbnail.size)})
                        </p>
                    )}
                </div>

                {/* 여러 이미지 */}
                <div className="space-y-3">
                    <p className="text-sm text-zinc-500">프로젝트 사진</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setImages(Array.from(e.target.files || []))}
                    />
                    {images.length > 0 && (
                        <div className="text-xs text-zinc-500 space-y-1">
                            {images.map((img, i) => (
                                <p key={i}>{img.name}</p>
                            ))}
                        </div>
                    )}
                </div>
                <div className="space-y-3">
                    <p className="text-sm text-zinc-500">계약서 등록</p>
                    <input
                        type="file"
                        className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
                        onChange={(e) => setContract(e.target.files?.item(0) ?? null)}
                    />
                    {contract && (
                        <p className="text-xs text-zinc-500">
                            선택됨: {contract.name} ({formatBytes(contract.size)})
                        </p>
                    )}
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-zinc-500">견적서 등록</p>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                            onClick={() => navigate("/Admin/EstimateCreate")}
                        >
                            견적서 등록(작성)
                        </button>
                        {hasEstimateDraft && (
                            <p className="text-xs text-zinc-500">
                                연결됨: {estimateTitle || "견적서"}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-zinc-500">시공 스케쥴표 등록</p>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                            onClick={() => navigate("/Admin/Schedule")}
                        >
                            시공 스케쥴표 등록(관리)
                        </button>
                    </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <p className="text-xs text-zinc-500 leading-relaxed">
                    현재는 임시 저장(localStorage)입니다. 파일은 업로드 선택은 되지만, 브라우저 저장소 용량 이슈 때문에
                    파일 자체가 아니라 파일명/용량 같은 메타정보만 저장됩니다.
                </p>
            </div>
        </div>
    );
}

