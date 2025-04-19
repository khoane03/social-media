import axiosInstance from "./AxiosService";

const getListChat = async () =>{
    return await axiosInstance.get('/chat/list-chat');
}

const getChat = async (id: string) => {
    return await axiosInstance.get(`/chat/${id}`);
}

const deleteMessage = async (data: object) => {
    return await axiosInstance.delete('/chat', { data });
}

export default {
    getListChat,
    getChat,
    deleteMessage
};