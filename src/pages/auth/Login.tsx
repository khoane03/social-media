import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    setAccessToken,
    setRefreshToken,
    getUsername,
    getPassword,
    setUsername as saveUsername,
    setPassword as savePassword,
} from "../../service/localStoreService";
import {
    Person,
    RemoveRedEyeOutlined,
    VisibilityOffOutlined
} from "@mui/icons-material";
import Alert from "../../components/alert/Alert";
import { useStomp } from "../../context/WsContext";
import AuthService from "../../service/AuthService";


export default function Login() {

    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [remember, setRemember] = useState<boolean>(false);
    const navigate = useNavigate();
    const { connect, isConnected } = useStomp();

    useEffect(() => {
        document.title = "Đăng nhập";
        const username1 = getUsername();
        const password2 = getPassword();
        if (username1 && password2) {
            setUsername(username1);
            setPassword(password2);
            setRemember(true);
        }
    }, []);

    const login = async () => {
        try {
            const response = await AuthService.login(username, password);
            setError("");
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            if (!isConnected) {
                connect(response.data.accessToken);
            }

            if (remember) {
                saveUsername(username);
                savePassword(password);
            } else {
                saveUsername("");
                savePassword("");
            }
            navigate("/");
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
                    <h1 className="text-4xl font-extrabold text-white">Chào bạn, trở lại!</h1>
                    <p className="text-center text-gray-200 text-lg border-b">
                        Rất vui khi được gặp lại bạn. Đăng nhập để tiếp tục nhé!
                    </p>
                </div>
                <span className="text-center text-gray-200 text-sm">
                    Bạn chưa có tài khoản, quên mât khẩu? Hãy chọn một trong các lựa chọn dưới đây.
                </span>
                <div className="flex">
                    <Link
                        to="/auth/register"
                        className="mr-2 border p-2 text-center bg-transparent text-white rounded-lg font-semibold shadow-lg hover:bg-white hover:text-purple-600">
                        Đăng ký tài khoản
                    </Link>
                    <Link
                        to="/auth/forgot"
                        className=" text-center p-2 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600">
                        Quên mật khẩu
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
                    <div className="text-left my-4 flex items-center">
                        <input
                            type="checkbox"
                            className="accent-purple-500 ml-2"
                            checked={remember}
                            onChange={() => setRemember((prev) => !prev)}
                        />
                        <span className="ml-2">Nhớ mật khẩu</span>
                    </div>
                    <button
                        type="submit"
                        onClick={login}
                        className="w-full py-2 rounded-xl bg-purple-500 text-white font-bold shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300">
                        Đăng nhập
                    </button>

                    <div className="md:hidden mt-4 flex justify-between">
                        <Link
                            to="/auth/register"
                            className="mr-2 text-center text-[10px] w-full p-2 rounded-md bg-purple-500 text-white font-bold shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300">
                            Đăng ký tài khoản
                        </Link>
                        <Link
                            to="/auth/forgot"
                            className="text-[10px] text-center w-full p-2 rounded-md bg-purple-500 text-white font-bold shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300">
                            Quên mật khẩu
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
