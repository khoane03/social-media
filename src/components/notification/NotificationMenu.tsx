import { useEffect, useState, useCallback, useMemo } from "react";
import NotificationService from "../../service/NotificationService";
import UserService from "../../service/UserService";
import { DeleteOutlined, Notifications } from "@mui/icons-material";
import { useStomp } from "../../context/WsContext";
import { Link } from "react-router-dom";

interface Notification {
    id: string;
    content: string;
    status: "UNREAD" | "READ";
}

interface Props {
    onUpdateUnread: (count: number) => void;
    open?: boolean;
    onClose?: () => void;
}

const NotificationMenu = ({ onUpdateUnread, open = false, onClose }: Props) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { isConnected, subscribe } = useStomp();

    const unreadCount = useMemo(
        () => notifications.filter(n => n.status === "UNREAD").length,
        [notifications]
    );

    // Gọi callback mỗi khi số lượng thông báo chưa đọc thay đổi
    useEffect(() => {
        onUpdateUnread(unreadCount);
    }, [unreadCount, onUpdateUnread]);

    const fetchNotifications = useCallback(async () => {
        try {
            const user = await UserService.getInfo();
            const res = await NotificationService.getNotification(user.data.id);
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Lắng nghe thông báo mới qua STOMP
    useEffect(() => {
        if (!isConnected) return;

        const subscription = subscribe("/user/private/notification", (message: unknown) => {
            const newNoti = message as Notification;
            if (["UNREAD", "READ"].includes(newNoti.status)) {
                setNotifications(prev => [...prev, newNoti]);
            } else {
                console.error("Invalid notification status:", newNoti.status);
            }
        });

        return () => subscription?.unsubscribe();
    }, [isConnected, subscribe]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await NotificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    }, []);

    const handleMarkAsRead = useCallback(async (id: string) => {
        try {
            await NotificationService.maskAsRead(id);
            setNotifications(prev =>
                prev.map(n =>
                    n.id === id ? { ...n, status: "READ" } : n
                )
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    }, []);

    const extractPath = (content: string) => {
        const match = content.match(/path:\s*(\/\S*)/);
        return match ? match[1] : "/";
    };

    const extractMessage = (content: string) => {
        return content.split(".")[0].trim();
    };

    return (
        <div
            className={`absolute right-0 top-[110%] w-80 bg-white shadow-2xl border border-gray-200 rounded-xl p-4 z-50 transition-all duration-300 ease-in-out transform 
                ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        >
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <Notifications className="w-5 h-5 text-purple-600" />
                Thông báo
            </h3>

            {notifications.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">Không có thông báo nào</div>
            ) : (
                <ul className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                    {notifications.map((noti, index) => (
                        <li
                            key={noti.id}
                            className={`p-3 rounded-lg flex justify-between items-start border hover:bg-purple-50 transition-colors duration-200 cursor-pointer 
                                ${noti.status === "UNREAD" ? "bg-purple-100" : "bg-white"} animate-fade-in`}
                            style={{ animationDelay: `${index * 30}ms`, animationFillMode: "backwards" }}
                        >
                            <Link
                                to={extractPath(noti.content)}
                                className="flex items-center gap-3 flex-1"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleMarkAsRead(noti.id);
                                    onClose?.();
                                }}
                            >
                                <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0" />
                                <span className={`text-sm ${noti.status === "UNREAD" ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                                    {extractMessage(noti.content)}
                                </span>
                            </Link>

                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    handleDelete(noti.id);
                                   
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                aria-label="Delete notification"
                            >
                                <DeleteOutlined className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationMenu;
