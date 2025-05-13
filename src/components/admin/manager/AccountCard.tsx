import { FC, useEffect, useRef, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UserService from "../../../service/UserService";
import Alert from "../../alert/Alert";
import Accept from "../../popup/Accept";
import Pagination from "./Pagination";

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

const AccountTable: FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [confirmAction, setConfirmAction] = useState<{ action: string; userId: string } | null>(null);
    const [page, setPage] = useState<{ currentPage: number; totalPages: number }>({ currentPage: 1, totalPages: 1 });
    const currentPage = useRef<number>(1);
    const pageSize = 5;

    const fetchAccounts = async (pageNum = 1) => {
        try {
            const response = await UserService.getAllUsers(String(pageNum), String(pageSize));
            setAccounts(response.data);
            setPage({ currentPage: pageNum, totalPages: response.totalPages });
        } catch (err) {
            setError(true);
            setMessage("Lỗi khi tải danh sách tài khoản");
        }
    };

    const handleAction = async (action: string, userId: string) => {
        try {
            switch (action) {
                case "verifier":
                    await UserService.verifyUser(userId);
                    setMessage("Xác minh tài khoản thành công");
                    break;
                case "status":
                    await UserService.changeStatus(userId);
                    setMessage("Cập nhật trạng thái thành công");
                    break;
                case "delete":
                    await UserService.deleteUser(userId);
                    setMessage("Xoá tài khoản thành công");
                    break;
                default:
                    setError(true);
                    setMessage("Thao tác không hợp lệ");
                    return;
            }
            setError(false);
            await fetchAccounts(currentPage.current); // reload current page
        } catch (err: any) {
            setError(true);
            setMessage(err.response?.data?.message || "Đã có lỗi xảy ra");
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handlePageChange = (newPage: number) => {
        currentPage.current = newPage;
        fetchAccounts(newPage);
    };

    return (
        <>
            {message && (
                <Alert type={error ? "error" : "success"} message={message} onClose={() => setMessage("")} />
            )}
            {confirmAction && (
                <Accept
                    action={confirmAction.action}
                    isAccept={() => {
                        handleAction(confirmAction.action, confirmAction.userId);
                        setConfirmAction(null);
                    }}
                    isReject={() => setConfirmAction(null)}
                />
            )}

            <div className="flex flex-col min-h-screen w-full justify-between p-4">
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                        <tr>
                            <th className="text-center p-3">Ảnh</th>
                            <th className="text-center p-3">Tên</th>
                            <th className="text-center p-3">Tài khoản</th>
                            <th className="text-center p-3">Email</th>
                            <th className="text-center p-3">SĐT</th>
                            <th className="text-center p-3">Trạng thái</th>
                            <th className="text-center p-3">Vai trò</th>
                            <th className="text-center p-3">Xác minh</th>
                            <th className="text-center p-3">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((acc) => (
                            <tr key={acc.id} className="hover:bg-gray-50 border-t border-gray-100 text-center">
                                <td className="p-3">
                                    <img
                                        src={acc.avatarUrl || "/default.png"}
                                        alt={acc.name}
                                        className="w-10 h-10 rounded-full object-cover border mx-auto"
                                    />
                                </td>
                                <td className="p-3 font-medium text-gray-800">{acc.name}</td>
                                <td className="p-3 text-gray-600">{acc.username}</td>
                                <td className="p-3 text-gray-600">{acc.email}</td>
                                <td className="p-3 text-gray-600">{acc.phone || "Chưa cập nhật"}</td>

                                <td className="p-3">
                                    <button
                                        onClick={() => setConfirmAction({ action: "status", userId: acc.id })}
                                        className={`text-xs px-3 py-1 rounded-full font-medium transition ${acc.status === "Active"
                                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                                : "bg-green-100 text-green-600 hover:bg-green-200"
                                            }`}
                                    >
                                        {acc.status === "Active" ? "Chặn" : "Mở khóa"}
                                    </button>
                                </td>

                                <td className="p-3 text-gray-600">
                                    {acc.role.map((r) => r.replace("ROLE_", "")).join(", ")}
                                </td>

                                <td className="p-3">
                                    <div className="flex flex-col items-center gap-2">
                                        {acc.verifier ? (
                                            <CheckCircleIcon className="text-green-500" />
                                        ) : (
                                            <CancelIcon className="text-red-500" />
                                        )}
                                        <button
                                            onClick={() => setConfirmAction({ action: "verifier", userId: acc.id })}
                                            className={`text-xs px-3 py-1 rounded-full font-medium transition ${acc.verifier
                                                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                                                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                                }`}
                                        >
                                            {acc.verifier ? "Huỷ xác minh" : "Xác minh"}
                                        </button>
                                    </div>
                                </td>

                                <td className="p-3">
                                    <button
                                        onClick={() => setConfirmAction({ action: "delete", userId: acc.id })}
                                        className="text-red-500 hover:text-red-700 bg-red-200 rounded-2xl px-3 py-1 hover:bg-red-300"
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentPage={page.currentPage}
                    totalPages={page.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
};

export default AccountTable;
