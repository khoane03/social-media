import { useEffect, useState } from "react";
import FriendService from "../../../service/FriendService"; // Đường dẫn đúng
import { Block, CheckCircle, MoreHoriz, PersonRemove } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Friend = () => {
    const [friends, setFriends] = useState<any[]>([]);
    const [friendReq, setFriendReq] = useState<any[]>([]);
    const [friendSug, setFriendSug] = useState<any[]>([]);
    const [friendBlock, setFriendBlock] = useState<any[]>([]);
    const [sentRequest, setSentRequest] = useState<string[]>([]);
    const [clickedFriendId, setClickedFriendId] = useState<string | null>(null); // Chỉ mở menu cho friend được click

    const handleClicked = (friendId: string) => {
        setClickedFriendId(clickedFriendId === friendId ? null : friendId); // Toggle menu
    };

    const getAllFriends = async () => {
        try {
            const response = await FriendService.getAllFriends();
            setFriends(response.data);
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    };

    const getAllFriendSuggestion = async () => {
        try {
            const response = await FriendService.getFriendSuggestion();
            setFriendSug(response.data);
        } catch (error) {
            console.error("Error fetching friend suggestions:", error);
        }
    };

    const getAllFriendBlock = async () => {
        try {
            const response = await FriendService.getAllFriendBlock();
            setFriendBlock(response.data);
        } catch (error) {
            console.error("Error fetching blocked friends:", error);
        }
    };

    const getFriendRequest = async () => {
        try {
            const response = await FriendService.getFriendRequest();
            setFriendReq(response.data);
        } catch (error) {
            console.error("Error fetching friend requests:", error);
        }
    };

    const acceptFriend = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            const response = await FriendService.acceptFriend(formData);
            if (response.status === 200) {
                setFriendReq(prev => prev.filter(friend => friend.friendId !== friendId));
                getFriendRequest();
                getAllFriends();
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const addFriend = async (receiverId: string) => {
        try {
            const formData = new FormData();
            formData.append("receiverId", receiverId);
            await FriendService.addFriend(formData);
            setSentRequest(prev => [...prev, receiverId]);
        } catch (error) {
            console.error("Error sending friend request:", error);
        }
    };


    const unFriend = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            await FriendService.unFriend(formData);
            setFriends(prev => prev.filter(friend => friend.friendId !== friendId));
            getAllFriends();
        } catch (error) {
            console.error("Error unfriending:", error);
        }
    };

    const blockFriend = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            await FriendService.blockFriend(formData);
            setFriends(prev => prev.filter(friend => friend.friendId !== friendId));
            getAllFriends();
        } catch (error) {
            console.error("Error blocking friend:", error);
        }
    };

    useEffect(() => {
        document.title = "Bạn bè";
        getAllFriends();
        getFriendRequest();
        getAllFriendSuggestion();
        getAllFriendBlock();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Lời mời kết bạn */}
            {friendReq.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lời mời kết bạn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {friendReq.map((friend) => (
                            <div
                                key={friend.friendId}
                                className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                            >
                                <img
                                    src={friend.avatarUrl || "https://via.placeholder.com/56"}
                                    alt="Avatar"
                                    className="w-14 h-14 rounded-full border border-gray-300"
                                />
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center">
                                        <Link to={`/profile/${friend.friendId}`} className="font-semibold text-gray-800 hover:underline">
                                            {friend.name}
                                        </Link>
                                        {friend.verified && <CheckCircle className="text-blue-500 ml-1 w-4 h-4" />}
                                    </div>
                                </div>
                                <div className="ml-auto flex space-x-2">
                                    <button
                                        onClick={() => acceptFriend(friend.friendId)}
                                        className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Chấp nhận
                                    </button>
                                    <button className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-md hover:bg-gray-300 transition-colors duration-200">
                                        Từ chối
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tất cả bạn bè */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tất cả bạn bè</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friends.map((friend) => (
                        <div
                            key={friend.friendId}
                            className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 relative"
                        >
                            <img
                                src={friend.avatarUrl || "https://via.placeholder.com/56"}
                                alt="Avatar"
                                className="w-14 h-14 rounded-full border border-gray-300"
                            />
                            <div className="ml-4 flex-1">
                                <div className="flex items-center">
                                    <Link to={`/profile/${friend.friendId}`} className="font-semibold text-gray-800 hover:underline">
                                        {friend.name}
                                    </Link>
                                    {friend.verified && <CheckCircle className="text-blue-500 ml-1 w-4 h-4" />}
                                </div>
                            </div>
                            <div className="ml-auto">
                                <button
                                    className="text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors duration-200"
                                    onClick={() => handleClicked(friend.friendId)}
                                >
                                    <MoreHoriz className="w-5 h-5" />
                                </button>
                                {clickedFriendId === friend.friendId && (
                                    <div className="absolute top-12 right-0 w-48 bg-white shadow-xl rounded-lg p-3 z-50 border border-gray-200">
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
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Có thể bạn quen</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {friendSug.map((friend) => (
                        <div key={friend.friendId} className="bg-white p-4 rounded-lg shadow-md">
                            <img src={friend.avatarUrl || 'default.png'} alt="Avatar" className="w-full h-36 object-cover rounded-md" />
                            <div className="mt-2 text-center">
                                <Link to={`/profile/${friend.friendId}`} className="block font-semibold text-gray-800 hover:underline">
                                    {friend.name}
                                </Link>
                                <button  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Thêm bạn bè</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Danh sách bạn bè bị chặn */}
            {friendBlock.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Danh sách bạn bè bị chặn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {friendBlock.map((friend) => (
                            <div
                                key={friend.friendId}
                                className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                            >
                                <img
                                    src={friend.avatarUrl || "https://via.placeholder.com/56"}
                                    alt="Avatar"
                                    className="w-14 h-14 rounded-full border border-gray-300"
                                />
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center">
                                        <Link to={`/profile/${friend.friendId}`} className="font-semibold text-gray-800 hover:underline">
                                            {friend.name}
                                        </Link>
                                        {friend.verified && <CheckCircle className="text-blue-500 ml-1 w-4 h-4" />}
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <button
                                        className="bg-gray-200 text-red-600 px-4 py-1.5 rounded-md hover:bg-red-100 transition-colors duration-200"
                                        onClick={() => blockFriend(friend.friendId)}
                                    >
                                        Bỏ chặn
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Friend;