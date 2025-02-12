import { useAuth } from '../utils/authContext';
import { useRouter } from "next/router";
import LoginModal from "./modals/LoginModal";
import { useState } from 'react';
import { MdLogin, MdLogout } from 'react-icons/md';
import { showToast } from '~/utils/showToast';

export default function AuthWidget() {
    const router = useRouter();
    const { isLoggedIn , userInfo, logout} = useAuth();
    const [showModal, setShowModal] = useState<boolean>(false)

    const handleLogin = () => {
        setShowModal(true)
    }

    const handleLogout = () => {
        logout()
        router.push("/")
        showToast("success", "Successfully logged out.")
        setShowModal(false)
    };
    
    return (
        <>
            {isLoggedIn ?
                <button onClick={handleLogout} className="flex items-center gap-1 ml-4 px-2 py-2 hover:bg-gray-500 hover:bg-opacity-20 rounded cursor-pointer">
                    <MdLogout size={18}/>
                    <span>{userInfo && userInfo.username ? userInfo.username : "unknown"}</span>
                </button>
                :
                <button onClick={handleLogin} className="flex items-center gap-1 ml-4 px-2 py-2 hover:bg-gray-500 hover:bg-opacity-20 rounded cursor-pointer">
                    <MdLogin size={18}/>
                    <span>Log in</span>
                </button>
            }
            {!isLoggedIn && <LoginModal show={showModal} onClose={() => setShowModal(false)}/>}
        </>
    )
};