import axiosInstance from './AxiosService';

const sendNotification = async (data: object) => {
    return await axiosInstance.post('/notification', data);
}

const getNotification = async (id: string) => {
    return await axiosInstance.get(`/notification/${id}`);
}

const deleteNotification = async (id: string) => {
    return await axiosInstance.delete(`/notification/${id}`);
}

const maskAsRead = async (id: string) => {
    return await axiosInstance.post(`/notification/mark-as-read?notificationId=${id}`);
}

export default {
    sendNotification,
    getNotification,
    deleteNotification,
    maskAsRead
}