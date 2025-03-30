export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';
export const EMAIL = 'email';
export const USERNAME = 'user';
export const PASSWORD = 'pass';

export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN);
}

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN);
}

export const setAccessToken = (accessToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
}

export const setRefreshToken = (refreshToken: string): void => {
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
}

export const removeAccessToken = (): void => {
    localStorage.removeItem(ACCESS_TOKEN);
}

export const removeRefreshToken = (): void => {
    localStorage.removeItem(REFRESH_TOKEN);
}

export const getEmailLocal = (): string | null => {
    return localStorage.getItem(EMAIL);
}

export const setEmailLocal = (email: string): void => {
    localStorage.setItem(EMAIL, email);
}

export const removeEmail = (): void => {
    localStorage.removeItem(EMAIL);
}

export const getUsername = (): string | null => {
    return localStorage.getItem(USERNAME);
}

export const setUsername = (username: string): void => {
    localStorage.setItem(USERNAME, username);
}

export const getPassword = (): string | null => {
    return localStorage.getItem(PASSWORD);
}

export const setPassword = (pass: string): void => {
    localStorage.setItem(PASSWORD, pass);
}
