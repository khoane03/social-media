import { useEffect, useState } from "react";
import FriendService from "../../../service/FriendService";
import { Block, CheckCircle, MoreHoriz, PersonRemove } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Friend = () => {
    const [friends, setFriends] = useState([]);
    const [friendReq, setFriendReq] = useState([]);
    const [friendSug, setFriendSug] = useState([]);
    const [friendBlock, setFriendBlock] = useState([]);
    const [sentRequest, setSentRequest] = useState<string[]>([]);
    const [clicked, setClicked] = useState(false);

    const handleClicked = () => {
        setClicked(!clicked);
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
            console.error("Error fetching friends:", error);
        }
    };
    const getAllFriendBlock = async () => {
        try {
            const response = await FriendService.getAllFriendBlock();
            setFriendBlock(response.data);
        } catch (error) {
            console.error("Error fetching friends:", error);
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
                setFriendReq(prev => prev.filter((friend: any) => friend.friendId !== friendId));
            }
            getFriendRequest();
            getAllFriends();
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
    }

    const cancelFriendRequest = async (receiverId: string) => {
        try {
            const formData = new FormData();
            formData.append("receiverId", receiverId);
            await FriendService.addFriend(formData);
            setSentRequest(prev => prev.filter((id: string) => id !== receiverId));

        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    }


    const unFriend = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            await FriendService.unFriend(formData);
            setFriends(prev => prev.filter((friend: any) => friend.friendId !== friendId));
            getAllFriends();
        } catch (error) {
            console.error("Error unfriending:", error);
        }
    };

    const blockFriend = async (friendId: string) => {
        try {
            const formData = new FormData();
            formData.append("friendId", friendId);
            console.log(friendId);
            await FriendService.blockFriend(formData);
            setFriends(prev => prev.filter((friend: any) => friend.friendId !== friendId));
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
        <>
            {friendReq.length > 0 && <div>
                <h2 className="text-xl font-bold mt-5">Lời mời kết bạn</h2>
                <div>
                    {friendReq.map((friend: any, index) => (
                        <div key={index} className="flex items-center p-3 border-b-[1px]">
                            <div className="w-14 h-14 mr-3">
                                <img
                                    src={friend.avatarUrl}
                                    alt="Avatar"
                                    className="w-14 h-14 rounded-full border border-gray-400"
                                />
                            </div>
                            <div className="flex items-center">
                                <div className="font-bold">{friend.name}</div>
                                {friend.verified && <CheckCircle className="text-blue-500 ml-1" fontSize="small" />}
                            </div>
                            <div className="ml-auto">
                                <button
                                    onClick={() => acceptFriend(friend.friendId)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                                >
                                    Chấp nhận
                                </button>
                                <button className="bg-gray-200 text-gray-500 px-3 py-1 rounded-lg ml-2">
                                    Từ chối
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            }

            <h2 className="text-xl font-bold mt-5">Tất cả bạn bè</h2>
            <div>
                {friends.map((friend: any, index) => (
                    <div key={index} className="flex items-center p-3 border-b-[1px]">
                        <div className="w-14 h-14 mr-3">
                            <img
                                src={friend.avatarUrl}
                                alt="Avatar"
                                className="w-14 h-14 rounded-full border border-gray-400"
                            />
                        </div>
                        <div className="flex items-center">
                            <Link
                                to={`/profile/${friend.friendId}`}
                                className="font-bold hover:underline"
                            >
                                {friend.name}
                            </Link>
                            {friend.verified && <CheckCircle className="text-blue-500 ml-1" fontSize="small" />}
                        </div>
                        <div className="ml-auto relative"

                        >
                            <button className="bg-gray-200 text-gray-500 px-3 py-1 rounded-lg hover:bg-gray-300"
                                onClick={handleClicked}>
                                <MoreHoriz />
                            </button>
                            {clicked && (
                                <div className="bg-white shadow-lg rounded-lg p-2 absolute top-10 right-0 w-40">
                                    <button className="hover:bg-gray-200 p-3 rounded-lg flex w-full h-12 "
                                        onClick={() => unFriend(friend.friendId)}>
                                        <PersonRemove className="mr-2" />
                                        Hủy kết bạn
                                    </button>
                                    <button className="hover:bg-gray-200 p-3 rounded-lg flex w-full h-12 "
                                        onClick={() => blockFriend(friend.friendId)}>
                                        <Block className="mr-2" />
                                        Chặn
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="text-xl font-bold mt-5">Có thể bạn quen biết ?</h2>
            <div>
                {friendSug.map((friendSug: any, index) => (
                    <div key={index} className="flex items-center p-3 border-b-[1px]">
                        <div className="w-14 h-14 mr-3">
                            <img
                                src={friendSug.avatarUrl}
                                alt="Avatar"
                                className="w-14 h-14 rounded-full border border-gray-400"
                            />
                        </div>
                        <div className="flex items-center">
                            <Link
                                to={`/profile/${friendSug.friendId}`}
                                className="font-bold hover:underline"
                            >
                                {friendSug.name}
                            </Link>
                            {friendSug.verified && <CheckCircle className="text-blue-500 ml-1" fontSize="small" />}
                        </div>
                        <div className="ml-auto">
                            {sentRequest.includes(friendSug.friendId) ? (
                                <button
                                    className="text-red-500 bg-gray-200 px-3 py-1 rounded-lg hover:bg-red-100"
                                    onClick={() => cancelFriendRequest(friendSug.friendId)}
                                >
                                    Huỷ yêu cầu
                                </button>
                            ) : (
                                <button
                                    className="text-blue-500 bg-gray-200 px-3 py-1 rounded-lg hover:bg-blue-100"
                                    onClick={() => addFriend(friendSug.friendId)}
                                >
                                    Gửi lời mời
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {friendBlock.length > 0 &&
                <>
                    <h2 className="text-xl font-bold mt-5">Danh sách bạn bè bị chặn</h2>
                    <div>
                        {friendBlock.map((friendBlock: any, index) => (
                            <div key={index} className="flex items-center p-3 border-b-[1px]">
                                <div className="w-14 h-14 mr-3">
                                    <img
                                        src={friendBlock.avatarUrl}
                                        alt="Avatar"
                                        className="w-14 h-14 rounded-full border border-gray-400"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <Link
                                        to={`/profile/${friendBlock.friendId}`}
                                        className="font-bold hover:underline"
                                    >
                                        {friendBlock.name}
                                    </Link>
                                    {friendBlock.verified && <CheckCircle className="text-blue-500 ml-1" fontSize="small" />}
                                </div>
                                <div className="ml-auto">
                                    <button
                                        className="text-red-500 bg-gray-200 px-3 py-1 rounded-lg hover:bg-red-100"
                                        onClick={() => blockFriend(friendBlock.friendId)}
                                    >
                                        Bỏ chặn
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>

            }
        </>
    );
};

export default Friend;
