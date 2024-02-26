import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from '../utils/AuthContext';
import { Button, Modal } from 'flowbite-react';


export default function Header() {
    // State to control visibility of the logout notification
    const [visible, setVisible] = useState<boolean>(false);
    // Extract isLoggedIn and logout function from useAuth hook
    const { isLoggedIn, logout } = useAuth();

    // Handler for the logout process
    const handleLogout = () => {
        logout(); // Perform logout
        setVisible(true); // Show logout notification
    };

    // Handler to close the logout notification
    const closePopup = () => {
        setVisible(false); // Hide logout notification
    }

    const logoStyle = {
        backgroundImage: `url('/sphn-logo.png')`
    };

    return (
        <>
            <header className="text-[#306278] bg-[#e2ebf5] fixed top-0 left-0 right-0 z-20">
                <nav className="flex h-14">
                    <div style={logoStyle} className="w-14 h-12 my-auto ml-10 m-2 bg-no-repeat bg-contain bg-center">
                    </div>
                    <div className="container ml-[116px] mr-auto flex justify-between py-4 px-6 text-right gap-6 align-middle">
                        <div className="w-full gap-6 align-top">
                            <Link href="/" passHref className="ml-3">
                                <span className="px-3 py-2 hover:bg-gray-500 hover:bg-opacity-20 rounded cursor-pointer">Home</span>
                            </Link>
                            <Link href="/about" passHref className="ml-4">
                                <span className="px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded cursor-pointer">About</span>
                            </Link>
                            <Link href="/contact" passHref className="ml-4">
                                <span className="px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded cursor-pointer">Contact</span>
                            </Link>
                            {/* Register link */}
                            {/* <Link href="/user" passHref className="ml-4">
                                <span className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">Register</span>
                            </Link> */}
                            {/* Conditional rendering based on login status */}
                            {isLoggedIn ?
                                <span onClick={handleLogout} className="ml-4 px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded underline cursor-pointer">Log out</span>
                                :
                                <Link href="/authenticate" passHref className="ml-4">
                                    <span className="px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded cursor-pointer">Log in</span>
                                </Link>}

                        </div>
                    </div>
                </nav>
            </header>

            <main>
                <Modal show={visible} onClose={() => setVisible(false)}>
                    <Modal.Body>
                        <div className="space-y-6">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                You are logged out!
                            </p>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setVisible(false)}>Close</Button>

                    </Modal.Footer>
                </Modal>

            </main>
        </>
    )
};
