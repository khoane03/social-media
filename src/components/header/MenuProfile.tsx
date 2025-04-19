import { Logout, MailOutline } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../service/AuthService";
import { getRefreshToken, removeAccessToken, removeRefreshToken } from "../../service/localStoreService";
import Alert from "../alert/Alert";
import { useState } from "react";
import { useStomp } from "../../context/WsContext";

// Component Menu
const Menu = ({ open, info }: { open: boolean; info?: { id?: string | null; avatar?: string | null; name?: string | null } }) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const {isConnected, disconnect} = useStomp();
    const handleLogout = async () => {

        try {
            // Disconnect STOMP if connected
            if (isConnected) {
                disconnect();
            }
            const token = getRefreshToken();
            if (!token) {
                navigate("/auth");
                return;
            }
        
            await logout(token);
            setMessage("Đăng xuất thành công");
            setTimeout(() => {
                removeAccessToken();
                removeRefreshToken();
                navigate("/auth");
                setMessage(null);
            }, 2000);
        } catch (error) {
            console.error("Logout error:", error);  
            setError("Đăng xuất không thành công");
        }
    };

    return (
        <>
            {message && <Alert type="success" message={message} onClose={() => setMessage(null)} />}
            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
            <div className={`absolute right-0 top-[110%] w-56 bg-white shadow-xl border border-gray-200 rounded-lg py-3 transition-all duration-300 ease-in-out transform ${open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible pointer-events-none"
                }`}>
                <ul className="text-gray-800 space-y-1 px-2">
                    <Link
                        to={`/profile/${info?.id ?? ""}`}
                        className="px-3 py-2 hover:bg-gray-200 rounded-md cursor-pointer flex items-center gap-3 border-b border-gray-200 pb-3"
                    >
                        <img
                            src={info?.avatar ?? 'default.png'}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                        <span className="font-medium text-gray-900">{info?.name ?? "Người dùng"}</span>
                    </Link>
                    <li className="px-3 py-2 hover:bg-gray-200 rounded-md cursor-pointer flex items-center gap-3 transition-colors duration-200">
                        <MailOutline className="w-8 h-8 p-1.5 bg-gray-200 rounded-full text-gray-600"  fontSize="large"/>
                        <span className="text-base">Hỗ trợ</span>
                    </li>
                    <li
                        onClick={handleLogout}
                        className="px-3 py-2 hover:bg-gray-200 rounded-md cursor-pointer flex items-center gap-3 transition-colors duration-200 text-red-600 font-semibold"
                    >
                        <Logout className="w-8 h-8 p-1.5 bg-gray-200 rounded-full text-red-500" fontSize="large"/>
                        <span className="text-base">Đăng xuất</span>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Menu;
