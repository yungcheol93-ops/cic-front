// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
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
import AdminSchedulePage from "./features/projects/AdminSchedulePage.tsx";
import AdminEstimateCreatePage from "./features/admin/schedule/AdminEstimateCreatePage.tsx";
import AdminProjectDetailPage from "./features/admin/projects/AdminProjectDetailPage.tsx";
import AdminProjectCreatePage from "./features/admin/projects/AdminProjectCreatePage.tsx";
import AboutPage from "./features/about/AboutPage.tsx";
import AdminHomeImagesPage from "./features/admin/home/AdminHomeImagesPage.tsx";



function App() {
    return (
        <Layout>
            <Routes>
                {/* 메인 */}
                <Route path="/" element={<HomePage />} />
                {/* Studio */}
                <Route path="/Studio/Contract" element={<ContactPage />} />
                <Route path="/Media" element={<MediaPage />} />
                {/* Login */}
                <Route path="/Login" element={<LoginPage />} />
                {/* Projects */}
                <Route path="/MyProject" element={<MyProjectPage />} />
                {/* Admin */}
                <Route path="/Admin/HomeImage" element={<AdminHomeImagesPage />} />
                <Route path="/Admin/ProjectList" element={<AdminProjectListPage />} />
                <Route path="/Admin/Schedule" element={<AdminSchedulePage />} />
                <Route path="/Admin/ProjectCreate" element={<AdminProjectCreatePage />} />
                <Route path="/Admin/EstimateCreate" element={<AdminEstimateCreatePage />} />
                <Route path="/Admin/Project/:projectId" element={<AdminProjectDetailPage />} />
                {/* Backward compatibility */}
                <Route path="/ProjectList" element={<Navigate to="/Admin/ProjectList" replace />} />

                {/* Works - Furniture (리스트 + 디테일) */}
                <Route path="/Works/Furniture" element={<FurniturePage />} />
                <Route path="/Works/Furniture/:furnitureId" element={<FurniturePage />} />
                {/* Works - Interior (리스트 + 디테일) */}
                <Route path="/Works/Interior" element={<PublicProjectPage />} />
                <Route path="/Works/Interior/:projectId" element={<PublicProjectDetailPage />} />

                <Route path="/Contact" element={<ContactPage />} />

                <Route path="/About" element={<AboutPage />} />
            </Routes>
        </Layout>
    );
}

export default App;
