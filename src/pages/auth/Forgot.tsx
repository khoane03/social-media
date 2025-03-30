import { useState } from "react";
import {sendOtp, verifyOtp} from "../../service/AuthService"
export default function Forgot() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTime, setResendTime] = useState(60);
    const [canResend, setCanResend] = useState(true);
    const [showOtpInput, setShowOtpInput] = useState(false);

    // Hàm gửi yêu cầu OTP
    const handleSendOtp = async () => {
        if (!email) {
            setMessage("Vui lòng nhập email!");
            return;
        }
        setLoading(true);
        try {
            await sendOtp(email);
            setShowOtpInput(true);
            setCanResend(false);
            startResendCountdown();
        } catch (error) {
            setMessage("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            await verifyOtp(email, otp);
            setMessage("Xác nhận thành công!");
        } catch (error) {
            
        }
    };

    // Hàm bắt đầu đếm ngược resend OTP
    const startResendCountdown = () => {
        setResendTime(60);
        const countdown = setInterval(() => {
            setResendTime((prev) => {
                if (prev === 1) {
                    clearInterval(countdown);
                    setCanResend(true);
                    return 60;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Quên mật khẩu</h1>
            <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border rounded-lg mb-2 w-80"
            />
            {showOtpInput && (
                <input
                    type="text"
                    placeholder="Nhập OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="px-4 py-2 border rounded-lg mb-2 w-80"
                />
            )}
            <button
                onClick={handleSendOtp}
                disabled={loading}
                className={`px-4 py-2 rounded-lg w-80 text-white ${
                    loading ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-600"
                }`}
            >
                {loading ? "Đang xử lý..." : showOtpInput ? "Xác nhận OTP" : "Gửi mã xác nhận"}
            </button>

            {showOtpInput && (
                <p className="text-center text-gray-500 text-sm mt-2">
                    {canResend ? (
                        <button onClick={handleSendOtp} className="text-purple-500 font-semibold">
                            Gửi lại OTP
                        </button>
                    ) : (
                        `Gửi lại sau ${resendTime}s`
                    )}
                </p>
            )}

            {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
        </div>
    );
}
