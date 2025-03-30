import axios from './AxiosService';


const getAllFriends = async () => {
    return await axios.get('/friend');
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

const getAllFriendBlock = async () => {
    return await axios.get('/friend/block');
}

const getFriendRequest = async () => {
    return await axios.get('/friend/pending');
}

const getFriendSuggestion = async () => {
    return await axios.get('/friend/suggest');
}


export default {
    getAllFriends,
    addFriend,
    acceptFriend,
    unFriend,
    blockFriend,
    getFriendRequest,
    getFriendSuggestion,
    getAllFriendBlock
};

