import axios from "axios";

/**
 * 로그인 상태 타입
 */
export type AuthState = {
    userId: number;
    role: "admin" | "user";
};

/**
 * 로컬스토리지 키
 */
const STORAGE_KEY = "cic.auth";

/**
 * 로그인 이벤트 (옵션)
 */
const AUTH_CHANGED_EVENT = "cic-auth-changed";

/**
 * 로그인 요청 (DB 기반)
 */
export async function login(code: string): Promise<AuthState> {
    const trimmed = code.trim();

    if (!trimmed) {
        throw new Error("코드를 입력해주세요.");
    }

    try {
        const res = await axios.post(
            "REACT_APP_API_URL/api/auth/login",
            null,
            {
                params: { code: trimmed },
            }
        );

        const user = res.data;
        console.log("user:", user);
        console.log("role:", user.role);
        console.log("id:", user.id);
        if (!user) {
            throw new Error("로그인 실패");
        }

        const auth: AuthState = {
            userId: user.id,
            role: user.role,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
        emitAuthChanged();

        return auth;
    } catch (error) {
        console.error(error);
        throw new Error("로그인 코드가 올바르지 않습니다.");
    }
}

/**
 * 로그인 상태 조회
 */
export function getAuthState(): AuthState | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/**
 * 로그아웃
 */
export function logout() {
    localStorage.removeItem(STORAGE_KEY);
    emitAuthChanged();
}

/**
 * 로그인 상태 변경 이벤트 발생
 */
function emitAuthChanged() {
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

/**
 * 로그인 상태 변경 구독
 */
export function subscribeAuthChanged(handler: () => void) {
    window.addEventListener(AUTH_CHANGED_EVENT, handler);
    return () =>
        window.removeEventListener(AUTH_CHANGED_EVENT, handler);
}