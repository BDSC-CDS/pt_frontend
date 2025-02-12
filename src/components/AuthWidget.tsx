import { useAuth } from '../utils/authContext';
import { useRouter } from "next/router";
import LoginModal from "./modals/LoginModal";
import { useState } from 'react';
import { MdLogin, MdLogout } from 'react-icons/md';
import LogoutModal from './modals/LogoutModal';

export default function AuthWidget() {
    const { isLoggedIn , userInfo, logout} = useAuth();
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false)

    return (
        <>
            {isLoggedIn ?
                <button onClick={() =>setShowLogoutModal(true)} className="flex items-center gap-1 ml-4 px-2 py-2 hover:bg-gray-500 hover:bg-opacity-20 rounded cursor-pointer">
                    <MdLogout size={18}/>
                    <span>{userInfo && userInfo.username ? userInfo.username : "unknown"}</span>
                </button>
                :
                <button onClick={() =>setShowLoginModal(true)} className="flex items-center gap-1 ml-4 px-2 py-2 hover:bg-gray-500 hover:bg-opacity-20 rounded cursor-pointer">
                    <MdLogin size={18}/>
                    <span>Log in</span>
                </button>
            }
            {showLoginModal && <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)}/>}
            {showLogoutModal && <LogoutModal show={showLogoutModal} onClose={() => setShowLogoutModal(false)}/>}
        </>
    )
};