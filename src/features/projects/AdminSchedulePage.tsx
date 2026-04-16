import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuthState } from "../../api/auth.api.ts";
import { getScheduleState, setScheduleState, subscribeScheduleChanged, type ScheduleTask } from "./scheduleStore";
import { getAdminProjectList, subscribeAdminProjectsChanged, type AdminProject } from "./adminProjectStore";

const DAY_MS = 24 * 60 * 60 * 1000;

function parseYmd(ymd: string) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
    if (!m) return NaN;
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const dt = new Date(y, mo, d);
    return dt.getTime();
}

function formatYmd(ms: number) {
    const d = new Date(ms);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function clampToRange(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function startOfDay(ms: number) {
    const d = new Date(ms);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function diffDays(aMs: number, bMs: number) {
    return Math.round((startOfDay(aMs) - startOfDay(bMs)) / DAY_MS);
}

function addDays(ms: number, days: number) {
    return startOfDay(ms + days * DAY_MS);
}

function startOfMonth(ms: number) {
    const d = new Date(ms);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function endOfMonth(ms: number) {
    const d = new Date(ms);
    d.setMonth(d.getMonth() + 1, 0);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

function getCalendarStart(ms: number) {
    const first = startOfMonth(ms);
    const day = new Date(first).getDay(); // 0 Sun
    return addDays(first, -day);
}

function hashToHue(input: string) {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
        h = (h * 31 + input.charCodeAt(i)) % 360;
    }
    return h;
}

type DragState = {
    taskId: string;
    startMs: number;
    endMs: number;
    startX: number;
};

export default function AdminSchedulePage() {
    const auth = getAuthState();
    if (!auth) return <Navigate to="/Login" replace />;

    const isAdmin = auth.role === "admin";
    const navigate = useNavigate();

    const [tab, setTab] = useState<"calendar" | "gantt">("calendar");

    const [projects, setProjects] = useState<AdminProject[]>([]);
    const [tasks, setTasks] = useState<ScheduleTask[]>(() => getScheduleState().tasks);
    const dragRef = useRef<DragState | null>(null);
    const timelineRef = useRef<HTMLDivElement | null>(null);

    const [monthMs, setMonthMs] = useState(() => startOfMonth(Date.now()));

    useEffect(() => {
        setTasks(getScheduleState().tasks);
        return subscribeScheduleChanged(() => {
            setTasks(getScheduleState().tasks);
        });
    }, []);

    useEffect(() => {
        setProjects(getAdminProjectList());
        return subscribeAdminProjectsChanged(() => {
            setProjects(getAdminProjectList());
        });
    }, []);

    const range = useMemo(() => {
        const times = tasks
            .flatMap((t) => [parseYmd(t.start), parseYmd(t.end)])
            .filter((n) => Number.isFinite(n));

        const now = startOfDay(Date.now());
        const minMs = times.length ? Math.min(...times) : now;
        const maxMs = times.length ? Math.max(...times) : addDays(now, 30);

        const paddedMin = addDays(minMs, -7);
        const paddedMax = addDays(maxMs, 14);
        const days = Math.max(1, diffDays(paddedMax, paddedMin) + 1);
        return { startMs: paddedMin, endMs: paddedMax, days };
    }, [tasks]);

    const dayWidth = 28;
    const gridWidth = range.days * dayWidth;

    function persist(nextTasks: ScheduleTask[]) {
        setTasks(nextTasks);
        setScheduleState({ tasks: nextTasks, updatedAt: Date.now() });
    }

    function updateTask(taskId: string, patch: Partial<ScheduleTask>) {
        const next = tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t));
        persist(next);
    }

    function normalizeStartEnd(start: string, end: string) {
        const s = parseYmd(start);
        const e = parseYmd(end);
        if (!Number.isFinite(s) || !Number.isFinite(e)) return { start, end };
        if (e < s) return { start: end, end: start };
        return { start, end };
    }

    function onBarPointerDown(e: React.PointerEvent, task: ScheduleTask) {
        if (!isAdmin) return;
        const startMs = parseYmd(task.start);
        const endMs = parseYmd(task.end);
        if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return;

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        dragRef.current = {
            taskId: task.id,
            startMs,
            endMs,
            startX: e.clientX,
        };
    }

    function onBarPointerMove(e: React.PointerEvent) {
        if (!isAdmin) return;
        const drag = dragRef.current;
        if (!drag) return;

        const dx = e.clientX - drag.startX;
        const deltaDays = Math.round(dx / dayWidth);
        if (deltaDays === 0) return;

        const nextStartMs = addDays(drag.startMs, deltaDays);
        // end date is derived from start + duration

        // clamp within visible range (optional safety)
        const minStart = range.startMs;
        const maxEnd = range.endMs;
        const durationDays = diffDays(drag.endMs, drag.startMs);

        const clampedStart = clampToRange(nextStartMs, minStart, addDays(maxEnd, -durationDays));
        const clampedEnd = addDays(clampedStart, durationDays);

        const next = tasks.map((t) =>
            t.id === drag.taskId
                ? { ...t, start: formatYmd(clampedStart), end: formatYmd(clampedEnd) }
                : t
        );
        persist(next);
    }

    function onBarPointerUp(e: React.PointerEvent) {
        if (!isAdmin) return;
        if (!dragRef.current) return;
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        dragRef.current = null;
    }

    const dayLabels = useMemo(() => {
        const labels: { key: string; text: string; isWeekend: boolean }[] = [];
        for (let i = 0; i < range.days; i++) {
            const ms = addDays(range.startMs, i);
            const d = new Date(ms);
            const day = d.getDay();
            labels.push({
                key: formatYmd(ms),
                text: `${d.getMonth() + 1}/${d.getDate()}`,
                isWeekend: day === 0 || day === 6,
            });
        }
        return labels;
    }, [range.days, range.startMs]);

    const calendarCells = useMemo(() => {
        const start = getCalendarStart(monthMs);
        const end = endOfMonth(monthMs);
        const weeks = Math.ceil((diffDays(end, start) + 1) / 7);
        const totalCells = weeks * 7;

        const monthIndex = new Date(monthMs).getMonth();

        const cells: {
            key: string;
            ms: number;
            inMonth: boolean;
            ymd: string;
            day: number;
            isWeekend: boolean;
        }[] = [];

        for (let i = 0; i < totalCells; i++) {
            const ms = addDays(start, i);
            const d = new Date(ms);
            const inMonth = d.getMonth() === monthIndex;
            const day = d.getDate();
            const dow = d.getDay();
            cells.push({
                key: formatYmd(ms),
                ms,
                inMonth,
                ymd: formatYmd(ms),
                day,
                isWeekend: dow === 0 || dow === 6,
            });
        }
        return cells;
    }, [monthMs]);

    const projectsByDay = useMemo(() => {
        const map = new Map<string, AdminProject[]>();
        for (const p of projects) {
            if (!p.startDate || !p.endDate) continue;
            const s = parseYmd(p.startDate);
            const e = parseYmd(p.endDate);
            if (!Number.isFinite(s) || !Number.isFinite(e)) continue;

            const start = startOfDay(Math.min(s, e));
            const end = startOfDay(Math.max(s, e));
            const days = diffDays(end, start);
            for (let i = 0; i <= days; i++) {
                const ymd = formatYmd(addDays(start, i));
                const arr = map.get(ymd) ?? [];
                arr.push(p);
                map.set(ymd, arr);
            }
        }
        return map;
    }, [projects]);

    return (
        <div className="h-full min-h-screen px-16 py-16">
            <div className="flex items-start justify-between gap-6 mb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-cic font-light uppercase">시공 스케쥴표</h1>
                    <p className="text-xs text-zinc-500">
                        {tab === "calendar"
                            ? "프로젝트 기간을 달력에서 한눈에 확인합니다."
                            : isAdmin
                                ? "바를 드래그해서 일정 이동이 가능합니다."
                                : "관리자만 수정할 수 있습니다."}
                    </p>
                </div>
                <button
                    type="button"
                    className="px-4 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition"
                    onClick={() => navigate("/Admin/ProjectCreate")}
                >
                    프로젝트 등록으로
                </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <button
                    type="button"
                    className={
                        "px-3 py-2 rounded border text-sm transition " +
                        (tab === "calendar"
                            ? "border-zinc-800 bg-zinc-800 text-white"
                            : "border-zinc-300 text-zinc-700 hover:bg-zinc-100")
                    }
                    onClick={() => setTab("calendar")}
                >
                    달력
                </button>
                <button
                    type="button"
                    className={
                        "px-3 py-2 rounded border text-sm transition " +
                        (tab === "gantt"
                            ? "border-zinc-800 bg-zinc-800 text-white"
                            : "border-zinc-300 text-zinc-700 hover:bg-zinc-100")
                    }
                    onClick={() => setTab("gantt")}
                >
                    공정(Gantt)
                </button>
            </div>

            {tab === "calendar" ? (
                <div className="border border-zinc-200 rounded overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 border-b border-zinc-200">
                        <div className="text-sm text-zinc-700">
                            {new Date(monthMs).getFullYear()}년 {new Date(monthMs).getMonth() + 1}월
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="px-3 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition text-sm"
                                onClick={() => setMonthMs((m) => startOfMonth(addDays(m, -1)))}
                            >
                                이전
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition text-sm"
                                onClick={() => setMonthMs(startOfMonth(Date.now()))}
                            >
                                이번달
                            </button>
                            <button
                                type="button"
                                className="px-3 py-2 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 transition text-sm"
                                onClick={() => setMonthMs((m) => startOfMonth(addDays(endOfMonth(m), 1)))}
                            >
                                다음
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 bg-zinc-50 text-xs text-zinc-600 border-b border-zinc-200">
                        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                            <div key={d} className="px-3 py-2 border-r border-zinc-200 last:border-r-0">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {calendarCells.map((cell) => {
                            const items = projectsByDay.get(cell.ymd) ?? [];
                            return (
                                <div
                                    key={cell.key}
                                    className={
                                        "min-h-[120px] border-r border-b border-zinc-200 last:border-r-0 p-2 " +
                                        (cell.inMonth ? "bg-white" : "bg-zinc-50") +
                                        (cell.isWeekend ? " " : "")
                                    }
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={
                                            "text-xs " +
                                            (cell.inMonth ? "text-zinc-700" : "text-zinc-400") +
                                            (cell.isWeekend ? " text-zinc-500" : "")
                                        }>
                                            {cell.day}
                                        </span>
                                    </div>

                                    <div className="mt-2 space-y-1">
                                        {items.slice(0, 3).map((p) => {
                                            const hue = hashToHue(p.id);
                                            return (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    className="w-full text-left truncate text-[11px] px-2 py-1 rounded border border-zinc-200 hover:bg-zinc-50 transition"
                                                    style={{ borderLeftColor: `hsl(${hue} 70% 45%)`, borderLeftWidth: 4 }}
                                                    onClick={() => navigate(`/Admin/Project/${p.id}`)}
                                                    title={p.name}
                                                >
                                                    {p.name}
                                                </button>
                                            );
                                        })}
                                        {items.length > 3 && (
                                            <div className="text-[11px] text-zinc-400 px-1">
                                                +{items.length - 3}개 더
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="border border-zinc-200 rounded overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-[280px_1fr] bg-zinc-50 border-b border-zinc-200">
                        <div className="px-3 py-2 text-xs text-zinc-600 border-r border-zinc-200">
                            공정 / 기간
                        </div>
                        <div className="overflow-x-auto">
                            <div className="flex" style={{ width: gridWidth }}>
                                {dayLabels.map((d) => (
                                    <div
                                        key={d.key}
                                        className={
                                            "shrink-0 w-[28px] px-1 py-2 text-[11px] text-center border-r border-zinc-200 " +
                                            (d.isWeekend ? "text-zinc-400" : "text-zinc-600")
                                        }
                                    >
                                        {d.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="grid grid-cols-[280px_1fr]">
                        <div className="divide-y divide-zinc-200">
                            {tasks.map((t) => (
                                <div key={t.id} className="px-3 py-3">
                                    <div className="space-y-2">
                                        <input
                                            value={t.name}
                                            disabled={!isAdmin}
                                            onChange={(e) => updateTask(t.id, { name: e.target.value })}
                                            className={
                                                "w-full bg-transparent outline-none text-sm " +
                                                (isAdmin ? "text-zinc-700" : "text-zinc-400")
                                            }
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="date"
                                                value={t.start}
                                                disabled={!isAdmin}
                                                onChange={(e) => {
                                                    const next = normalizeStartEnd(e.target.value, t.end);
                                                    updateTask(t.id, next);
                                                }}
                                                className={
                                                    "w-full px-2 py-1 rounded border border-zinc-200 bg-transparent text-xs outline-none " +
                                                    (isAdmin ? "text-zinc-700" : "text-zinc-400")
                                                }
                                            />
                                            <input
                                                type="date"
                                                value={t.end}
                                                disabled={!isAdmin}
                                                onChange={(e) => {
                                                    const next = normalizeStartEnd(t.start, e.target.value);
                                                    updateTask(t.id, next);
                                                }}
                                                className={
                                                    "w-full px-2 py-1 rounded border border-zinc-200 bg-transparent text-xs outline-none " +
                                                    (isAdmin ? "text-zinc-700" : "text-zinc-400")
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="overflow-x-auto" ref={timelineRef}>
                            <div className="relative" style={{ width: gridWidth }}>
                                {/* vertical grid */}
                                <div className="absolute inset-0 flex pointer-events-none">
                                    {dayLabels.map((d) => (
                                        <div
                                            key={d.key}
                                            className={
                                                "shrink-0 w-[28px] border-r border-zinc-200 " +
                                                (d.isWeekend ? "bg-zinc-50/50" : "")
                                            }
                                        />
                                    ))}
                                </div>

                                <div className="relative divide-y divide-zinc-200">
                                    {tasks.map((t) => {
                                        const s = parseYmd(t.start);
                                        const e = parseYmd(t.end);
                                        const valid = Number.isFinite(s) && Number.isFinite(e);
                                        const startIndex = valid ? diffDays(s, range.startMs) : 0;
                                        const duration = valid ? Math.max(0, diffDays(e, s)) : 0;
                                        const left = startIndex * dayWidth;
                                        const width = (duration + 1) * dayWidth;

                                        return (
                                            <div key={t.id} className="h-[72px] relative">
                                                {valid && (
                                                    <div
                                                        role={isAdmin ? "button" : undefined}
                                                        tabIndex={isAdmin ? 0 : -1}
                                                        className={
                                                            "absolute top-1/2 -translate-y-1/2 h-6 rounded " +
                                                            (isAdmin ? "cursor-grab active:cursor-grabbing" : "cursor-default") +
                                                            " bg-zinc-800/90"
                                                        }
                                                        style={{ left, width }}
                                                        onPointerDown={(e) => onBarPointerDown(e, t)}
                                                        onPointerMove={onBarPointerMove}
                                                        onPointerUp={onBarPointerUp}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

