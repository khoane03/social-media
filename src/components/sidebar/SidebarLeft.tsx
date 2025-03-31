import {
    Diversity1Outlined,
    ExpandMore,
    Help,
    PeopleAlt,
    Settings,
    CheckCircle,
    Block
} from "@mui/icons-material";
import { Link, NavLink } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

const SidebarLeft = () => {
    const { user } = useUserContext();
    return (
        <div className="flex-[3] overflow-y-auto h-[1000px]">
            <ul className="border-b-2 pb-1">
                <Link to={`/profile/${user?.id}`} className="flex items-center  p-2 hover:bg-gray-200 rounded-lg">
                    <img src={user?.avatarUrl || "https://tintuc.dienthoaigiakho.vn/wp-content/uploads/2024/01/c39af4399a87bc3d7701101b728cddc9.jpg"}
                        alt=""
                        className="mr-2 w-10 h-10 rounded-full border border-gray-400" />
                    <p className="">{user?.name}</p>
                    {user?.verifier && <CheckCircle className="text-blue-500 ml-1" fontSize="small" />}

                </Link>
                <NavLink to="/friends" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                    <PeopleAlt className="text-green-400 mr-3" fontSize="large" />
                    <p className="">Bạn bè</p>
                </NavLink>
                <NavLink to="/friend/block" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                    <Block className="text-red-500 mr-3" fontSize="large" />
                    <p className="">Danh sách chặn</p>
                </NavLink>
                <NavLink to="/groups" className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                    <Diversity1Outlined className="text-blue-500 mr-3" fontSize="large" />
                    <p className="">Nhóm</p>
                </NavLink>
                <li className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                    <Help className="text-red-400 mr-3" fontSize="large" />
                    <p className="">Trợ giúp</p>
                </li>

                <li className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                    <Settings className="text-gray-700 mr-3" fontSize="large" />
                    <p className="">Cài đặt</p>
                </li>

                <li className="flex items-center p-2 hover:bg-gray-200 rounded-lg">
                    <ExpandMore className="bg-gray-300 text-gray-500 mr-3 rounded-full" fontSize="large" />
                    <p className="">Xem thêm</p>
                </li>

            </ul>

            <span className="text-gray-500 text-sm p-2 items-center flex justify-center">
                © No Copyright
                Dev © 2025
            </span>

        </div>
    );
}
export default SidebarLeft;