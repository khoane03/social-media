import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Person,
    RemoveRedEyeOutlined,
    VisibilityOffOutlined
} from "@mui/icons-material";
import AuthService from "../../../service/AuthService";
import Alert from "../../alert/Alert";
import { setAccessToken, setRefreshToken } from "../../../service/localStoreService";
import UserService from "../../../service/UserService";


export default function Login() {

    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [roles, setRoles] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Đăng nhập";
    }, []);

    const login = async () => {
        try {
            const response = await AuthService.login(username, password);
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            setError("");
            const userInfo = await UserService.getInfo();
            const roles: string[] = userInfo.data.role;

            if (roles.includes("ROLE_ADMIN")) {
                navigate("/dashboard");
            } else if (roles.includes("ROLE_USER")) {
                setError("Tài khoản không có quyền truy cập vào trang quản trị.");
                navigate("/no-permission");
            } else {
                setError("Tài khoản không có quyền phù hợp.");
                navigate("/no-permission");
            }

        } catch (err: any) {
            console.log(err.response);
            const errorMessage = err.response?.data.errMess || "Lỗi server. Vui lòng thử lại.";
            setError(errorMessage);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <>
            {error && <Alert message={error} type="error" onClose={() => setError("")} />}
            <div className="md:flex hidden shadow-lg absolute animate-slide-right bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white w-[50%] h-full flex-col justify-center items-center rounded-tr-[150px] rounded-br-[100px] px-6 py-10 space-y-6">
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-white">Hệ thống quản trị</h1>
                    <p className="text-center text-gray-200 text-lg border-b">
                        Vui lòng đăng nhập để truy cập bảng điều khiển quản trị.
                    </p>
                </div>

                <div className="flex">
                    <Link
                        to="/auth"
                        className="mr-2 border p-2 text-center bg-transparent text-white rounded-lg font-semibold shadow-lg hover:bg-white hover:text-purple-600">
                        Đăng nhập người dùng
                    </Link>

                </div>
            </div>
            <div className="absolute animate-move flex flex-col justify-center items-center inset-0 md:inset-auto md:translate-x-[180%] md:translate-y-1/2">
                <div className=" ">
                    <h2 className="text-2xl font-bold text-center mb-4">Đăng nhập</h2>
                    <div className="mb-4 flex items-center border rounded-xl shadow-sm">
                        <input
                            type="text"
                            placeholder="Tài khoản"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full px-4 py-2 border-none outline-none'
                        />
                        <Person className="mx-2" />
                    </div>
                    <div className="mb-4 flex items-center border rounded-xl shadow-sm">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            className='w-full px-4 py-2 border-none outline-none'
                        />
                        <span
                            className="ml-2 mr-2 cursor-pointer"
                            onClick={togglePasswordVisibility}>
                            {showPassword ? <RemoveRedEyeOutlined /> : <VisibilityOffOutlined />}
                        </span>
                    </div>
                    <button
                        type="submit"
                        onClick={login}
                        className="w-full py-2 rounded-xl bg-purple-500 text-white font-bold shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300">
                        Đăng nhập
                    </button>
                </div>
            </div>
        </>
    );
}
