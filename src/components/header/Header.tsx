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
    
} from '@mui/icons-material';
import SearchModal from "./SearchModal";
import { useUserContext } from "../../context/UserContext";


const Header = () => {
    const { user } = useUserContext();

    return (
        <div className="w-full bg-[#ffffff] h-[60px] fixed flex items-center justify-between px-4 top-0 z-10 shadow-md ">
            <div className="flex items-center justify-start flex-[3]">
                <Link to="/" className="border-gray-100 border rounded-full p-1">
                    <Logo className="w-8 h-8 text-[rgb(30,144,255)]" />
                </Link>

                <SearchModal />
            </div>

            <div className="lg:flex hidden flex-[6] justify-center">
                <ul className="flex items-center justify-around">
                    <NavLink to="/" className={({ isActive }) =>
                            `relative group/edit flex items-center justify-center h-[60px] w-28 hover:bg-[#F0F2F5] ${isActive ? "text-fuchsia-500 border-b-4 border-fuchsia-500" : ""
                            }`
                        }
                    >
                        <Home />
                        <Description description="Trang chủ" />
                    </NavLink>

                    <NavLink to="/friends"
                        className={({ isActive }) =>
                            `relative group/edit flex items-center justify-center h-[60px] w-28 hover:bg-[#F0F2F5] ${isActive ? "text-fuchsia-500 border-b-4 border-fuchsia-500" : ""
                            }`
                        }
                    >
                        <PeopleOutline />
                        <Description description="Bạn bè" />
                    </NavLink>

                    <NavLink to="/groups"
                        className={({ isActive }) =>
                            `relative group/edit flex items-center justify-center h-[60px] w-28 hover:bg-[#F0F2F5] ${isActive ? "text-fuchsia-500 border-b-4 border-fuchsia-500" : ""
                            }`
                        }
                    >
                        <OndemandVideo />
                        <Description description="Video" />
                    </NavLink>
                    
                    <NavLink to="/games"
                        className={({ isActive }) =>
                            `relative group/edit flex items-center justify-center h-[60px] w-28 hover:bg-[#F0F2F5] ${isActive ? "text-fuchsia-500 border-b-4 border-fuchsia-500" : ""
                            }`
                        }
                    >
                        <SportsEsports />
                        <Description description="Chơi game" />
                    </NavLink>
                </ul>
            </div>

            <div className="flex justify-end flex-[3]">
                <div className="relative group/edit border-gray-100 bg-[#E2E5E9] border rounded-full p-2 ml-2 w-10 h-10 justify-center lg:hidden flex">
                    <WidgetsOutlined/>
                </div>
                <div className="relative group/edit border-gray-100 bg-[#E2E5E9] border rounded-full p-2 ml-2 w-10 h-10 justify-center flex">
                    <Notifications />
                    <Description description="Thông báo" />
                </div>

                <div className="relative group/edit border-gray-100 bg-[#E2E5E9] border rounded-full p-2 ml-2 w-10 h-10 justify-center flex">
                    <Message />
                    <Description description="Message" />
                </div>


                <div className="relative group/edit">
                    <img src={user?.avatarUrl || "https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/c39af4399a87bc3d7701101b728cddc9.jpg"}
                        alt=""
                        className=" ml-2 w-10 h-10 rounded-full border border-gray-400" />
                    <Description description="Tài khoản" />
                </div>


            </div>
        </div>
    );
};
export default Header;