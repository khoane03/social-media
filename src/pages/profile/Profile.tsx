import Header from "../../components/header/Header";
import UserService from "../../service/UserService";
import {
    AddAPhoto,
    Chat,
    CheckCircle,
    People,
} from "@mui/icons-material";
import {
    useEffect,
    useState
} from "react";
import UpdateImg from "./UpdateImg";
import {
    Link,
    NavLink,
    Outlet,
    useParams
} from "react-router-dom";
import FriendService from "../../service/FriendService";
import { useUserContext } from "../../context/UserContext";
import ImageViewer from "../../components/view/ImageViewer";

export default function Profile() {

    interface userInfo {
        address?: string | null;
        age?: number;
        dob?: string | null;
        email: string;
        gender?: string | null;
        id: string;
        name: string;
        phone?: string | null;
        role: string[];
        avatarUrl?: string | null;
        coverUrl?: string | null;
        status: string;
        username: string;
        verifier: boolean;
    }

    const [info, setInfo] = useState<userInfo>();
    const [onlyView, setOnlyView] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [totalFriend, setTotalFriend] = useState<number>(0);
    const { user } = useUserContext();
    const { userId } = useParams<{ userId: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [type, setType] = useState<string>("Avatar");

    const getFriends = async () => {
        try {
            const res = await FriendService.getAllFriends(userId || '');
            setTotalFriend(res.data.length);
        } catch (error) {
            console.error("Failed to fetch friends:", error);
        }
    }

    useEffect(() => {
        setLoading(true);
        document.title = "Trang cá nhân";
        getFriends();

        const fetchUserInfo = async () => {
            try {
                if (userId) {
                    const res = await UserService.getInfoById(userId);
                    setInfo(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();

        if (user && user.id) {
            setOnlyView(userId !== user.id);
        }
    }, [userId, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen animate-pulse">
                <div className="loader"></div>
            </div>
        );
    }



    return (
        <div className="bg-[#F2F4F7] text-black h-auto">
            <Header />
            <UpdateImg
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                typeDefault={type}
            />
            <div className="bg-white shadow-lg">

                <div className="">
                    <div className="relative mt-[61px] h-96 bg-gray-300 md:mx-40 rounded-b-lg">
                        <img onClick={() => setSelectedImage(info?.coverUrl || 'default.png')} src={info?.coverUrl || 'default.png'}
                            alt=""
                            className="w-full h-full object-cover rounded-b-lg" />
                        {!onlyView && (
                            <div onClick={() => {
                                setIsModalOpen(true)
                                setType("Cover")
                            }}
                                className="absolute bg-white flex items-center -translate-y-16 right-[10px] z-10 rounded-full p-2 shadow-lg hover:bg-gray-200">

                                <AddAPhoto className="p-2 cursor-pointer rounded-full bg-gray-300" fontSize="large" />
                                <span className="pl-1">Chỉnh sửa</span>

                            </div>
                        )}
                    </div>
                </div>

                <div className="md:mx-40 px-4 flex">
                    {selectedImage &&
                        <ImageViewer image={selectedImage} onClose={() => { setSelectedImage("") }} />
                    }
                    <div className=" w-40 h-40 rounded-full left-[2%] -translate-y-[20px]">
                        <img onClick={() => setSelectedImage(info?.avatarUrl || 'default.png')} src={info?.avatarUrl || 'default.png'}
                            alt=""
                            className=" w-full h-full rounded-full border-4 border-white" />

                        {!onlyView && (
                            <div onClick={() => {
                                setIsModalOpen(true)
                                setType("Avatar")
                            }}
                                className="absolute bottom-2 right-2 border bg-gray-100 hover:bg-gray-200 rounded-full">
                                <AddAPhoto className="p-2 cursor-pointer" fontSize="large" />
                            </div>
                        )}
                    </div>

                    <div className="ml-3 py-3">
                        <div className="flex items-center">
                            <span className="font-bold text-lg ">
                                {info?.name}
                            </span>
                            {info?.verifier && <CheckCircle className="text-blue-500 ml-1" fontSize="small" />}
                        </div>
                        <span className="text-gray-500 text-sm hover:underline pr-1">{totalFriend} bạn bè</span>
                        {onlyView && <div className="pt-2 flex">
                            <button className="py-1 px-3 bg-gray-300 rounded-lg mr-2 flex">
                                <People className="mr-2" />
                                Bạn bè</button>
                            <Link to={`/chat/${info?.id}`} className="py-1 px-3 bg-blue-500 rounded-lg mr-2 text-white">
                                <Chat className="mr-2 text-gray-300" />
                                Nhắn tin</Link>
                        </div>}
                    </div>
                </div>
                <div className="md:mx-40 px-4 pb-1 flex items-center justify-start space-x-2 md:space-x-4">
                    <div className="group">
                        <NavLink
                            to={`/profile/${userId}`}
                            end
                            className={({ isActive }) =>
                                `block px-4 py-2 font-semibold text-gray-700 rounded-lg transition-colors duration-200 ${isActive
                                    ? "bg-blue-100 text-blue-700"
                                    : "hover:bg-gray-100 group-hover:text-gray-900"
                                }`
                            }
                        >
                            Bài viết
                        </NavLink>
                    </div>
                    <div className="group">
                        <NavLink
                            to="photos"
                            className={({ isActive }) =>
                                `block px-4 py-2 font-semibold text-gray-700 rounded-lg transition-colors duration-200 ${isActive
                                    ? "bg-blue-100 text-blue-700"
                                    : "hover:bg-gray-100 group-hover:text-gray-900"
                                }`
                            }
                        >
                            Ảnh
                        </NavLink>
                    </div>
                    <div className="group">
                        <NavLink
                            to="friend"
                            className={({ isActive }) =>
                                `block px-4 py-2 font-semibold text-gray-700 rounded-lg transition-colors duration-200 ${isActive
                                    ? "bg-blue-100 text-blue-700"
                                    : "hover:bg-gray-100 group-hover:text-gray-900"
                                }`
                            }
                        >
                            Bạn bè
                        </NavLink>
                    </div>
                </div>
                <div className="bg-[#F2F4F7] text-black h-full pt-5 ">
                    <Outlet />
                </div>
            </div>


        </div >


    );
}