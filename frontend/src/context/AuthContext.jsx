import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            api.get('users/profile/')
                .then(res => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        const res = await api.post('users/login/', { username, password });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        const profileRes = await api.get('users/profile/');
        setUser(profileRes.data);
    };

    const register = async (userData) => {
        await api.post('users/register/', userData);
        await login(userData.username, userData.password);
    };

    const googleLogin = async (token) => {
        const res = await api.post('users/login/google/', { token });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        setUser(res.data.user);
    };

    const requestPasswordReset = async (email) => {
        await api.post('users/password-reset/', { email });
    };

    const confirmPasswordReset = async (token, password) => {
        await api.post('users/password-reset/confirm/', { token, password });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, requestPasswordReset, confirmPasswordReset, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
