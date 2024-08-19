import { InitOverrideFunction, HTTPRequestInit, RequestOpts } from '../internal/client/index';
import React, { createContext, useContext, useEffect, useState, ReactNode, FunctionComponent } from 'react';
import { getMyUser } from "./user";

type AuthContextType = {
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (token: string) => void;
    logout: () => void;
    token: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
    children: ReactNode;
};

import dynamic from 'next/dynamic';

type ClientOnlyProps = { children: JSX.Element };
const ClientOnly = (props: ClientOnlyProps) => {
    const { children } = props;

    return children;
};

export default dynamic(() => Promise.resolve(ClientOnly), {
    ssr: false,
});

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");
    const [isAdmin, setAdmin] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') { // Ensure this code only runs on the client side
            const t = localStorage.getItem('token');
            if (t) {
                login(t)
            } else {
                logout();
            }
        }
    }, []);

    const checkAdminStatus = async () => {
        const r = getMyUser();
        const response = await r;
        const roles = response?.result?.me?.roles || [];
        setAdmin(roles.includes('admin'));
    };

    const login = async (t: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', t);
            setLoggedIn(true);
            setToken(t);
            checkAdminStatus();
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            setLoggedIn(false);
            setToken('');
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const getAuthInitOverrides = (): InitOverrideFunction => {
    return async (requestContext: { init: HTTPRequestInit, context: RequestOpts }) => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const token = localStorage.getItem('token');
            if (token) {
                if (!requestContext.init.headers) {
                    requestContext.init.headers = {};
                }
                requestContext.init.headers['Authorization'] = 'Bearer ' + token;
            }
        }
        return requestContext.init;
    }
}

// Define global logout function
export const globalLogout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/authenticate'; // Redirect to login page
    }
};

// Intercept fetch globally
if (typeof window !== 'undefined') { // Ensure this only runs on the client side
    const originalFetch = window.fetch;

    window.fetch = async (url, options) => {
        const response = await originalFetch(url, options);
        if (response.status === 401 || response.status === 403) {
            globalLogout(); // Call global logout function when token is invalid
        }
        return response;
    };
}
