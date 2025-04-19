import AxiosService from './AxiosService';

const getAllUsers = async () => {
    return await AxiosService.get('/user/all');
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



export default {
    getAllUsers,
    getInfo,
    getInfoById,
    updateUser,
    updateInfo,
    updateImage,
    getUserOnline
};

