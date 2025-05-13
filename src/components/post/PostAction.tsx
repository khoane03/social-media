import { useState, useEffect, useCallback, useMemo, JSX } from "react";
import {
    ThumbUpOffAlt,
    FavoriteBorder,
    SentimentSatisfiedAlt,
    SentimentDissatisfied
} from "@mui/icons-material";
import { Comments } from "./Comment";
import CommentService from "../../service/CommentService";
import ReactionService from "../../service/ReactionService";
import { useUserContext } from "../../context/UserContext";
import ModalReaction from "./ModalReaction";
import ReactionList from "./ReactionList";

interface PostActionsProps {
    postId: string;
}

// Định nghĩa type cho reaction types
type ReactionType = "LIKE" | "LOVE" | "HAHA" | "ANGRY";

const reactionMap = {
    LIKE: { label: "Thích", icon: <ThumbUpOffAlt className="text-blue-500" /> },
    LOVE: { label: "Yêu thích", icon: <FavoriteBorder className="text-pink-500" /> },
    HAHA: { label: "Vui vẻ", icon: <SentimentSatisfiedAlt className="text-orange-500" /> },
    ANGRY: { label: "Buồn", icon: <SentimentDissatisfied className="text-red-500" /> },
} as const;

export const PostActions: React.FC<PostActionsProps> = ({ postId }) => {
    const { user } = useUserContext();
    const [totalCmt, setTotalCmt] = useState(0);
    const [totalLike, setTotalLike] = useState(0);
    const [currentReaction, setCurrentReaction] = useState<{ label: string; icon: JSX.Element } | null>(reactionMap.LIKE);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReactionListOpen, setIsReactionListOpen] = useState(false);
    const [reactionData, setReactionData] = useState<any[]>([]);

    // Memoize reaction summary for display
    const reactionSummary = useMemo(() => {
        const types = reactionData.map(r => r.type);
        return Object.entries(reactionMap).filter(([type]) => types.includes(type));
    }, [reactionData]);

    // Fetch comments
    const fetchComments = useCallback(async () => {
        try {
            const resp = await CommentService.getAllComments(postId);
            setTotalCmt(resp.data.length);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }, [postId]);

    // Fetch reactions
    const fetchReactions = useCallback(async () => {
        try {
            const resp = await ReactionService.getReactions(postId);
            const reactions = resp.data.reactions || [];
            setReactionData(reactions);
            setTotalLike(resp.data.totalReactions || 0);

            const userReaction = reactions.find((r: any) => r.userId === user?.id)?.type as ReactionType | undefined;
            setCurrentReaction(userReaction ? reactionMap[userReaction] : null);
        } catch (error) {
            console.error("Error fetching reactions:", error);
        }
    }, [postId, user?.id]);

    // Handle reaction with optimistic update
    const handleReaction = useCallback(async (reactionType: ReactionType) => {
        const prevReaction = currentReaction;
        setCurrentReaction(reactionMap[reactionType]); // Optimistic update

        try {
            await ReactionService.makeOrRejectReaction(reactionType, postId);
            await fetchReactions();
        } catch (error) {
            console.error("Error handling reaction:", error);
            setCurrentReaction(prevReaction); // Rollback on error
        }
    }, [postId, currentReaction, fetchReactions]);

    // Handle body overflow
    useEffect(() => {
        document.body.style.overflow = isReactionListOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isReactionListOpen]);

    // Initial fetch
    useEffect(() => {
        fetchComments();
        fetchReactions();
    }, [fetchComments, fetchReactions]);

    return (
        <>
            {isReactionListOpen && (
                <ReactionList reactions={reactionData} onClose={() => setIsReactionListOpen(false)} />
            )}
            <div className="mx-4 border-b pb-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        {reactionSummary.length > 0 && (
                            <div className="flex -space-x-2">
                                {reactionSummary.map(([type, { icon }]) => (
                                    <div
                                        key={type}
                                        className="w-6 h-6 rounded-full border border-white bg-gray-100 flex items-center justify-center"
                                    >
                                        {icon}
                                    </div>
                                ))}
                            </div>
                        )}
                        {totalLike > 0 && (
                            <a
                                onClick={() => setIsReactionListOpen(true)}
                                className="text-black font-medium cursor-pointer hover:underline"
                            >
                                {totalLike}
                            </a>
                        )}
                    </div>
                    {totalCmt > 0 && (
                        <a className="text-gray-500 cursor-pointer">
                            {totalCmt} bình luận
                        </a>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-around mx-4 pt-3">
                <div
                    className="relative flex items-center px-3 py-1 rounded-lg hover:bg-gray-200 cursor-pointer gap-2"
                    onMouseEnter={() => setIsModalOpen(true)}
                    onMouseLeave={() => setIsModalOpen(false)}
                >
                    {currentReaction?.icon || <ThumbUpOffAlt className="text-gray-500" />}
                    <span className="text-gray-500 font-bold">
                        {currentReaction?.label || "Thích"}
                    </span>
                    {isModalOpen && (
                        <div className="absolute  left-1/2 -translate-x-1/2">
                            <ModalReaction handleReaction={handleReaction} />
                        </div>
                    )}
                </div>
                <div className="flex items-center px-3 py-1 rounded-lg hover:bg-gray-200 cursor-pointer">
                    <Comments postId={postId} />
                </div>
            </div>
        </>
    );
};