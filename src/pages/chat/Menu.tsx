import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MoreHoriz } from "@mui/icons-material";

import ChatService from "../../service/ChatService";
import UserService from "../../service/UserService";
import { useStomp } from "../../context/WsContext";

import Accept from "../../components/popup/Accept";
import Alert from "../../components/alert/Alert";

interface Chat {
  userId: string;
  name: string;
  username: string;
  avatarUrl: string;
}

function MenuChat() {
  const [listChat, setListChat] = useState<Chat[]>([]);
  const [userOnline, setUserOnline] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userIdRef = useRef<string | null>(null);
  const currentUserRef = useRef<string | null>(null);
  const { isConnected, subscribe } = useStomp();

  const fetchCurrentUser = async () => {
    try {
      const res = await UserService.getInfo();
      userIdRef.current = res.data.id;
      currentUserRef.current = res.data.username;
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng", err);
    }
  };

  const fetchChatList = async () => {
    try {
      const res = await ChatService.getListChat();
      setListChat(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách chat", err);
    }
  };

  const handleDeleteConversation = async (recipientId: string) => {
    try {
      await ChatService.deleteMessage({
        type: "ALL",
        recipientId,
        senderId: userIdRef.current,
      });
      setListChat((prev) => prev.filter((chat) => chat.userId !== recipientId));
      setSuccess("Xóa cuộc trò chuyện thành công");
    } catch (err) {
      setError("Không thể xóa cuộc trò chuyện");
    } finally {
      setSelectedUserId(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchChatList();
    
  }, []);

  useEffect(() => {
    if(!isConnected) return;
    subscribe("/public/online", (data) => {
      console.log("User online",typeof data);
      setUserOnline(data);
    });
    
  }, [isConnected, subscribe]);
  
  return (
    <>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      <div className="w-full h-full bg-white rounded-lg shadow-md p-4">
        <h2 className="font-bold md:text-start text-center text-3xl border-b-2 border-gray-200 pb-2">
          Tất cả tin nhắn
        </h2>

        <div className="overflow-y-auto h-[calc(100vh-150px)] border-b-2 border-gray-200 scroll-smooth">
          {listChat.length > 0 ? (
            listChat.map((chat) => (
              <div key={chat.userId} className="relative group flex items-center gap-2 mt-4 hover:bg-gray-200 p-2 rounded-lg transition-all duration-300 ease-in-out">
                <Link to={`/chat/${chat.userId}`} className="flex items-center gap-2 flex-1">
                  {/* Avatar + online status */}
                  <div className="relative">
                    <img
                      src={chat.avatarUrl || "/assets/images/default-avatar.png"}
                      alt="User Avatar"
                      className="rounded-full w-12 h-12 border border-gray-300"
                    />
                    {userOnline.includes(chat.username) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-white border rounded-full" />
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {chat.name}
                      {userOnline.includes(chat.username) ? (
                        <span className="ml-2 text-xs text-green-500">online</span>
                      ):
                      (
                        <span className="ml-2 text-xs text-red-500">offline</span>
                      )
                      }
                    </h3>
                      
                  </div>
                </Link>

                {/* More icon + Accept popup */}
                <div
                  onClick={() => setSelectedUserId(chat.userId)}
                  className="hidden group-hover:flex transition-all duration-300 cursor-pointer"
                >
                  <MoreHoriz className="text-gray-600 hover:bg-gray-400 p-1 rounded-full w-8 h-8" />
                </div>

                {selectedUserId === chat.userId && (
                  <div className="absolute z-10 right-2 top-full mt-2">
                    <Accept
                      action="Xoá cuộc trò chuyện này?"
                      isAccept={() => handleDeleteConversation(chat.userId)}
                      isReject={() => setSelectedUserId(null)}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">Bạn chưa có cuộc trò chuyện nào</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MenuChat;