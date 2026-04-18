import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuthState } from "../../../api/auth.api.ts";
import {
    createEmptyEstimateDraft,
    getEstimateDraft,
    setEstimateDraft,
    type EstimateDoc,
    type EstimateRow,
} from "../../projects/estimateStore.ts";

function formatNumber(n: number) {
    try {
        return new Intl.NumberFormat("ko-KR").format(n);
    } catch {
        return String(n);
    }
}

function clampNonNegativeInt(value: string) {
    const n = Number(value);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.trunc(n));
}

function materialAmount(row: EstimateRow) {
    return row.qty * row.materialUnitPrice;
}

function laborAmount(row: EstimateRow) {
    return row.qty * row.laborUnitPrice;
}

function rowTotal(row: EstimateRow) {
    return materialAmount(row) + laborAmount(row);
}

export default function AdminEstimateCreatePage() {
    const auth = getAuthState();
    if (!auth) return <Navigate to="/Login" replace />;
    if (auth.role !== "admin") return <Navigate to="/MyProject" replace />;

    const navigate = useNavigate();
    const [doc, setDoc] = useState<EstimateDoc>(() => getEstimateDraft() ?? createEmptyEstimateDraft());

    useEffect(() => {
        const existing = getEstimateDraft();
        if (existing) setDoc(existing);
    }, []);

    const grandTotal = useMemo(() => doc.rows.reduce((sum, r) => sum + rowTotal(r), 0), [doc.rows]);

    function updateRow(rowId: string, patch: Partial<EstimateRow>) {
        setDoc((prev) => ({
            ...prev,
            updatedAt: Date.now(),
            rows: prev.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)),
        }));
    }

    function addRow() {
        setDoc((prev) => ({
            ...prev,
            updatedAt: Date.now(),
            rows: [
                ...prev.rows,
                {
                    id: crypto.randomUUID(),
                    category: "",
                    spec: "",
                    unit: "",
                    qty: 1,
                    materialUnitPrice: 0,
                    laborUnitPrice: 0,
                    remark: "",
                },
            ],
        }));
    }

    function removeRow(rowId: string) {
        setDoc((prev) => ({
            ...prev,
            updatedAt: Date.now(),
            rows: prev.rows.length <= 1 ? prev.rows : prev.rows.filter((r) => r.id !== rowId),
        }));
    }

    function handleSave() {
        const normalized: EstimateDoc = {
            ...doc,
            title: doc.title.trim() || "견적서",
            updatedAt: Date.now(),
            rows: doc.rows.map((r) => ({
                ...r,
                category: r.category.trim(),
                spec: r.spec.trim(),
                unit: r.unit.trim(),
                qty: Math.max(0, Math.trunc(r.qty)),
                    materialUnitPrice: Math.max(0, Math.trunc(r.materialUnitPrice)),
                    laborUnitPrice: Math.max(0, Math.trunc(r.laborUnitPrice)),
                    remark: r.remark.trim(),
            })),
        };
        setEstimateDraft(normalized);
        navigate("/Admin/ProjectCreate", { replace: true });
    }

    return (
        <div className="h-full min-h-screen px-16 py-16">
            <div className="flex items-start justify-between gap-6 mb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-cic font-light uppercase">견적서 등록</h1>
                    <p className="text-xs text-zinc-500">저장하면 프로젝트 등록 화면에 자동 연결됩니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                        onClick={() => navigate("/Admin/ProjectCreate")}
                    >
                        뒤로
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition"
                        onClick={handleSave}
                    >
                        저장
                    </button>
                </div>
            </div>

            <div className="max-w-5xl space-y-4">
                <div className="space-y-2 max-w-md">
                    <label className="block text-sm text-zinc-500">견적서 제목</label>
                    <input
                        value={doc.title}
                        onChange={(e) => setDoc((p) => ({ ...p, title: e.target.value, updatedAt: Date.now() }))}
                        className="w-full px-3 py-2 rounded bg-transparent border border-zinc-300 text-zinc-700 outline-none focus:border-zinc-700 transition"
                    />
                </div>

                <div className="border border-zinc-200 rounded overflow-hidden">
                    <div className="grid grid-cols-12 bg-zinc-50 text-xs text-zinc-600">
                        <div className="col-span-2 px-3 py-2 border-r border-zinc-200">품명</div>
                        <div className="col-span-3 px-3 py-2 border-r border-zinc-200">규격</div>
                        <div className="col-span-1 px-3 py-2 border-r border-zinc-200">단위</div>
                        <div className="col-span-1 px-3 py-2 border-r border-zinc-200 text-right">수량</div>
                        <div className="col-span-1 px-3 py-2 border-r border-zinc-200 text-right">재료 단가</div>
                        <div className="col-span-1 px-3 py-2 border-r border-zinc-200 text-right">재료 액</div>
                        <div className="col-span-1 px-3 py-2 border-r border-zinc-200 text-right">노무 단가</div>
                        <div className="col-span-1 px-3 py-2 border-r border-zinc-200 text-right">노무 액</div>
                        <div className="col-span-1 px-3 py-2 text-right">계</div>
                        <div className="col-span-1 px-3 py-2 border-l border-zinc-200">비고</div>
                    </div>

                    {doc.rows.map((r) => (
                        <div key={r.id} className="grid grid-cols-12 text-sm border-t border-zinc-200">
                            <div className="col-span-2 px-2 py-2 border-r border-zinc-200">
                                <input
                                    value={r.category}
                                    onChange={(e) => updateRow(r.id, { category: e.target.value })}
                                    className="w-full bg-transparent outline-none text-zinc-700"
                                />
                            </div>
                            <div className="col-span-3 px-2 py-2 border-r border-zinc-200">
                                <input
                                    value={r.spec}
                                    onChange={(e) => updateRow(r.id, { spec: e.target.value })}
                                    className="w-full bg-transparent outline-none text-zinc-700"
                                />
                            </div>
                            <div className="col-span-1 px-2 py-2 border-r border-zinc-200">
                                <input
                                    value={r.unit}
                                    onChange={(e) => updateRow(r.id, { unit: e.target.value })}
                                    className="w-full bg-transparent outline-none text-zinc-700"
                                />
                            </div>
                            <div className="col-span-1 px-2 py-2 border-r border-zinc-200 text-right">
                                <input
                                    value={String(r.qty)}
                                    onChange={(e) => updateRow(r.id, { qty: clampNonNegativeInt(e.target.value) })}
                                    className="w-full bg-transparent outline-none text-zinc-700 text-right"
                                    inputMode="numeric"
                                />
                            </div>
                            <div className="col-span-1 px-2 py-2 border-r border-zinc-200 text-right">
                                <input
                                    value={String(r.materialUnitPrice)}
                                    onChange={(e) => updateRow(r.id, { materialUnitPrice: clampNonNegativeInt(e.target.value) })}
                                    className="w-full bg-transparent outline-none text-zinc-700 text-right"
                                    inputMode="numeric"
                                />
                            </div>
                            <div className="col-span-1 px-2 py-2 border-r border-zinc-200 text-right">
                                <span className="text-zinc-700">{formatNumber(materialAmount(r))}</span>
                            </div>
                            <div className="col-span-1 px-2 py-2 border-r border-zinc-200 text-right">
                                <input
                                    value={String(r.laborUnitPrice)}
                                    onChange={(e) => updateRow(r.id, { laborUnitPrice: clampNonNegativeInt(e.target.value) })}
                                    className="w-full bg-transparent outline-none text-zinc-700 text-right"
                                    inputMode="numeric"
                                />
                            </div>
                            <div className="col-span-1 px-2 py-2 border-r border-zinc-200 text-right">
                                <span className="text-zinc-700">{formatNumber(laborAmount(r))}</span>
                            </div>
                            <div className="col-span-1 px-2 py-2 text-right flex items-center justify-between gap-2">
                                <span className="text-zinc-700">{formatNumber(rowTotal(r))}</span>
                                <button
                                    type="button"
                                    className="text-xs text-zinc-400 hover:text-zinc-700 transition"
                                    onClick={() => removeRow(r.id)}
                                    aria-label="행 삭제"
                                >
                                    삭제
                                </button>
                            </div>
                            <div className="col-span-1 px-2 py-2 border-l border-zinc-200">
                                <input
                                    value={r.remark}
                                    onChange={(e) => updateRow(r.id, { remark: e.target.value })}
                                    className="w-full bg-transparent outline-none text-zinc-700"
                                />
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center justify-between px-3 py-3 bg-zinc-50 border-t border-zinc-200">
                        <button
                            type="button"
                            className="px-3 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition text-sm"
                            onClick={addRow}
                        >
                            행 추가
                        </button>
                        <div className="text-sm text-zinc-700">
                            합계: <span className="font-medium">{formatNumber(grandTotal)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

