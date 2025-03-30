import axiosInstance from "./AxiosService";

const getAllComments = async (id: String) => {
    return await axiosInstance.get(`/comment/${id}`);
}

const createComment = async (data: object) => {
    return await axiosInstance.post('/comment', data);
}

const deleteComment = async (id: String) => {
    return await axiosInstance.delete(`/comment/${id}`);
}

export default {
    getAllComments,
    createComment,
    deleteComment
};