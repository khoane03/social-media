import { useEffect, useRef, useState } from "react";
import { Article, CheckCircle, KeyboardArrowDown, LockPerson, People } from "@mui/icons-material";
import { Link } from "react-router-dom";
import UserService from "../../../service/UserService";
import PostService from "../../../service/PostService";
import AuthService from "../../../service/AuthService";
import { getRefreshToken, removeAccessToken, removeRefreshToken } from "../../../service/localStoreService";
import Alert from "../../alert/Alert";


interface Stats {
    totalUsers: number;
    totalPosts: number;
    blockedUsers: number;
}


function Overview() {
    const [open, setOpen] = useState(false);
    const [userLogin, setUserLogin] = useState<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalPosts: 0,
        blockedUsers: 0,
    });

    const handleLogout = async () => {
        try {
            await AuthService.logout(getRefreshToken() || '')
            setTimeout(() => {
                removeAccessToken();
                removeRefreshToken();
                window.location.href = "/dashboard/auth";
                setMessage("Đăng xuất thành công");
            }, 2000);
        } catch (error: any) {
            setError(true);
            setMessage(error.response?.data?.message || "Lỗi khi đăng xuất. Vui lòng thử lại sau.");
        }
    };

    const fetchUserLogin = async () => {
        try {
            const res = await UserService.getInfo();
            setUserLogin(res.data);

        } catch (error: any) {
            setError(true);
            setMessage(error.response?.data?.message || "Lỗi khi lấy thông tin người dùng. Vui lòng thử lại sau.");
        }
    }

    const fetchAccounts = async () => {
        try {

            const [activeRes, lockedRes] = await Promise.all([
                UserService.countUserByStatus("Active"),
                UserService.countUserByStatus("Locked")
            ]);
            const totalUsers = activeRes.data || 0;
            const blockedUsers = lockedRes.data || 0;

            setStats(prev => ({
                ...prev,
                totalUsers,
                blockedUsers,
            }));
        } catch (error) {
            setError(true);
            setMessage("Lỗi khi lấy danh sách người dùng. Vui lòng thử lại sau.");
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await PostService.totalPosts();

            const totalPosts = res?.data || 0;

            setStats(prev => ({
                ...prev,
                totalPosts,
            }));
        } catch (error) {
            setError(true);
            setMessage("Lỗi khi lấy danh sách bài viết. Vui lòng thử lại sau.");
        }
    };

    useEffect(() => {
        fetchUserLogin();
        fetchAccounts();
        fetchPosts();
    }, []);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const cards = [
        {
            title: "Tổng người dùng",
            value: stats.totalUsers,
            icon: <People className="text-blue-500" />,
            bg: "bg-blue-50",
        },
        {
            title: "Tổng bài viết",
            value: stats.totalPosts,
            icon: <Article className="text-green-500" />,
            bg: "bg-green-50",
        },
        {
            title: "Người dùng bị khoá",
            value: stats.blockedUsers,
            icon: <LockPerson className="text-red-500" />,
            bg: "bg-red-50",
        },
    ];

    return (
        <>
            {message && <Alert type={error ? "error" : "success"} message={message} onClose={() => setMessage("")} />}
            <div className="m-6">
                <div className="flex items-center">
                    <img
                        src={userLogin?.avatarUrl || "default.png"}
                        alt="Avatar"
                        className="w-12 h-12 border border-gray-300 rounded-full"
                    />
                    <div className="ml-4 relative">
                        <div
                            className="font-semibold flex items-center gap-2 cursor-pointer"
                            onClick={() => setOpen(!open)}
                        >
                            <span className="flex items-center">{userLogin?.name}
                                {userLogin?.verifier && <CheckCircle className="text-blue-500 ml-2" />}
                            </span>
                            <KeyboardArrowDown
                                className={`transition-transform duration-300 ${open ? "rotate-180 text-purple-600" : ""}`}
                            />
                        </div>
                        <span className="text-sm text-gray-500">ID: {userLogin?.id}</span>

                        <div
                            ref={dropdownRef}
                            className={`absolute z-10 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden transform transition-all duration-200 origin-top ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                                }`}
                        >
                            <div className="py-2 px-4 bg-white font-semibold flex flex-col gap-2">
                                <Link to='info' className="py-2 px-4 hover:bg-gray-100 cursor-pointer rounded-4xl">Thông tin</Link>
                                <span onClick={handleLogout} className="py-2 px-4 hover:bg-gray-100 cursor-pointer rounded-4xl">Đăng xuất</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`flex items-center p-5 rounded-2xl shadow-md ${card.bg}`}
                        >
                            <div className="p-3 rounded-full bg-white shadow-sm mr-4">
                                {card.icon}
                            </div>
                            <div>
                                <h4 className="text-sm text-gray-500">{card.title}</h4>
                                <p className="text-xl font-bold text-gray-800">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Overview;
