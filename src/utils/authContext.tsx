
import { InitOverrideFunction, HTTPRequestInit,  RequestOpts } from '../internal/client/index';
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
        const t = localStorage.getItem('token');
        if (t) {
            login(t)
        } else {
            logout();
        }
    }, []);

    const checkAdminStatus = async () => {
        const r = getMyUser();
        const response = await r;
        const roles = response?.result?.me?.roles || [];
        setAdmin(roles.includes('admin'));
    };

    const login = async (t: string) => {
        localStorage.setItem('token', t); 
        setLoggedIn(true);
        setToken(t); 
        checkAdminStatus();
    };
    
    const logout = () => {
        localStorage.removeItem('token'); 
        setLoggedIn(false); 
        setToken(''); 
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

export const getAuthInitOverrides = (): InitOverrideFunction  => {
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


