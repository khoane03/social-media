import { Link, NavLink } from "react-router-dom";
import { Logo } from "../icon/Icon";
import Description from "../description/Description";
import {
    Home,
    Message,
    Notifications,
    OndemandVideo,
    PeopleOutline,
    SportsEsports,
    WidgetsOutlined,
} from "@mui/icons-material";
import SearchModal from "./SearchModal";
import { useUserContext } from "../../context/UserContext";
import { useState } from "react";
import Menu from "./MenuProfile";
import NotificationMenu from "../notification/NotificationMenu";

const Header = () => {
    const { user } = useUserContext();
    const [openMenu, setOpenMenu] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    return (
        <div className="w-full bg-white h-[60px] fixed flex items-center justify-between px-4 top-0 z-50 shadow-md">
            {/* Logo + Search */}
            <div className="flex items-center flex-1">
                <Link to="/" className="border-gray-100 border rounded-full p-1">
                    <Logo className="w-8 h-8 text-[rgb(30,144,255)]" />
                </Link>
                <SearchModal />
            </div>

            {/* Navigation */}
            <div className="hidden lg:flex flex-1 justify-center">
                <ul className="flex items-center space-x-6">
                    {[
                        { to: "/", icon: <Home />, desc: "Trang chủ" },
                        { to: "/friends", icon: <PeopleOutline />, desc: "Bạn bè" },
                        { to: "/groups", icon: <OndemandVideo />, desc: "Video" },
                        { to: "/games", icon: <SportsEsports />, desc: "Chơi game" },
                    ].map(({ to, icon, desc }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `relative flex items-center justify-center h-[60px] w-24 transition-all ${isActive
                                    ? "text-fuchsia-500 border-b-4 border-fuchsia-500"
                                    : "hover:bg-gray-100"
                                }`
                            }
                        >
                            {icon}
                            <Description description={desc} />
                        </NavLink>
                    ))}
                </ul>
            </div>

            {/* Actions + Avatar */}
            <div className="flex items-center flex-1 justify-end space-x-3">
                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer">
                    <WidgetsOutlined />
                </div>

                {/* Notification */}
                <div className="relative">
                    <div
                        onClick={() => {
                            setOpenNotification(!openNotification);
                            setOpenMenu(false);
                        }}
                        className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer relative"
                    >
                        <Notifications />
                        <Description description="Thông báo" />
                        {unreadCount > 0 && <span className="absolute animate-pulse -translate-y-2 top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                            {unreadCount || ""}
                        </span>}
                    </div>
                    <NotificationMenu onUpdateUnread={(count) => setUnreadCount(count)} open={openNotification} onClose={() => setOpenNotification(false)} />
                </div>

                {/* Messages */}
                <Link to={'/chat'} className="relative flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer">
                    <Message />
                    <Description description="Tin nhắn" />
                </Link>

                {/* User Avatar */}
                <div className="relative">
                    <div onClick={() => {
                        setOpenMenu(!openMenu);
                        setOpenNotification(false);
                    }}
                        className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer border border-gray-300 overflow-hidden" >
                        <img src={user?.avatarUrl || 'default.png'}
                            alt="avatar"
                            className="w-10 h-10 object-cover" />
                    </div>
                    <Menu
                        open={openMenu}
                        info={{ id: user?.id, avatar: user?.avatarUrl, name: user?.name }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;