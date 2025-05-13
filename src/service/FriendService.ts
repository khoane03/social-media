import axios from './AxiosService';


const getAllFriends = async (id: string) => {
    return await axios.get(`/friend/${id}`);
};

const addFriend = async (formData: FormData) => {
    return await axios.post('/friend/send-request', formData);
}

const acceptFriend = async (formData: FormData) => {
    return await axios.post('/friend/accept-request', formData);
}

const unFriend = async (formData: FormData) => {
    return await axios.post('/friend/unfriend', formData);
}

const blockFriend = async (formData: FormData) => {
    return await axios.post('/friend/block', formData);
}

const getAllFriendBlock = async (id: string) => {
    return await axios.get(`/friend/block/${id}`);
}

const getFriendRequest = async (id: string) => {
    return await axios.get(`/friend/pending/${id}`);
}

const getFriendSuggestion = async (id:string) => {
    return await axios.get(`/friend/suggest/${id}`);
}

const checkFriend = async (formData: FormData) => {
    return await axios.post('/friend/check-status', formData);
}


export default {
    getAllFriends,
    addFriend,
    acceptFriend,
    unFriend,
    blockFriend,
    getFriendRequest,
    getFriendSuggestion,
    getAllFriendBlock,
    checkFriend,
};

