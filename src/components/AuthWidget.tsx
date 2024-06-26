import Link from "next/link";
import { useState } from "react";
import { useAuth } from '../utils/authContext';
import { Button, Modal } from 'flowbite-react';



export default function Header() {
    const [visible, setVisible] = useState<boolean>(false);

    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setVisible(true);
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
