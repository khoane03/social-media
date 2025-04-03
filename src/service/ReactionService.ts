import AxiosService from './AxiosService';

const makeOrRejectReaction = async (reactionType: string, postId: string) => {
  return await AxiosService.post('/reactions', {
    reactionType,
    postId,
  });
}

const getReactions = async (postId: string) => {
  return await AxiosService.get(`/reactions/${postId}`);
}

export default {
  makeOrRejectReaction,
  getReactions,
};