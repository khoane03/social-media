import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import NotificationService from "../../service/NotificationService";
import UserService from "../../service/UserService";
import { DeleteOutlined, Notifications } from "@mui/icons-material";
import { useStomp } from "../../context/WsContext";

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
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    // Hide menu when clicking outside
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose?.();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = ""; };
        }
    }, [open]);

    const unreadCount = useMemo(
        () => notifications.reduce((acc, n) => acc + (n.status === "UNREAD" ? 1 : 0), 0),
        [notifications]
    );

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

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    // Listen for new notifications via STOMP
    useEffect(() => {
        if (!isConnected) return;
        const subscription = subscribe("/user/private/notification", (message: unknown) => {
            const newNoti = message as Notification;
            if (newNoti.status === "UNREAD" || newNoti.status === "READ") {
                setNotifications(prev => [...prev, newNoti]);
            }
        });
        return () => subscription?.unsubscribe();
    }, [isConnected, subscribe]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            setLoading(true);
            await NotificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
        finally {
            setLoading(false);
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

    return (
        <div className="fixed inset-0 bg-black/10 bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
            style={{ display: open ? "block" : "none" }}>
            <div
                ref={dropdownRef}
                className={`fixed md:w-96 md:inset-x-auto inset-x-0 md:right-4 top-15 bg-white shadow-2xl border border-gray-200 rounded-xl p-4 z-50 transition-all duration-300 ease-in-out transform 
                ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"} md:mx-auto mx-2`}
            >
                <h3 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
                    <Notifications className="w-5 h-5 text-purple-600" />
                    Thông báo
                </h3>
                {notifications.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">Không có thông báo nào</div>
                ) : (
                    <ul className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                        {notifications.map((noti, index) => (
                            <li
                                key={noti.id}
                                className={`p-3 rounded-lg flex justify-between items-start border hover:bg-purple-50 transition-colors duration-200 cursor-pointer 
                                ${noti.status === "UNREAD" ? "bg-purple-100" : "bg-white"} animate-fade-in`}
                                style={{ animationDelay: `${index * 30}ms`, animationFillMode: "backwards" }}
                            >
                                <div
                                    className="flex items-center gap-3 flex-1"
                                    onClick={e => {
                                        e.stopPropagation();
                                        if (noti.status === "UNREAD") handleMarkAsRead(noti.id);
                                    }}
                                >
                                    <span className="w-2 h-2 bg-purple-500 rounded-full shrink-0" />
                                    <span className={`text-sm ${noti.status === "UNREAD" ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                                        {noti.content}
                                    </span>
                                </div>
                                <button
                                    disabled={loading}
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
        </div>
    );
};

export default NotificationMenu;
