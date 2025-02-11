import Link from "next/link";
import { useState } from "react";
import { useAuth } from '../utils/authContext';
import { Button, Modal } from 'flowbite-react';
import { showToast } from "~/utils/showToast";
import LoginModal from "./modals/LoginModal";

export default function AuthWidget() {
    const { isLoggedIn, logout } = useAuth();

    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

    const handleLogout = () => {
        logout();
        showToast("success", "Successfully logged out.")
    };
    
    return (
        <>
            {isLoggedIn ?
                <Link onClick={handleLogout} href="#" passHref className="ml-4">
                    <span className="px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded cursor-pointer">Log out</span>
                </Link>
                :
                <Link href="/authenticate" passHref className="ml-4">
                    <span className="px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded cursor-pointer">Log in</span>
                </Link>
            }
        </>
    )
};
