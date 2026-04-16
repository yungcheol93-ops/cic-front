import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthState, login, logout, type AuthState } from "./auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const [auth, setAuth] = useState<AuthState | null>(null);
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAuth(getAuthState());
    }, []);

    //  로그인 (핵심🔥)
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!code) {
            setError("코드를 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const next = await login(code);
            setAuth(next);
            setCode("");

            navigate("/", { replace: true });

        } catch (err: any) {
            setError(err.message || "로그인 실패");
        } finally {
            setLoading(false);
        }
    }

    // ✅ 로그아웃
    function handleLogout() {
        logout();
        setAuth(null);
        setCode("");
        setError(null);
    }

    return (
        <div className="h-full min-h-screen px-16 py-16">
            <h1 className="text-3xl font-cic font-light mb-10 uppercase">
                Studio Login
            </h1>

            {auth ? (
                <div className="space-y-6 max-w-md">
                    <div className="space-y-1 text-zinc-500">
                        <p className="text-lg text-zinc-700">
                            {auth.role === "admin" ? "관리자" : "고객"} 로그인
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 rounded border border-zinc-300"
                            onClick={() => navigate("/", { replace: true })}
                        >
                            홈으로 이동
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 rounded border border-zinc-300"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                    <div className="space-y-2">
                        <label className="block text-sm text-zinc-500">
                            로그인 코드
                        </label>
                        <input
                            value={code}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setCode(value);
                            }}
                            inputMode="numeric"
                            maxLength={8}
                            className="w-full px-3 py-2 border border-zinc-300 text-zinc-900 bg-white"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-zinc-800 text-white"
                    >
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            )}
        </div>
    );
}