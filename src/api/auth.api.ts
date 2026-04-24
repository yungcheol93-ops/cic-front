import {supabase} from "../utils/supabase.ts";
import api from "./axiosInstance.ts";

/**
 * 로컬스토리지 키
 */
const STORAGE_KEY = "cic.auth";

/**
 * 로그인 요청 (DB 기반)
 */
export async function login(username: string, password: string) {

    if (!username || !password) {
        throw new Error("이메일과 비밀번호를 입력해주세요.");
    }

    const email = `${username}@cicstudio.com`;


    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    const token = data.session?.access_token;

    if (!token) {
        throw new Error("토큰 없음");
    }
    console.log(localStorage.getItem("cic.token"));
    localStorage.setItem(STORAGE_KEY, token);

    return token;
}

/**
 * 토큰 가져오기
 */
export function getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
}

export async function getMe() {
    const res = await api.get("/auth/me");
    return res.data;
}

/**
 * 로그아웃
 */
export async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem(STORAGE_KEY);
}