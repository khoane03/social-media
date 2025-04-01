import { useEffect, useState } from "react";
import FriendService from "../../../service/FriendService"; // Đường dẫn đúng
import { CheckCircle } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Alert from "../alert/Alert";
import Accept from "../popup/Accept";

const Friend = () => {
    const [friendReq, setFriendReq] = useState<any[]>([]);
    const [friendSug, setFriendSug] = useState<any[]>([]);
    const [friendBlock, setFriendBlock] = useState<any[]>([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [friendId, setFriendId] = useState('');
    const getAllFriendSuggestion = async () => {
        try {
            const response = await FriendService.getFriendSuggestion();
            setFriendSug(response.data);
        } catch (error) {
            setError("Lỗi khi lấy danh sách bạn bè gợi ý");
        }
    };

    const getAllFriendBlock = async () => {
        try {
            const response = await FriendService.getAllFriendBlock();
            setFriendBlock(response.data);
            console.log(response.data);
        } catch (error) {
            setError("Lỗi khi lấy danh sách bạn bè bị chặn");
        }
    };

    const getFriendRequest = async () => {
        try {
            const response = await FriendService.getFriendRequest();
            setFriendReq(response.data);
        } catch (error) {
            setError("Lỗi khi lấy danh sách lời mời kết bạn");
        }
    };

    const acceptFriend = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            await FriendService.acceptFriend(formData);
            setFriendReq(prev => prev.filter(friend => friend.friendId !== friendId));
            setFriendSug(prev => prev.filter(friend => friend.friendId !== friendId));
            setSuccess("Chấp nhận lời mời kết bạn thành công");
        } catch (error) {
            setError("Chấp nhận lời mời kết bạn thất bại");
        }
    };

    const addFriend = async (receiverId: string) => {
        try {
            const formData = new FormData();
            formData.append("receiverId", receiverId);
            await FriendService.addFriend(formData);
            setSuccess("Gửi lời mời kết bạn thành công");
            setFriendSug(prev => prev.filter(friend => friend.friendId !== receiverId));
        } catch (error) {
            setError("Gửi lời mời kết bạn thất bại");
        }
    };

    const unBlockFriend = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            await FriendService.blockFriend(formData);
            setFriendBlock(prev => prev.filter(friend => friend.friendId !== friendId));
            setSuccess("Bỏ chặn bạn bè thành công");
            setShowPopup(false);
        } catch (error) {
            console.error("Error blocking friend:", error);
        }
    };

    const cancelFriendRequest = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            await FriendService.unFriend(formData);
            setFriendReq(prev => prev.filter(friend => friend.friendId !== friendId));
            setSuccess("Hủy lời mời kết bạn thành công");
        } catch (error) {
            setError("Hủy lời mời kết bạn thất bại");
        }
    };

    useEffect(() => {
        document.title = "Bạn bè";
        getFriendRequest();
        getAllFriendSuggestion();
        getAllFriendBlock();
    }, []);

    return (
        <>
            {success && <Alert message={success} type="success" onClose={() => setSuccess('')} />}
            {error && <Alert message={error} type="error" onClose={() => setError('')} />}
            {showPopup && <Accept action="huỷ chặn" isAccept={() => { unBlockFriend(friendId) }} isReject={() => setShowPopup(false)} />}
            <div className="p-6 bg-white rounded-lg shadow-md">
                {/* Lời mời kết bạn */}
                {friendReq.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                            Lời mời kết bạn
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {friendReq.map((friend) => (
                                <div
                                    key={friend.friendId}
                                    className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <img
                                        src={friend.avatarUrl || "default.png"}
                                        alt="Avatar"
                                        className="w-12 h-12 rounded-full border border-gray-300 object-cover flex-shrink-0"
                                    />
                                    <div className="ml-4 flex-1 min-w-0">
                                        <div className="flex items-center">
                                            <Link
                                                to={`/profile/${friend.friendId}`}
                                                className="font-semibold text-gray-800 hover:text-blue-600 truncate transition-colors duration-200"
                                            >
                                                {friend.name}
                                            </Link>
                                            {friend.verified && (
                                                <CheckCircle className="text-blue-500 ml-1 w-4 h-4 flex-shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex space-x-3 space-y-1 flex-wrap">
                                        <button onClick={() => acceptFriend(friend.friendId)}
                                            className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-200">
                                            Chấp nhận
                                        </button>
                                        <button onClick={() => cancelFriendRequest(friend.friendId)}
                                            className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-200"
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">Có thể bạn quen</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {friendSug.map((friend) => (
                            <div key={friend.friendId} className="bg-white p-4 rounded-lg shadow-md">
                                <img src={friend.avatarUrl || 'default.png'} alt="Avatar" className="w-full h-36 object-cover rounded-md" />
                                <div className="mt-2 text-center">
                                    <Link to={`/profile/${friend.friendId}`} className="block font-semibold text-gray-800 hover:underline">
                                        {friend.name}
                                    </Link>
                                    <button onClick={() => addFriend(friend.friendId)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">Thêm bạn bè</button>
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
                                            onClick={() => {
                                                setFriendId(friend.friendId);
                                                setShowPopup(true);
                                            }}
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
        </>
    );
};

export default Friend;