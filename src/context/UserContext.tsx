import { createContext, useContext, useEffect, useState } from "react";
import UserService from "../service/UserService";

interface userInfo {
    address?: string | null;
    age?: number;
    dob?: string | null;
    email: string;
    gender?: string | null;
    id: string;
    name: string;
    phone?: string | null;
    role: string[];
    avatarUrl?: string | null;
    coverUrl?: string | null;
    status: string;
    username: string;
    verifier: boolean;
}

export const UserContext = createContext<{ user: userInfo | null }>({ user: null });

export const UserProvider = ({ children }: any) => {

    interface userInfo {
        address?: string | null;
        age?: number;
        dob?: string | null;
        email: string;
        gender?: string | null;
        id: string;
        name: string;
        phone?: string | null;
        role: string[];
        avatarUrl?: string | null;
        coverUrl?: string | null;
        status: string;
        username: string;
        verifier: boolean;
    }

    const [user, setUser] = useState<userInfo | null>(null);

    useEffect(() => {
        (async () => {
            const res = await UserService.getInfo();
            setUser(res.data);
        })();
    }, []);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
};
export const useUserContext = () => {
    return useContext(UserContext);
};
