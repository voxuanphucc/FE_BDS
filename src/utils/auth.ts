import { jwtDecode } from "jwt-decode";

// utils/auth.ts
export const isTokenValid = (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.removeItem('token');
        return false;
    }
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        return exp > now;
    } catch (error) {
        return false;
    }
};
export interface UserPayload {
    userId: string;
    userName: string;
    avatarUrl: string;
}

export const getUserFromToken = (): UserPayload | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode<UserPayload>(token);
        return {
            userId: decoded.userId,
            userName: decoded.userName,
            avatarUrl: decoded.avatarUrl
        };
    } catch (error) {
        return null;
    }
};
