import AxiosService from './AxiosService';

const getAllUsers = async (pageIndex: string, pageSize: string) => {
    return await AxiosService.get(`/user/all?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}

const getInfo = async () => {
    return await AxiosService.get('/user');
}

const getInfoById = async (id: String) => {
    return await AxiosService.get(`/user/${id}`);
}

const updateInfo = async (data: object) => {
    return await AxiosService.put(`/user-info`, data);
};

const updateUser = async (formData: FormData) => {
    return await AxiosService.put(`/user`, formData);
}

const updateImage = async (formData: FormData) => {
    return await AxiosService.put('/user/updateImage', formData);
}

const getUserOnline = async () => {
    return await AxiosService.get('/user/online');
}

const changeStatus = async (id: string) => {
    return await AxiosService.put(`/user/status/${id}`);
}

const verifyUser = async (id: string) => {
    return await AxiosService.put(`/user/verification/${id}`);
}

const deleteUser = async (id: string) => {
    return await AxiosService.delete(`/user/${id}`);
}

const searchUser = async (keyword: string) => {
    return await AxiosService.get('/user/search?keyword=' + keyword);
}

const countUserByStatus = async (status: string) => {
    return await AxiosService.get(`/user/count?status=${status}`);
}


export default {
    getAllUsers,
    getInfo,
    getInfoById,
    updateUser,
    updateInfo,
    updateImage,
    getUserOnline,
    changeStatus,
    verifyUser,
    deleteUser,
    searchUser,
    countUserByStatus
};

