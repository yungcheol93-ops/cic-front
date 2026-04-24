// src/components/layout/LeftSidebar.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthState, subscribeAuthChanged, logout, type AuthState } from "../../api/auth.api.ts";
import footerLogo from "../../../public/images/footer/footer.png";

type LeftSidebarProps = {
    isHome: boolean;
    onClose?: () => void;
};

type SubMenu = {
    label: string;
    path: string;
};

type Menu = {
    key: "Works" | "News" | "Contact" | "About" | "Admin" | "Login" | "MyProject" | "Logout";
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
        { key: "News", label: "News", path: "/News" },
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
                    { label: "홈이미지", path: "/Admin/HomeImage" },
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

    export default function LeftSidebar({ isHome, onClose }: LeftSidebarProps) {
        const [auth, setAuth] = useState<AuthState | null>(null);
        const menus = useMemo(() => buildMenus(auth), [auth]);
        const [hovered, setHovered] = useState<string | null>(null);

        const navigate = useNavigate();
        const location = useLocation();

        const routeMainKey = useMemo(() => {
            const path = location.pathname;
            if (path.startsWith("/Works")) return "Works";
            if (path.startsWith("/News")) return "News";
            if (path.startsWith("/Contact")) return "Contact";
            if (path.startsWith("/About")) return "About";
            if (path.startsWith("/Admin")) return "Admin";
            if (path.startsWith("/Login")) return "Login";
            if (path.startsWith("/MyProject")) return "MyProject";
            return null;
        }, [location.pathname]);

        const currentMenuKey = hovered ?? routeMainKey;
        const activeMenu = menus.find((m) => m.key === currentMenuKey);

        useEffect(() => {
            setAuth(getAuthState());
            return subscribeAuthChanged(() => setAuth(getAuthState()));
        }, []);

        const handleNavigate = (path: string) => {
            navigate(path);
            if (onClose) onClose();
        };

        return (
            <div className="flex flex-col justify-between h-full select-none">
                <div className="pt-6">
                    {/* 로고: 해상도별 폰트 크기 최적화 */}
                    <div className="mb-6 lg:mb-8">
                        <p
                            className="font-cic tracking-tight text-lg lg:text-xl text-black cursor-pointer leading-none"
                            onClick={() => handleNavigate("/")}
                        >
                            CIC Studio
                        </p>
                    </div>

                    <div
                        className="flex pt-2"
                        onMouseLeave={() => setHovered(null)}
                    >
                        {/* 메인 메뉴: 고정 너비를 주어 서브메뉴 위치가 변하지 않게 함 */}
                        <nav className="space-y-1 lg:space-y-2 min-w-[90px] lg:min-w-[100px]">
                            {menus.map((menu) => {
                                const isActive = currentMenuKey === menu.key;
                                // 색상 대비를 명확히 하여 시인성 확보
                                const baseColor = isHome ? "text-black" : "text-zinc-400";
                                const activeColor = isHome ? "text-zinc-400" : "text-zinc-900";

                                return (
                                    <button
                                        key={menu.key}
                                        onMouseEnter={() => setHovered(menu.key)}
                                        onClick={() => {
                                            if (menu.key === "Logout") {
                                                logout();
                                                handleNavigate("/Login");
                                                return;
                                            }
                                            if (menu.path) handleNavigate(menu.path);
                                        }}
                                        className={
                                            "font-cic font-light tracking-wide block text-left text-sm lg:text-md transition-all duration-300 " +
                                            (isActive ? activeColor : `${baseColor} hover:text-zinc-600`)
                                        }
                                    >
                                        {menu.label}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* 서브 메뉴: 메인 메뉴 옆에 배치 */}
                        <div
                            className="min-w-[100px] lg:min-w-[140px]"
                            onMouseEnter={() => !hovered && routeMainKey && setHovered(routeMainKey)}
                        >
                            {activeMenu?.sub && (
                                <ul className="space-y-1">
                                    {activeMenu.sub.map((item) => {
                                        const isActive = location.pathname === item.path;
                                        return (
                                            <li
                                                key={item.path}
                                                className={
                                                    "cursor-pointer transition-colors text-xs lg:text-base " +
                                                    (isActive ? "text-zinc-900 font-medium" : "text-zinc-400 hover:text-zinc-800")
                                                }
                                                onClick={() => handleNavigate(item.path)}
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

                <div className="flex justify-end lg:justify-start">
                    <img
                        src={footerLogo}
                        className="w-[60px] h-auto lg:w-[80px] object-contain transition-all cursor-pointer"
                        onClick={() => handleNavigate("/")}
                        alt="Footer Logo"
                    />
                </div>
            </div>
        );
    }