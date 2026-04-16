import axios from "axios";

const API = import.meta.env.VITE_API_URL + "/api";

// 관리자
export const getAdminProjectList0 = () =>
    axios.get(`${API}/admin/project`);

export const getAdminProject = (projectId:number) =>
    axios.get(`${API}/admin/project/${projectId}`);

export const patchAdminProject  = (projectId: number, data: any) =>
    axios.patch(`${API}/admin/project/${projectId}`, data);

export const deleteAdminProject = (projectId: number) =>
    axios.patch(`${API}/admin/project/${projectId}/delete`);

export const restoreProject = (projectId: number) =>
    axios.patch(`${API}/admin/project/${projectId}/restore`);

export const getDeletedProjects = () =>
    axios.get(`${API}/admin/project/trash`);

export const togglePublic = (projectId: number, isPublic: boolean) =>
    axios.patch(`${API}/admin/project/${projectId}/public?isPublic=${isPublic}`);

// 사용자
export const getUserProjectList = () =>
    axios.get(`${API}/user/project`);

export const getUserProject = (projectId: number) =>
    axios.get(`${API}/user/project/${projectId}`);

// 공개
export const getPublicProjectList = () =>
    axios.get(`${API}/public/project`);

export const getPublicProject = (projectId:number) =>
    axios.get(`${API}/public/project/${projectId}`);


