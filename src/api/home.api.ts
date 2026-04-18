import api from './axiosInstance';

// 관리자 관련
export const getHomeImageList = () => api.get('/admin/home');
export const postHomeImages = (dto: any) => api.post(`/admin/home`, dto);
export const deleteHomeImage = (id: number) => api.delete(`/admin/home/${id}`);
