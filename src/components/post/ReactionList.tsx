import { useState, useEffect, useCallback, useMemo } from "react";
import {
    ThumbUpOffAlt,
    FavoriteBorder,
    SentimentSatisfiedAlt,
    SentimentDissatisfied
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import FriendService from "../../service/FriendService";
import { useUserContext } from "../../context/UserContext";

interface User {
    userId: string;
    name: string;
    avatarUrl: string;
    type: string;
}

interface ReactionListProps {
    reactions: User[];
    onClose: () => void;
}

const reactionTabs = [
    { type: "ALL", label: "Tất cả", icon: null },
    { type: "LIKE", label: "Thích", icon: <ThumbUpOffAlt className="text-blue-500" /> },
    { type: "LOVE", label: "Yêu thích", icon: <FavoriteBorder className="text-pink-500" /> },
    { type: "HAHA", label: "Vui vẻ", icon: <SentimentSatisfiedAlt className="text-orange-500" /> },
    { type: "ANGRY", label: "Buồn", icon: <SentimentDissatisfied className="text-red-500" /> }
] as const;

const ReactionList: React.FC<ReactionListProps> = ({ reactions, onClose }) => {
    const { user } = useUserContext();
    const [selectedTab, setSelectedTab] = useState<"ALL" | "LIKE" | "LOVE" | "HAHA" | "ANGRY">("ALL");
    const [friendStatuses, setFriendStatuses] = useState<Record<string, string | undefined>>({});

    // Memoize filtered reactions
    const filteredReactions = useMemo(() => {
        return selectedTab === "ALL"
            ? reactions
            : reactions.filter(r => r.type === selectedTab);
    }, [reactions, selectedTab]);

    // Memoize visible tabs
    const visibleTabs = useMemo(() => {
        const reactionTypes = new Set(reactions.map(r => r.type));
        return reactionTabs.filter(tab => tab.type === "ALL" || reactionTypes.has(tab.type));
    }, [reactions]);

    // Fetch friend statuses with Promise.all
    const fetchFriendStatuses = useCallback(async () => {
        if (!reactions.length) return;

        try {
            const friendStatusPromises = reactions.map(async (r) => {
                const formData = new FormData();
                formData.append("friendId", r.userId);
                const response = await FriendService.checkFriend(formData);
                return { userId: r.userId, status: response.data || undefined };
            });

            const statuses = await Promise.all(friendStatusPromises);

            // Reduce array thành object để update state một lần
            const statusMap = statuses.reduce((acc, { userId, status }) => ({
                ...acc,
                [userId]: status
            }), {});

            setFriendStatuses(statusMap);
        } catch (error) {
            console.error("Error fetching friend statuses:", error);
        }
    }, [reactions]);

    useEffect(() => {
        fetchFriendStatuses();
    }, [fetchFriendStatuses]);

    // Memoize friend action handler
    const handleFriendAction = useCallback(async (userId: string, action: "add" | "cancel") => {
        try {
            const formData = new FormData();
            formData.append(action === "add" ? "receiverId" : "friendId", userId);

            await (action === "add"
                ? FriendService.addFriend(formData)
                : FriendService.unFriend(formData));
            setFriendStatuses(prev => ({
                ...prev,
                [userId]: action === "add" ? "REQUESTED" : undefined
            }));

        } catch (error) {
            console.error(`Error ${action === "add" ? "adding" : "canceling"} friend:`, error);
        }
    }, []);

    // Memoize friend button renderer
    const renderFriendButton = useCallback((reactionUser: User) => {
        if (user?.id === reactionUser.userId) return null;

        const status = friendStatuses[reactionUser.userId];
        const buttonStyles = "px-3 py-1 rounded-lg text-sm transition-colors duration-200";

        switch (status) {
            case "ACCEPTED":
                return <span className="text-gray-500 font-semibold text-sm">Bạn bè</span>;
            case "REQUESTED":
                return (
                    <button
                        onClick={() => handleFriendAction(reactionUser.userId, "cancel")}
                        className={`${buttonStyles} bg-gray-200 text-gray-700 hover:bg-gray-300`}
                    >
                        Hủy yêu cầu
                    </button>
                );
            case "BLOCKED":
                return null;
            default:
                return (
                    <button
                        onClick={() => handleFriendAction(reactionUser.userId, "add")}
                        className={`${buttonStyles} bg-blue-500 text-white hover:bg-blue-600`}
                    >
                        Gửi kết bạn
                    </button>
                );
        }
    }, [user?.id, friendStatuses, handleFriendAction]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-xl shadow-xl w-[546px] max-h-[80vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                        {visibleTabs.map(tab => (
                            <button
                                key={tab.type}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap
                                    ${selectedTab === tab.type
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}`}
                                onClick={() => setSelectedTab(tab.type)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                    <button
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors duration-200"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[60vh]">
                    {filteredReactions.length ? (
                        filteredReactions.map(reactionUser => (
                            <div
                                key={reactionUser.userId}
                                className="flex items-center justify-between py-2.5 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={reactionUser.avatarUrl || "default.png"}
                                        alt={reactionUser.name}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                        loading="lazy"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/profile/${reactionUser.userId}`}
                                            className="font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            {reactionUser.name}
                                        </Link>
                                        {reactionTabs.find(r => r.type === reactionUser.type)?.icon}
                                    </div>
                                </div>
                                {renderFriendButton(reactionUser)}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-4">
                            Không có phản ứng nào cho loại này.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReactionList;