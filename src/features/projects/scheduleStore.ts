export type ScheduleTask = {
    id: string;
    name: string;
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
};

export type ScheduleState = {
    tasks: ScheduleTask[];
    updatedAt: number;
};

const STORAGE_KEY = "cic.adminSchedule";
const CHANGED_EVENT = "cic-adminSchedule-changed";

function emitChanged() {
    window.dispatchEvent(new Event(CHANGED_EVENT));
}

export function subscribeScheduleChanged(handler: () => void) {
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

function isTask(v: unknown): v is ScheduleTask {
    if (!v || typeof v !== "object") return false;
    const o = v as Record<string, unknown>;
    return (
        typeof o.id === "string" &&
        typeof o.name === "string" &&
        typeof o.start === "string" &&
        typeof o.end === "string"
    );
}

function isState(v: unknown): v is ScheduleState {
    if (!v || typeof v !== "object") return false;
    const o = v as Record<string, unknown>;
    return Array.isArray(o.tasks) && o.tasks.every(isTask) && typeof o.updatedAt === "number";
}

export function getScheduleState(): ScheduleState {
    const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
    if (isState(parsed)) return parsed;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const base = `${yyyy}-${mm}-${dd}`;

    return {
        updatedAt: Date.now(),
        tasks: [
            { id: crypto.randomUUID(), name: "철거", start: base, end: base },
            { id: crypto.randomUUID(), name: "목공", start: base, end: base },
            { id: crypto.randomUUID(), name: "전기", start: base, end: base },
            { id: crypto.randomUUID(), name: "설비", start: base, end: base },
            { id: crypto.randomUUID(), name: "도장", start: base, end: base },
            { id: crypto.randomUUID(), name: "마감", start: base, end: base },
        ],
    };
}

export function setScheduleState(next: ScheduleState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitChanged();
}

