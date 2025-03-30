import AxiosService from './AxiosService';

const login = (username: string, password: string) => {
    return AxiosService.post('/auth/login', { username, password });
}

const refreshToken = (refreshToken: string) => {
    return AxiosService.post('/auth/refresh', { refreshToken });
}

const register = (data: object) => {
    return AxiosService.post('/auth/register', data);
}

const verifyOtp = (email: string, otpCode: string) => {
    return AxiosService.post('/auth/verify-otp', { email, otpCode });
}

const sendOtp = (email: string) => {
    return AxiosService.post('/auth/send-otp', { email });
}

const logout = () => {
    return AxiosService.post('/auth/logout');
}

const forgotPassword = (data: object) => {
    return AxiosService.post('/auth/recovery-password', { data });
}

export {
    login,
    refreshToken,
    register,
    verifyOtp,
    sendOtp,
    logout, 
    forgotPassword
};