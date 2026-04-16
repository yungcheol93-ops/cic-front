// src/components/layout/LeftSidebar.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthState, subscribeAuthChanged, logout, type AuthState } from "../../api/auth.api.ts";
import footerLogo from "../../../public/images/footer/footer.png";

type LeftSidebarProps = {
    isHome: boolean;
};

type SubMenu = {
    label: string;
    path: string;
};

type Menu = {
    key: "Works" | "Studio" | "Contact" | "About" | "Admin" | "Login" | "MyProject" | "Logout";
    label: string;
    sub?: SubMenu[];
    path?: string;
};

function buildMenus(auth: AuthState | null): Menu[] {
    const base: Menu[] = [
        {
            key: "Works",
            label: "Works",
            sub: [
                { label: "Interior", path: "/Works/Interior" },
                { label: "Furniture", path: "/Works/Furniture" },
            ],
        },
        {
            key: "Studio",
            label: "Studio",
            sub: [
                { label: "News", path: "/Studio/News" },
                { label: "Contract", path: "/Studio/Contract" },
            ],
        },
        { key: "Contact", label: "Contact", path: "/Contact" },
        { key: "About", label: "About", path: "/About" },
    ];

    if (!auth) {
        return [...base, { key: "Login", label: "Login", path: "/Login" }];
    }

    if (auth.role === "admin") {
        return [
            ...base,
            {
                key: "Admin",
                label: "관리자페이지",
                sub: [
                    { label: "프로젝트리스트", path: "/Admin/ProjectList" },
                    { label: "일정표", path: "/Admin/Schedule" },
                ],
            },
            { key: "Logout", label: "로그아웃", path: "/Login" },
        ];
    }

    return [
        ...base,
        { key: "MyProject", label: "내프로젝트", path: "/MyProject" },
        { key: "Logout", label: "로그아웃", path: "/Login" },
    ];
}

export default function LeftSidebar({ isHome }: LeftSidebarProps) {
    const [auth, setAuth] = useState<AuthState | null>(null);
    const menus = useMemo(() => buildMenus(auth), [auth]);

    const [hovered, setHovered] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    //  현재 라우트 기준
    const routeMainKey = useMemo(() => {
        if (location.pathname.startsWith("/Works")) return "Works";
        if (location.pathname.startsWith("/Studio")) return "Studio";
        if (location.pathname.startsWith("/Contact")) return "Contact";
        if (location.pathname.startsWith("/About")) return "About";
        if (location.pathname.startsWith("/Admin")) return "Admin";
        if (location.pathname.startsWith("/Login")) return "Login";
        if (location.pathname.startsWith("/MyProject")) return "MyProject";
        return null;
    }, [location.pathname]);

    // ✅ hover 우선, 없으면 route
    const currentMenuKey = hovered ?? routeMainKey;
    const activeMenu = menus.find((m) => m.key === currentMenuKey);

    useEffect(() => {
        setAuth(getAuthState());
        return subscribeAuthChanged(() => {
            setAuth(getAuthState());
        });
    }, []);

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="pt-16">
                {/* 로고 */}
                <div className="mb-10">
                    <p
                        className="font-cic tracking-wide text-2xl text-black cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        CIC Studio
                    </p>
                </div>

                <div
                    className="flex pt-4 gap-5"
                    onMouseLeave={() => setHovered(null)}
                >
                    {/* 메인 메뉴 */}
                    <nav className="space-y-3">
                        {menus.map((menu) => {
                            const isActive = currentMenuKey === menu.key;

                            const baseColor = isHome ? "text-white" : "text-zinc-400";
                            const activeColor = isHome ? "text-zinc-500" : "text-zinc-700";

                            return (
                                <button
                                    key={menu.key}
                                    onMouseEnter={() => setHovered(menu.key)}
                                    onClick={() => {
                                        if (menu.key === "Logout") {
                                            logout();
                                            navigate(menu.path ?? "/Login", { replace: true });
                                            return;
                                        }
                                        if (menu.path) navigate(menu.path);
                                    }}
                                    className={
                                        "font-cic font-light tracking-wide block text-left text-l uppercase transition " +
                                        (isActive
                                            ? activeColor
                                            : baseColor + " hover:text-zinc-500")
                                    }
                                >
                                    {menu.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* 서브 메뉴 */}
                    <div
                        className="min-w-[120px]"
                        onMouseEnter={() => {
                            if (!hovered && routeMainKey) {
                                setHovered(routeMainKey);
                            }
                        }}
                    >
                        {activeMenu?.sub && (
                            <ul className="space-y-1 text-md">
                                {activeMenu.sub.map((item) => {
                                    const isActive = location.pathname === item.path;

                                    return (
                                        <li
                                            key={item.path}
                                            className={
                                                "cursor-pointer transition " +
                                                (isActive
                                                    ? "text-zinc-700"
                                                    : "text-zinc-400 hover:text-zinc-700")
                                            }
                                            onClick={() => navigate(item.path)}
                                        >
                                            {item.label}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* 하단 이미지 */}
            <div>
                <img
                    src={footerLogo}
                    className="w-[150px] h-[200px] object-contain"
                    alt="푸터이미지"
                />
            </div>
        </div>
    );
}