import api from './axiosInstance';

export const getAbout = () => api.get('/about');

// 관리자 관련
export const postAdminAbout = (dto: any) => api.put(`/admin/about`, dto);
