import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';

// Define the type for the context value
type AuthContextType = {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
};

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | null>(null);

// Type for AuthProvider component props
type AuthProviderProps = {
    children: ReactNode; // ReactNode allows any valid React child (element, string, etc.)
};

// AuthProvider component: provides authentication context to child components
export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false); // State to track login status

    // Login function to set the user's token and update login status
    const login = (token: string) => {
        localStorage.setItem('token', token); // Store the user token in localStorage
        setLoggedIn(true); // Update login status to true
    };

    // Logout function to remove the user's token and update login status
    const logout = () => {
        localStorage.removeItem('token'); // Remove the user token from localStorage
        setLoggedIn(false); // Update login status to false
    };

    // Render the AuthContext.Provider with the current state and functions
    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children} {/* Render children components passed to this provider */}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext); // Access the context
    if (!context) {
        // Throw an error if the hook is used outside of the AuthProvider
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context; // Return the auth context
};
