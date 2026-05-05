import api from './axiosInstance';

// 관리자 관련
export const getAdminFurnitureList = () => api.get('/admin/furniture');
export const getAdminFurniture = (furnitureId: number) => api.get(`/admin/furniture/${furnitureId}`);
export const createAdminFurniture = (dto: any) => api.post(`/admin/furniture`, dto);
export const patchAdminFurniture = (furnitureId: number, dto: any) => api.patch(`/admin/furniture/${furnitureId}`, dto);
export const deleteAdminFurniture = (furnitureId: number) => api.patch(`/admin/furniture/${furnitureId}/delete`);
export const togglePublic = (furnitureId: number, isPublic: boolean) =>
    api.patch(`/admin/furniture/${furnitureId}/public`, null, { params: { isPublic } });
export const updateFurnitureOrder = (dto: { id: number; displayOrder: number }[]) => api.patch(`/admin/furniture/order`,dto);

// 사용자/공개 관련
export const getPublicFurnitureList = () => api.get('/public/furniture');
export const getPublicFurniture = (furnitureCode: string) => api.get(`/public/furniture/${furnitureCode}`);