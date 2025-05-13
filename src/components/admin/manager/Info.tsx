import { FC, useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import UserService from "../../../service/UserService";
import { CheckCircle } from "@mui/icons-material";
import AuthService from "../../../service/AuthService";
import Alert from "../../alert/Alert";

interface Account {
    id: string;
    name: string;
    username: string;
    status: string;
    avatarUrl: string | null;
    email: string;
    phone: string;
    age: number;
    address: string | null;
    gender: string | null;
    role: string[];
    verifier: boolean;
}

const Info: FC = () => {
    const [account, setAccount] = useState<Account | null>(null);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await UserService.getInfo();
                setAccount(response.data);
                setData((prev) => ({
                    ...prev,
                    email: response.data.email,
                }));
            } catch (error) {
                setError(true);
                setMessage("Lỗi khi tải thông tin tài khoản");
            }
        };

        fetchAccount();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        setMessage("");
        setError(false);

        if (!data.password || !data.confirmPassword) {
            setMessage("Vui lòng nhập đầy đủ thông tin.");
            setError(true);
            return;
        }

        if (data.password !== data.confirmPassword) {
            setMessage("Mật khẩu không khớp.");
            setError(true);
            return;
        }

        try {
            await AuthService.forgotPassword(data)
            setMessage("Đổi mật khẩu thành công.");
            setShowChangePassword(false);
            setError(false);
            setData({ ...data, password: "", confirmPassword: "" });
        } catch (err) {
            console.error("Change password error:", err);
            setMessage("Đổi mật khẩu thất bại.");
            setError(true);
        }
    };

    if (!account) {
        return <div className="text-center py-10 text-gray-500">Đang tải thông tin...</div>;
    }

    return (
        <>
            {message && (
                <Alert
                    type={error ? "error" : "success"}
                    message={message}
                    onClose={() => setMessage("")}
                />
            )}
            <div className="bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl p-8 w-full max-w-3xl mx-auto transition duration-300 mt-8">
                <div className="flex items-center space-x-6">
                    <img
                        src={account.avatarUrl || "/default.png"}
                        alt="avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-300 shadow-md"
                    />
                    <div>
                        <div className="text-2xl font-semibold text-gray-800 flex items-center">
                            <p>{account.name}</p>
                            {account.verifier && <CheckCircle className="text-blue-500 ml-2" />}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Username: {account.username}</p>
                        <p
                            className={`text-sm font-medium mt-1 ${account.status === "Active"
                                ? "text-green-600"
                                : "text-red-500"
                                }`}
                        >
                            Trạng thái: {account.status}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-[15px] text-gray-700">
                    <div className="flex items-center gap-2">
                        <EmailIcon fontSize="small" />
                        <span>{account.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PhoneIcon fontSize="small" />
                        <span>{account.phone || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BadgeIcon fontSize="small" />
                        <span>Role: {account.role.map((r) => r.replace("ROLE_", "")).join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PersonIcon fontSize="small" />
                        <span>Giới tính: {account.gender || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Tuổi:</span>
                        <span>{account.age || "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Địa chỉ:</span>
                        <span>{account.address || "Chưa cập nhật"}</span>
                    </div>
                </div>

                <div className="mt-8 border-t pt-6 border-gray-300">
                    <button
                        onClick={() => setShowChangePassword(prev => !prev)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition duration-300 shadow-sm"
                    >
                        {showChangePassword ? "Huỷ" : "Đổi mật khẩu"}
                    </button>

                    {showChangePassword && (
                        <div className="mt-6 space-y-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
                                    placeholder="Nhập lại mật khẩu"
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md"
                            >
                                Xác nhận đổi mật khẩu
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>

    );
};

export default Info;
