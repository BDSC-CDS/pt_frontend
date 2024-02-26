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
        backgroundImage: `url('sphn-logo.png')`,
        backgroundSize: "cover",
        width:"100%",
        height:"100%",
    };

    return (
        <>
            <header className="text-[#306278] bg-[#e2ebf5] fixed top-0 left-0 right-0 z-20">
                <div style={logoStyle}>
                </div>
                <nav className="container mx-auto flex items-center justify-between py-4 px-6">
                    <div className="flex items-center gap-6 ">
                        <Link href="/" passHref>
                            <span className="px-3 py-2 hover:bg-gray-500 hover:bg-opacity-20 rounded cursor-pointer">Home</span>
                        </Link>
                        <Link href="/about" passHref>
                            <span className="px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded cursor-pointer">About</span>
                        </Link>
                        <Link href="/contact" passHref>
                            <span className="px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded cursor-pointer">Contact</span>
                        </Link>
                        {/* Register link */}
                        {/* <Link href="/user" passHref>
                            <span className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">Register</span>
                        </Link> */}
                        {/* Conditional rendering based on login status */}
                        {isLoggedIn ?
                            <button onClick={handleLogout} className="px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded underline cursor-pointer">Log out</button>
                            :
                            <Link href="/authenticate" passHref>
                                <span className="px-3 py-2 hover:bg-gray-500  hover:bg-opacity-20 rounded cursor-pointer">Log in</span>
                            </Link>}

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
