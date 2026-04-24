import { useEffect, useState } from "react";
import {Navigate, Outlet} from "react-router-dom";
import { getMe, getToken } from "../api/auth.api";

export default function AdminRoute() {
    const [auth, setAuth] = useState<null | { role: string }>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMe() {
            try {
                const token = getToken();
                if (!token) {
                    setAuth(null);
                    return;
                }

                const me = await getMe();
                console.log("me:", me);
                setAuth(me);
            } catch {
                setAuth(null);
            } finally {
                setLoading(false);
            }
        }

        fetchMe();
    }, []);

    if (loading) return <div>Loading...</div>;

    // 로그인 안 했거나 admin 아니면 차단
    if (!auth || auth.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}