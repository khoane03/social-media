import AxiosService from './AxiosService';

const login = (username: string, password: string) => {
    return AxiosService.post('/auth/login', { username, password });
}

const refreshToken = (refreshToken: string) => {
    return AxiosService.post('/auth/refresh', { refreshToken });
}

const register = (email: string, password: string) => {
    return AxiosService.post('/auth/register', { email, password });
}

const verifyOtp = (email: string, otpCode: string) => {
    return AxiosService.post('/auth/verify-otp', { email, otpCode });
}

const sendOtp = (email: string) => {
    return AxiosService.post('/auth/send-otp', { email });
}

const Logout = () => {
    return AxiosService.post('/auth/logout');
}

export default {
    login,
    refreshToken,
    register,
    verifyOtp,
    sendOtp,
    Logout
};