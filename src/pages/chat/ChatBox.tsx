import { ArrowBack, MoreHorizOutlined, Send } from "@mui/icons-material";
import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStomp } from "../../context/WsContext";
import ChatService from "../../service/ChatService";
import UserService from "../../service/UserService";
import Accept from "../../components/popup/Accept";

interface MessageRequest {
  content: string;
  recipient: string;
  sender: string;
}

interface MessageResponse {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
}

interface ChatBoxProps {
  userId: string;
}

const ChatBox = ({ userId }: ChatBoxProps) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isConnected, subscribe, send } = useStomp();
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await ChatService.deleteMessage({ id, type: 'ONE' });
      setMessages(prev => prev.filter(msg => msg.id !== id));
      setSelectedMsgId(null);
    } catch (error) {
      setError("Không thể xóa tin nhắn");
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load user info
  const fetchUserInfo = useCallback(async () => {
    try {
      const [currentUserRes, recipientRes] = await Promise.all([
        UserService.getInfo(),
        UserService.getInfoById(userId)
      ]);
      setCurrentUser(currentUserRes.data);
      setRecipient(recipientRes.data);
    } catch (err) {
      setError("Không thể tải thông tin người dùng");
    }
  }, [userId]);

  // Load chat messages
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await ChatService.getChat(userId);
      setMessages(res.data);
    } catch (err) {
      setError("Không thể tải lịch sử trò chuyện");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Init once
  useEffect(() => {
    fetchUserInfo();
    fetchMessages();
  }, [fetchUserInfo, fetchMessages]);

  // Subscribe STOMP
  useEffect(() => {
    if (!isConnected || !currentUser || !recipient) return;

    const subscription = subscribe("/user/private/chat", (data: MessageResponse) => {
      if ((data.sender === recipient.username && data.recipient === currentUser.username) ||
        data.sender === currentUser.username && data.recipient === recipient.username) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => subscription?.unsubscribe();
  }, [isConnected, currentUser, recipient, subscribe]);


  const sendMessage = useCallback(() => {
    if (!input.trim() || !currentUser || !recipient) return;

    const newMessage: MessageRequest = {
      content: input,
      recipient: recipient.username,
      sender: currentUser.username,
    };

    send({
      destination: "/app/chat",
      data: newMessage,
    });

    setInput("");
  }, [input, userId, send, currentUser, recipient]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      className={`bg-white flex flex-col w-full h-full md:h-[calc(100vh-30px)] 
              fixed inset-0 z-30 md:static md:rounded-2xl md:shadow-xl 
              border border-gray-200 overflow-hidden my-0 md:my-2`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-3 flex items-center md:gap-4 shadow-md">
        <div
          onClick={() => navigate("/chat")}
          className="w-10 h-10 md:hidden flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-all"
          title="Quay lại"
        >
          <ArrowBack className="text-white" />
        </div>

        <img
          src={recipient?.avatarUrl || "default.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
        />

        <Link
          to={`/profile/${recipient?.id}`}
          className="text-lg font-semibold hover:underline truncate"
        >
          {recipient?.name}
        </Link>
      </div>

      {/* Tin nhắn */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-3">
        {error && <div className="text-center text-red-500">{error}</div>}
        {isLoading ? (
          <div className="text-center text-gray-500">Đang tải...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">Chưa có tin nhắn</div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.sender === currentUser?.username;
            return (
              <div key={index} className={`flex mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
                <div className="relative group max-w-[75%]">
                  <div
                    className={`px-4 py-2 rounded-2xl break-words shadow-md transition-all duration-200 
                ${isOwn ? "bg-blue-500 text-white" : "bg-white text-gray-800 border border-gray-200"}`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"} block mt-1 text-right`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`absolute top-1/2 -translate-y-1/2 ${isOwn ? "-left-6" : "-right-6"} opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer`}
                    onClick={() => setSelectedMsgId(msg.id)}
                  >
                    <MoreHorizOutlined className="text-gray-400 hover:text-gray-600" fontSize="small" />
                  </div>

                  {selectedMsgId === msg.id && (
                    <Accept
                      action="xoá tin nhắn"
                      isAccept={() => handleDelete(msg.id)}
                      isReject={() => setSelectedMsgId(null)}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex items-center gap-3">
        <input
          className="flex-1 border border-gray-300 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50"
          disabled={!input.trim()}
        >
          <Send className="text-lg" />
        </button>
      </div>
    </div>

  );
};

export default ChatBox;
