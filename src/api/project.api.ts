import api from './axiosInstance';

// 관리자 관련
export const getAdminProjectList = () => api.get('/admin/project');
export const getAdminProject = (projectId: number) => api.get(`/admin/project/${projectId}`);
export const patchAdminProject = (projectId: number, data: any) => api.patch(`/admin/project/${projectId}`, data);
export const deleteAdminProject = (projectId: number) => api.patch(`/admin/project/${projectId}/delete`);
export const restoreProject = (projectId: number) => api.patch(`/admin/project/${projectId}/restore`);
export const getDeletedProjects = () => api.get('/admin/project/trash');
export const togglePublic = (projectId: number, isPublic: boolean) =>
    api.patch(`/admin/project/${projectId}/public`, null, { params: { isPublic } });

// 사용자/공개 관련
export const getUserProjectList = () => api.get('/user/project');
export const getUserProject = (projectId: number) => api.get(`/user/project/${projectId}`);
export const getPublicProjectList = () => api.get('/public/project');
export const getPublicProject = (projectCode: string) => api.get(`/public/project/${projectCode}`);