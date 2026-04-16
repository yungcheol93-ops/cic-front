export type StoredFileMeta = {
    name: string;
    size: number;
    type: string;
};

export type AdminProject = {
    id: string;
    name: string;
    startDate?: string; // YYYY-MM-DD
    endDate?: string;   // YYYY-MM-DD
    contract?: StoredFileMeta;
    estimate?: StoredFileMeta;
    estimateDocId?: string;
    schedule?: StoredFileMeta;
    createdAt: number;
};

const STORAGE_KEY = "cic.adminProjects";
const CHANGED_EVENT = "cic-adminProjects-changed";

function emitChanged() {
    window.dispatchEvent(new Event(CHANGED_EVENT));
}

export function subscribeAdminProjectsChanged(handler: () => void) {
    window.addEventListener(CHANGED_EVENT, handler);
    return () => window.removeEventListener(CHANGED_EVENT, handler);
}

function safeParse(raw: string | null): unknown {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as unknown;
    } catch {
        return null;
    }
}

function isFileMeta(v: unknown): v is StoredFileMeta {
    if (!v || typeof v !== "object") return false;
    const o = v as Record<string, unknown>;
    return typeof o.name === "string" && typeof o.size === "number" && typeof o.type === "string";
}

function isAdminProject(v: unknown): v is AdminProject {
    if (!v || typeof v !== "object") return false;
    const o = v as Record<string, unknown>;
    if (typeof o.id !== "string") return false;
    if (typeof o.name !== "string") return false;
    if (typeof o.createdAt !== "number") return false;
    if (o.startDate != null && typeof o.startDate !== "string") return false;
    if (o.endDate != null && typeof o.endDate !== "string") return false;
    if (o.contract != null && !isFileMeta(o.contract)) return false;
    if (o.estimate != null && !isFileMeta(o.estimate)) return false;
    if (o.estimateDocId != null && typeof o.estimateDocId !== "string") return false;
    if (o.schedule != null && !isFileMeta(o.schedule)) return false;
    return true;
}

export function getAdminProjectList(): AdminProject[] {
    const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(isAdminProject);
    return valid.sort((a, b) => b.createdAt - a.createdAt);
}

export function addAdminProject(input: Omit<AdminProject, "id" | "createdAt">): AdminProject {
    const next: AdminProject = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...input,
    };
    const prev = getAdminProjectList();
    const updated = [next, ...prev];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    emitChanged();
    return next;
}

export function getAdminProjectById(projectId: string): AdminProject | null {
    const all = getAdminProjectList();
    return all.find((p) => p.id === projectId) ?? null;
}

