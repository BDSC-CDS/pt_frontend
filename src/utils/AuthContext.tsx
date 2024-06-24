import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';
import { getMyUser } from "./user";

// Define the type for the context value
type AuthContextType = {
    isLoggedIn: boolean;
    isAdmin: boolean;
    login: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Type for AuthProvider component props
type AuthProviderProps = {
    children: ReactNode; // ReactNode allows any valid React child (element, string, etc.)
};

// AuthProvider component: provides authentication context to child components
export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
    const [isAdmin, setAdmin] = useState<boolean>(false);

    // Login function to set the user's token and update login status
    const login = async (token: string) => {
        localStorage.setItem('token', token); // Store the user token in localStorage
        setLoggedIn(true); // Update login status to true
        const response = await getMyUser();
        const roles = response?.result?.me?.roles || [];
        const isAdmin = roles.includes('admin');
        setAdmin(isAdmin); // Update login status to true
    };

    // Logout function to remove the user's token and update login status
    const logout = () => {
        localStorage.removeItem('token'); // Remove the user token from localStorage
        setLoggedIn(false); // Update login status to false
    };

    // Render the AuthContext.Provider with the current state and functions
    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
            {children} {/* Render children components passed to this provider */}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext); 
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context; 
};

export const getAuthInitOverrides = (): RequestInit => {
    let headers: HeadersInit = [];
    if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        if (token) {
            headers = [['Authorization', 'Bearer ' + token]];
        }
    }
    return {headers};
}
