import { InitOverrideFunction, HTTPRequestInit, RequestOpts } from '../internal/client/index';
import React, { createContext, useContext, useEffect, useState, ReactNode, FunctionComponent, useCallback } from 'react';
import { getMyUser } from "./user";
import { jwtDecode } from 'jwt-decode';

type UserInfo = {
    token: string;
    email: string;
    username: string;
    roles: string[];
    isAdmin: boolean;
}

type AuthContextType = {
    isLoggedIn: boolean;
    userInfo: UserInfo | null;
    isLoading: boolean;
    isAuthModalOpen: boolean;
    login: (token: string) => void;
    logout: () => void;
    hideAuthModal: () => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

// Authentication global context
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Authentication Provider with specific logic for login and logout.
 */
export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    
    const login = async (token: string) => {
        localStorage.setItem('token', token);
        setLoggedIn(true);
        try {
            const response = await getMyUser();
            const user = response?.result?.me;
            if (user) {
                const updatedUserInfo: UserInfo = {
                    token: token,
                    email: user.email || "",
                    username: user.username || "",
                    roles: user.roles || [],
                    isAdmin: (user.roles || []).includes("admin"),
                };
    
                setUserInfo(updatedUserInfo);
            }
        } catch (error) {
            console.error("Error retrieving user info:", error);
            logout()
        } finally {
            setIsAuthModalOpen(false)
            setIsLoading(false)
        }
    };

    const logout = () => {
        localStorage.removeItem('token')
        setLoggedIn(false);
        setUserInfo(null)
        setIsAuthModalOpen(false)
        setIsLoading(false)
    };

    const hideAuthModal = () => {
        setIsAuthModalOpen(false)
    }

    const isTokenExpired = (token: string) => {
        try {
            const decodeToken = jwtDecode<{name: string, exp: number}>(token)
            const currentTime = Date.now() / 1000
            return decodeToken.exp < currentTime
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    }

    const checkAuth = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
            logout();
            setIsAuthModalOpen(true)
            return;
        }

        if (!isLoggedIn) {
            login(token)
        }
    }, [isLoggedIn, login, logout, hideAuthModal]);

    // Sync auth status across multiple windows
    useEffect(() => {
        if (typeof window === 'undefined') { // Ensure this code only runs on the client side
            return
        }
        // run checkAuth every page visit
        checkAuth();
    
        // run checkAuth every focus changes
        window.addEventListener('focus', checkAuth);
        return () => {
            window.removeEventListener('focus', checkAuth);
        };
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, userInfo, isLoading, isAuthModalOpen, login, logout, hideAuthModal}}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom useAuth React hook to get the Authentication context
 * @returns the AuthContext
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

/**
 * Adds the Authorization header with a token from localStorage to HTTP requests if available
 */
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