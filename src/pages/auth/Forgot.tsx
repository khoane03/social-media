import { useState, useEffect } from "react";
import AuthService from "../../service/AuthService";
import Alert from "../../components/alert/Alert";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const [loading, setLoading] = useState(false);
    const [resendTime, setResendTime] = useState(60);
    const [canResend, setCanResend] = useState(true);

    const [step, setStep] = useState<"sendOtp" | "verifyOtp" | "resetPassword">("sendOtp");

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!canResend) {
            timer = setInterval(() => {
                setResendTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanResend(true);
                        setOtp("");
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [canResend]);

    const handleSendOtp = async () => {
        if (!email) {
            setError(true);
            setMessage("Vui lòng nhập email!");
            return;
        }
        setLoading(true);
        try {
            await AuthService.sendOtp(email);
            setError(false);
            setMessage("Mã xác nhận đã được gửi tới email!");
            setStep("verifyOtp");
            setCanResend(false);
        } catch (error: any) {
            setError(true);
            setMessage(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setError(true);
            setMessage("Vui lòng nhập mã OTP!");
            return;
        }
        setLoading(true);
        try {
            await AuthService.verifyOtp(email, otp);
            setError(false);
            setMessage("Xác nhận OTP thành công, hãy đặt lại mật khẩu!");
            setOtp("");
            setStep("resetPassword");
        } catch (error: any) {
            setError(true);
            setMessage(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            setError(true);
            setMessage("Vui lòng nhập đầy đủ mật khẩu!");
            return;
        }
        if (password !== confirmPassword) {
            setError(true);
            setMessage("Mật khẩu xác nhận không trùng khớp!");
            return;
        }
        setLoading(true);
        try {
            await AuthService.forgotPassword({ email, password, confirmPassword });
            setError(false);
            setMessage("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập lại.");
            setPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                window.location.href = "/auth";
            }
            , 2000);
        } catch (error: any) {
            setError(true);
            setMessage(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = () => {
        if (step === "sendOtp") handleSendOtp();
        else if (step === "verifyOtp") handleVerifyOtp();
        else if (step === "resetPassword") handleResetPassword();
    };

    return (
        <>
            {message && <Alert type={error ? "error" : "success"} message={message} onClose={() => setMessage('')} />}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Quên mật khẩu</h1>

                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 border rounded-lg mb-2 w-80"
                    disabled={step !== "sendOtp"}
                />

                {step === "verifyOtp" && (
                    <input
                        type="text"
                        placeholder="Nhập mã OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="px-4 py-2 border rounded-lg mb-2 w-80"
                    />
                )}

                {step === "resetPassword" && (
                    <>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu mới"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-4 py-2 border rounded-lg mb-2 w-80"
                        />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="px-4 py-2 border rounded-lg mb-2 w-80"
                        />
                    </>
                )}

                <button
                    onClick={handleButtonClick}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg w-80 text-white ${loading ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-600"}`}
                >
                    {loading ? "Đang xử lý..." : step === "sendOtp" ? "Gửi mã xác nhận" : step === "verifyOtp" ? "Xác nhận OTP" : "Đặt lại mật khẩu"}
                </button>

                {step === "verifyOtp" && (
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
            </div>
        </>
    );
}
