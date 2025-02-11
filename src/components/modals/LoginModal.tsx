import { Button, Modal } from "flowbite-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "~/utils/authContext";
import { showToast } from "~/utils/showToast";
import { authenticateUser } from "~/utils/authentication";
import Link from "next/link";
import { createUser } from "~/utils/user";

/**
 * 
 * @returns 
 */
export default function LoginModal() {
    // Authentication
    const { login, showAuthModal, setShowAuthModal } = useAuth();

    // Routing
    const router = useRouter();

    // States
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "", 
        passwordConfirm: ""
    });
    const [isLoading, setIsLoading] = useState(true)

    // Handlers
    const handleUserLogin = async () => {
        setIsLoading(true)
        const response = await authenticateUser(formData.email, formData.password);
        const newToken = response ? (response.result ? response.result.token : "") : "";
        setIsLoading(false)
        
        if (newToken && newToken !== "NULL") {
            login(newToken);
            showToast("success", "Successfully logged in.")
            // router.replace(router.asPath) // Reload page to use authentication
        } else {
            showToast("error", "Your credentials are not correct.")
        }
    }

    const handleUserRegister = async () => {
        setIsLoading(true)
        const response = await createUser(formData.firstName, formData.lastName, formData.email, formData.password)
        
    }
    
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleClose = () => {
        setShowAuthModal(false)
        router.push("/")
    }

    return (
        <>
            <Modal show={showAuthModal} onClose={handleClose} size="lg">
                <Modal.Header>
                    Log in
                </Modal.Header>
                <Modal.Body className="flex flex-col justify-center items-center">
                    <div className="mb-4 w-full">
                        <label htmlFor="email" className="block mb-2">Email:</label>
                        <input 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="border rounded p-2 w-full text-black"
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <label htmlFor="password" className="block mb-2">Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className="border rounded p-2 w-full text-black"
                        />
                    </div>

                    <Link onClick={handleClose} href="/user" passHref className="mt-4">
                        <span>Or <span className="text-blue-900 underline">register here</span></span>
                    </Link>
                </Modal.Body>
                <Modal.Footer className="flex justify-center gap-3">
                    <Button onClick={handleUserLogin}>Log in</Button>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};
