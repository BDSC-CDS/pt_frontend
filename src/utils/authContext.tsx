import { InitOverrideFunction, HTTPRequestInit, RequestOpts } from '../internal/client/index';
import React, { createContext, useContext, useEffect, useState, ReactNode, FunctionComponent } from 'react';
import { getMyUser } from "./user";

type AuthContextType = {
    isLoggedIn: boolean;
    userInfo: UserInfo | undefined;
    isAdmin: boolean;
    login: (token: string) => void;
    logout: () => void;
    token: string;
    showAuthModal: boolean;
    setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type AuthProviderProps = {
    children: ReactNode;
};

type UserInfo = {
    email: string
    username: string
    roles: string[]
    isAdmin?: boolean
}

// Authentication global context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider with specific logic for login and logout.
 */
export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo>()
    const [token, setToken] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

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

    useEffect(() => {
        const handleShowAuthModal = () => {
            setShowAuthModal(true);
        };
    
        window.addEventListener("showAuthModal", handleShowAuthModal);
        return () => {
            window.removeEventListener("showAuthModal", handleShowAuthModal);
        };
    }, []);

    const getUserInfo = async () => {
        try {
            const response = await getMyUser();
            const user = response?.result?.me;
            if (user) {
                const updatedUserInfo: UserInfo = {
                    email: user.email || "",
                    username: user.username || "",
                    roles: user.roles || [],
                    isAdmin: (user.roles || []).includes("admin"),
                };
    
                setUserInfo(updatedUserInfo);
                setIsAdmin((user.roles || []).includes("admin"));
            } else {
                console.warn("User data is unavailable.");
            }
        } catch (error) {
            console.error("Error retrieving user info:", error);
        }
    };

    const login = async (t: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', t);
            setLoggedIn(true);
            setToken(t);
            setShowAuthModal(false)
            getUserInfo();
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            setLoggedIn(false);
            setIsAdmin(false)
            setToken('');
            setShowAuthModal(false)
            setUserInfo(undefined)
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userInfo, isAdmin, login, logout, token, showAuthModal, setShowAuthModal }}>
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