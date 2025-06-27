import { useState, useEffect, useCallback } from 'react';
import { getEmailLocal, removeEmail, setEmailLocal } from '../../service/localStoreService';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../components/alert/Alert';
import AuthService from '../../service/AuthService';
import AppConstant from '../../utils/constant/AppConstant';

function Register() {
    const [data, setData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: getEmailLocal() || '',
        phone: '',
    });

    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isVerify, setIsVerify] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpVisible, setOtpVisible] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [otpInvalid, setOtpInvalid] = useState('');
    const [resendTime, setResendTime] = useState(60);
    const [canResend, setCanResend] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = isVerify ? 'Đăng ký tài khoản' : 'Xác thực email';
    }, [isVerify]);

    // Xử lý thay đổi input trong form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        setMessage(null);
    };

    // Gửi yêu cầu đăng ký
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await AuthService.register(data);
            setError(false);
            removeEmail();
            setMessage('Đăng ký thành công!');
            setTimeout(() => navigate('/auth'), 2000);
        } catch (error: any) {
            setError(true);
            setMessage(error.response?.data?.errMess || AppConstant.ERR_SERVER);
        } finally {
            setLoading(false);
        }
    };

    // Gửi OTP qua email
    const handleSendOtp = useCallback(async () => {
        if (!canResend) return;
        setLoading(true);
        try {
            await AuthService.sendOtp(email);
            setOtpVisible(true);
            setCanResend(false);
            setResendTime(60);

            // Giảm thời gian gửi lại OTP
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
        } catch (error: any) {
            setEmailError(error.response?.data?.errMess || AppConstant.ERR_SERVER);
            setOtpVisible(false);
            setEmail('');
        } finally {
            setLoading(false);
        }
    }, [email, canResend]);

    // Xác thực OTP
    const handleVerifyOtp = useCallback(async () => {
        setLoading(true);
        try {
            await AuthService.verifyOtp(email, otp);
            setEmailLocal(email);
            setIsVerify(true);
            setOtpInvalid('');
        } catch (error: any) {
            setOtpInvalid(error.response?.data?.errMess || AppConstant.ERR_SERVER);
        } finally {
            setLoading(false);
        }
    }, [email, otp]);

    // Render form xác thực email
    const renderEmailVerification = () => (
        <div className="p-2 space-y-4">
            <h2 className="text-2xl font-bold text-center text-purple-500">Xác thực email</h2>
            <input
                type="email"
                className={`w-full px-4 py-2 bg-white border rounded-xl focus:outline-none focus:ring-2 ${emailError ? 'border-red-500' : 'border-gray-200'
                    } focus:ring-pink-200`}
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                disabled={loading}
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

            {otpVisible && (
                <div className="space-y-2">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border-gray-200 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200"
                        placeholder="Nhập OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                        disabled={loading}
                    />
                    {otpInvalid && <p className="text-red-500 text-sm">{otpInvalid}</p>}
                </div>
            )}

            <button
                className={`w-full py-2 rounded-xl font-bold text-white ${loading ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'
                    } focus:outline-none focus:ring-2 focus:ring-purple-300`}
                onClick={otpVisible ? handleVerifyOtp : handleSendOtp}
                disabled={loading || !email}
            >
                {loading ? 'Đang xử lý...' : otpVisible ? 'Xác thực' : 'Gửi OTP'}
            </button>

            {otpVisible && (
                <p className="text-center text-gray-500 text-sm">
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
    );
    // Render form đăng ký
    const renderRegisterForm = () => (
        <div className="p-2 space-y-4">
            <h2 className="text-2xl font-bold text-center">Đăng ký tài khoản</h2>
            <form onSubmit={handleRegister} className="space-y-3">
                {[
                    { name: 'name', placeholder: 'Họ và tên', type: 'text' },
                    { name: 'username', placeholder: 'Tên người dùng', type: 'text' },
                    { name: 'email', placeholder: 'Email', type: 'email', value: getEmailLocal(), disabled: true },
                    { name: 'phone', placeholder: 'Số điện thoại', type: 'tel' },
                    { name: 'password', placeholder: 'Mật khẩu', type: 'password' },
                    { name: 'confirmPassword', placeholder: 'Xác nhận mật khẩu', type: 'password' },
                ].map((field) => (
                    <input
                        key={field.name}
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={field.value || data[field.name as keyof typeof data]}
                        onChange={handleChange}
                        disabled={loading || field.disabled}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                ))}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 text-white font-bold rounded-lg ${loading ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-600'
                        }`}
                >
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
            </form>
        </div>
    );


    return (
        <div className="flex min-h-screen">
            {message && (
                <Alert message={message} type={error ? "error": "success"} onClose={() => setMessage(null)} />
            )}
            <div className="md:w-[50%] w-full p-6 animate-move">
                {isVerify ? renderRegisterForm() : renderEmailVerification()}
            </div>
            <div className="translate-x-full inset-0 md:flex hidden shadow-lg absolute animate-slide-left bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white w-[50%] h-full flex-col justify-center items-center rounded-tl-[150px] rounded-bl-[100px] px-6 py-10 space-y-">
                <h1 className="text-4xl font-extrabold">Chào mừng!</h1>
                <p className="text-center text-gray-200 text-lg border-b pb-2">
                    Rất vui khi được gặp bạn. Đăng ký để tiếp tục nhé!
                </p>
                <span className="text-center text-gray-200 text-sm my-2">
                    Nếu bạn đã có tài khoản, hãy đăng nhập ngay bây giờ.
                </span>
                <Link
                    to="/auth"
                    className="border p-2 text-center bg-transparent text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600"
                >
                    Đăng nhập
                </Link>
            </div>
        </div>
    );
}

export default Register;
