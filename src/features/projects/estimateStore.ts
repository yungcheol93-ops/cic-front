export type EstimateRow = {
    id: string;
    category: string; // 공종
    spec: string;
    unit: string;
    qty: number;
    materialUnitPrice: number; // 재료비 단가
    laborUnitPrice: number;    // 노무비 단가
    remark: string;            // 비고
};

export type EstimateDoc = {
    id: string;
    title: string;
    rows: EstimateRow[];
    updatedAt: number;
};

const DRAFT_KEY = "cic.estimateDraft";
const DRAFT_CHANGED_EVENT = "cic-estimateDraft-changed";

function emitDraftChanged() {
    window.dispatchEvent(new Event(DRAFT_CHANGED_EVENT));
}

export function subscribeEstimateDraftChanged(handler: () => void) {
    window.addEventListener(DRAFT_CHANGED_EVENT, handler);
    return () => window.removeEventListener(DRAFT_CHANGED_EVENT, handler);
}

function safeParse(raw: string | null): unknown {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as unknown;
    } catch {
        return null;
    }
}

function isRow(v: unknown): v is EstimateRow {
    if (!v || typeof v !== "object") return false;
    const o = v as Record<string, unknown>;
    return (
        typeof o.id === "string" &&
        typeof o.category === "string" &&
        typeof o.spec === "string" &&
        typeof o.unit === "string" &&
        typeof o.qty === "number" &&
        typeof o.materialUnitPrice === "number" &&
        typeof o.laborUnitPrice === "number" &&
        typeof o.remark === "string"
    );
}

function isDoc(v: unknown): v is EstimateDoc {
    if (!v || typeof v !== "object") return false;
    const o = v as Record<string, unknown>;
    if (typeof o.id !== "string") return false;
    if (typeof o.title !== "string") return false;
    if (!Array.isArray(o.rows) || !o.rows.every(isRow)) return false;
    if (typeof o.updatedAt !== "number") return false;
    return true;
}

export function getEstimateDraft(): EstimateDoc | null {
    const parsed = safeParse(localStorage.getItem(DRAFT_KEY));
    return isDoc(parsed) ? parsed : null;
}

export function setEstimateDraft(doc: EstimateDoc) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(doc));
    emitDraftChanged();
}

export function clearEstimateDraft() {
    localStorage.removeItem(DRAFT_KEY);
    emitDraftChanged();
}

export function createEmptyEstimateDraft(): EstimateDoc {
    const seededCategories = [
        "현장보양",
        "철거공사",
        "목공사",
        "전기공사",
        "설비공사",
        "타일공사",
        "도장공사",
        "바닥공사",
        "조명공사",
        "가구공사",
        "유리/금속",
        "마감/청소",
        "기타",
    ];

    return {
        id: crypto.randomUUID(),
        title: "견적서",
        rows: seededCategories.map((c) => ({
            id: crypto.randomUUID(),
            category: c,
            spec: "",
            unit: "",
            qty: 1,
            materialUnitPrice: 0,
            laborUnitPrice: 0,
            remark: "",
        })),
        updatedAt: Date.now(),
    };
}

