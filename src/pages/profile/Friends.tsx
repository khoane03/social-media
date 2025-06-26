import { useEffect, useState } from "react";
import FriendService from "../../service/FriendService";
import { Link, useParams } from "react-router-dom";
import { Block, CheckCircle, MoreHoriz, PersonRemove } from "@mui/icons-material";
import Alert from "../../components/alert/Alert";

const friends = () => {
    const [friends, setFriends] = useState<any[]>([]);
    const [clickedFriendId, setClickedFriendId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { userId } = useParams();

    const handleClicked = (friendId: string) => {
        setClickedFriendId(clickedFriendId === friendId ? null : friendId);
    };

    const getAllFriends = async () => {
        try {
            setLoading(true);
            const response = await FriendService.getAllFriends(userId || '');
            setFriends(response.data);
        } catch (error) {
            setError("Failed to fetch friends");
        } finally {
            setLoading(false);
        }
    };

    const unFriend = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            await FriendService.unFriend(formData);
            setSuccess("Huỷ kết bạn thành công!");
            setFriends(prev => prev.filter(friend => friend.friendId !== friendId));
            getAllFriends();
        } catch (error) {
            setError("Error unfriending user");
        }
    };

    const blockFriend = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            await FriendService.blockFriend(formData);
            setSuccess("Chặn bạn bè thành công!");
            setFriends(prev => prev.filter(friend => friend.friendId !== friendId));
            getAllFriends();
        } catch (error) {
            setError("Error blocking user");
        }
    };

    useEffect(() => {
        document.title = "Bạn bè";
        getAllFriends();
    }, []);


    const Loading = () => {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
                <div className="flex items-center justify-start p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 relative">
                    <div className="w-12 h-12 rounded-full border border-gray-300 mr-2"></div>
                    <div className="bg-gray-200 w-24 h-4 rounded"></div>
                </div>
                <div className="flex items-center justify-start p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 relative">
                    <div className="w-12 h-12 rounded-full border border-gray-300 mr-2"></div>
                    <div className="bg-gray-200 w-24 h-4 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-300 pb-4">Bạn bè</h2>
                {friends.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {loading ? <Loading /> :
                        <>
                            {friends.map((friend) => (
                                <div key={friend.friendId}
                                    className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 relative">
                                    <img
                                        src={friend.avatarUrl || 'default.png'}
                                        alt="Avatar"
                                        className="w-12 h-12 rounded-full border border-gray-300 flex-shrink-0"
                                    />
                                    <div className="ml-4 flex-1 min-w-0">
                                        <div className="flex items-center">
                                            <Link
                                                to={`/profile/${friend.friendId}`}
                                                className="font-semibold text-gray-800 hover:underline truncate"
                                            >
                                                {friend.name}
                                            </Link>
                                            {friend.verified && <CheckCircle className="text-blue-500 ml-1 w-4 h-4 flex-shrink-0" />}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <button
                                            className="text-gray-600 hover:bg-gray-200 p-1.5 rounded-full transition-colors duration-200"
                                            onClick={() => handleClicked(friend.friendId)}
                                        >
                                            <MoreHoriz className="w-5 h-5" />
                                        </button>
                                        {clickedFriendId === friend.friendId && (
                                            <div className="absolute translate-y-2/3 top-0 right-0 w-48 bg-white shadow-xl rounded-lg p-3 z-50 border border-gray-200 animate-move">
                                                <button
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                                    onClick={() => unFriend(friend.friendId)}
                                                >
                                                    <PersonRemove className="w-5 h-5" />
                                                    <span className="text-sm font-medium">Hủy kết bạn</span>
                                                </button>
                                                <button
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                                                    onClick={() => blockFriend(friend.friendId)}
                                                >
                                                    <Block className="w-5 h-5" />
                                                    <span className="text-sm font-medium">Chặn</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </>}
                </div> :
                    <p className="text-gray-500 text-center">Chưa có bạn bè nào.</p>}
            </div>
        </>
    );
};

export default friends;