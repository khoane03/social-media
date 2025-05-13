import { NavLink } from "react-router-dom";
import { useState } from "react";
import Alert from "../../alert/Alert";
import { getRefreshToken, removeAccessToken } from "../../../service/localStoreService";
import AuthService from "../../../service/AuthService";
import { Dashboard, PostAddTwoTone, AccountCircle, Info, Logout } from "@mui/icons-material";

interface MenuItemProps {
    icon: React.ReactNode;
    text: string;
    link: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, text, link }) => (
    <NavLink
        to={link}
        end
        className={({ isActive }) =>
            `p-3 font-bold flex items-center gap-2 rounded-s-3xl cursor-pointer relative  
      ${isActive
                ? "bg-gray-100 before:absolute before:content-[''] before:right-0 before:rounded-full before:bg-transparent before:w-8 before:h-8 before:top-[-32px] before:shadow-[18px_18px_0_3px_#F3F4F6] after:absolute after:content-[''] after:right-0 after:rounded-full after:bg-transparent after:w-8 after:h-8 after:bottom-[-32px] after:shadow-[18px_-18px_0_3px_#F3F4F6]"
                : "text-white"}`
        }
    >
        {icon} {text}
    </NavLink>
);

const Left: React.FC = () => {
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const handleLogout = async () => {
        try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                setError("Không tìm thấy refresh token");
                return;
            }
            await AuthService.logout(refreshToken);
            setSuccess("Đăng xuất thành công");
            setTimeout(() => {
                removeAccessToken();
                removeAccessToken();
                window.location.href = "/auth/admin";
            }, 2000);
        } catch (error: any) {
            setError(error.response?.data?.message || "Đã có lỗi xảy ra");
        }
    };

    const menuItems: MenuItemProps[] = [
        { icon: <Dashboard />, text: "Tổng Quan", link: "/dashboard" },
        { icon: <AccountCircle />, text: "Quản lý tài khoản", link: "/dashboard/account" },
        { icon: <PostAddTwoTone />, text: "Quản lý bài viết", link: "/dashboard/post" },
        { icon: <Info/>, text: "Thông tin Admin", link: "/dashboard/info" },
    ];

    return (
        <>
            {error && <Alert type="error" message={error} onClose={() => setError("")} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}
            <div className="w-64 bg-[#37B3E1] shadow-md h-screen pl-4 rounded-e-xl fixed z-1">
                <h1 className="my-7 text-center text-2xl font-bold text-white">SOCIAL MEDIA MANAGER</h1>
                <div>
                    {menuItems.map((item, index) => (
                        <MenuItem key={index} icon={item.icon} text={item.text} link={item.link} />
                    ))}
                    <button
                        onClick={handleLogout}
                        className="p-3 my-6 font-bold flex items-center gap-2 rounded-3xl cursor-pointer absolute bottom-0 text-gray-600 hover:bg-blue-600 hover:text-white"
                    >
                        <Logout /> Đăng xuất
                    </button>
                </div>
            </div>
        </>
    );
};

export default Left;
