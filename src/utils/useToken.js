import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        if (tokenString === "undefined") {
            console.log("Token is undefined")
        }
        const userToken = JSON.parse(tokenString);
        return userToken?.token;
    };

    const getUserId = () => {
        const userIdString = localStorage.getItem('userId');
        return userIdString ? JSON.parse(userIdString) : null;
    };

    const [token, setToken] = useState(getToken());
    const [userId, setUserId] = useState(getUserId());

    const saveToken = (userToken) => {
        localStorage.setItem('token', JSON.stringify(userToken.token));
        localStorage.setItem('userId', JSON.stringify(userToken.userId));
        setToken(userToken.token);
        setUserId(userToken.userId);
    };

    const clearToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return {
        setToken: saveToken,
        clearToken,
        token,
        userId,
    };
}
