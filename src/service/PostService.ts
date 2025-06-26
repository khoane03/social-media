import axiosInstance from "./AxiosService";

const addPost = async (formData: FormData) => {
    return await axiosInstance.post('/posts', formData);
}

const getAllPosts = async () => {
    return await axiosInstance.get('/posts');
}

const getFriendPosts = async () => {
    return await axiosInstance.get('/posts/friend-posts');
}

const getPostById = async (id: String) => {
    return await axiosInstance.get(`/posts/${id}`);
}

const getPostByUserId = async (userId: String) => {
    return await axiosInstance.get(`/posts/user-posts/${userId}`);
}

const deletePostById = async (postId: string) => {
    return await axiosInstance.delete(`/posts/${postId}`);
}

const totalPosts = async () => {
    return await axiosInstance.get('/posts/count');
}

export default {
    addPost,
    getAllPosts,
    deletePostById,
    getPostById,
    getPostByUserId,
    getFriendPosts,
    totalPosts
};