// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./features/home/HomePage";
import ContactPage from "./features/studio/ContractPage";
import LoginPage from "./features/Login/LoginPage.tsx";
import NewsPage from "./features/studio/NewsPage";
import FurniturePage from "./features/works/pages/FurniturePage";
import PublicProjectPage from "./features/projects/public/PublicProjectPage.tsx";
import PublicProjectDetailPage from "./features/projects/public/PublicProjectDetailPage.tsx";
import MyProjectPage from "./features/projects/user/MyProjectPage.tsx";
import AdminProjectListPage from "./features/projects/admin/AdminProjectListPage.tsx";
import AdminSchedulePage from "./features/projects/AdminSchedulePage.tsx";
import AdminEstimateCreatePage from "./features/projects/admin/AdminEstimateCreatePage.tsx";
import AdminProjectDetailPage from "./features/projects/admin/AdminProjectDetailPage.tsx";
import AdminProjectCreatePage from "./features/projects/admin/AdminProjectCreatePage.tsx";
import AboutPage from "./features/about/AboutPage.tsx";


function App() {
    return (
        <Layout>
            <Routes>
                {/* 메인 */}
                <Route path="/" element={<HomePage />} />
                {/* Studio */}
                <Route path="/Studio/Contract" element={<ContactPage />} />
                <Route path="/Studio/News" element={<NewsPage />} />
                {/* Login */}
                <Route path="/Login" element={<LoginPage />} />
                {/* Projects */}
                <Route path="/MyProject" element={<MyProjectPage />} />
                {/* Admin */}
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
