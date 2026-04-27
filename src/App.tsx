// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { useSetAtom } from "jotai";
import { userAtom } from "./store/auth";
import Layout from "./components/layout/Layout";
import HomePage from "./features/home/HomePage";
import ContactPage from "./features/contact/ContactPage";
import LoginPage from "./features/Login/LoginPage.tsx";
import MediaPage from "./features/media/MediaPage";
import FurniturePage from "./features/works/pages/FurniturePage";
import PublicProjectPage from "./features/projects/public/PublicProjectPage.tsx";
import PublicProjectDetailPage from "./features/projects/public/PublicProjectDetailPage.tsx";
import MyProjectPage from "./features/projects/user/MyProjectPage.tsx";
import AdminProjectListPage from "./features/admin/projects/AdminProjectListPage.tsx";
import AdminProjectDetailPage from "./features/admin/projects/AdminProjectDetailPage.tsx";
import AdminProjectCreatePage from "./features/admin/projects/AdminProjectCreatePage.tsx";
import AboutPage from "./features/about/AboutPage.tsx";
import AdminHomeImagesPage from "./features/admin/home/AdminHomeImagesPage.tsx";
import AdminRoute from "./routes/AdminRoute.tsx";
import {useEffect} from "react";
import {getMe, getToken, logout} from "./api/auth.api.ts";



function App() {
    const setUser = useSetAtom(userAtom);

    useEffect(() => {
        const token = getToken();

        if (!token) return;

        getMe()
            .then((me) => {
                setUser({ role: me.role });
            })
            .catch(() => {
                logout();
                setUser({ role: null });
            });
    }, [setUser]);

    return (
        <Routes>
            {/* Layout (스크롤 있음) */}
            <Route element={<Layout />}>
            {/* 메인 */}

                <Route path="/Media" element={<MediaPage />} />

                {/* Works - Furniture (리스트) */}
                <Route path="/Works/Furniture" element={<FurniturePage />} />
                {/* Works - Interior (리스트) */}
                <Route path="/Works/Interior" element={<PublicProjectPage />} />
            </Route>


            {/* Layout (스크롤 없음) */}
            <Route element={<Layout isScrollable={false} />}>
                <Route path="/" element={<HomePage />} />

                {/* Works - Furniture (디테일) */}
                <Route path="/Works/Interior/:projectCode" element={<PublicProjectDetailPage />} />
                {/* Works - Interior (디테일) */}
                <Route path="/Works/Furniture/:furnitureId" element={<FurniturePage />} />

                <Route path="/Contact" element={<ContactPage />} />

                <Route path="/About" element={<AboutPage />} />
                {/* Login */}
                <Route path="/Login" element={<LoginPage />} />
                {/* Projects */}
                <Route path="/MyProject" element={<MyProjectPage />} />
            </Route>

            {/* Admin */}    {/* Layout (스크롤 있음) */}
            <Route element={<Layout />}>
                <Route path="/Admin" element={<AdminRoute />}>
                    <Route path="HomeImage" element={<AdminHomeImagesPage />} />
                    <Route path="ProjectList" element={<AdminProjectListPage />} />
                    <Route path="ProjectCreate" element={<AdminProjectCreatePage />} />
                    <Route path="Project/:projectId" element={<AdminProjectDetailPage />}/>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
