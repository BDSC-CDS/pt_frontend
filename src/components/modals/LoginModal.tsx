import { Button, Modal } from "flowbite-react";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "~/utils/authContext";
import { authenticateUser } from "~/utils/authentication";
import Link from "next/link";
import { createUser } from "~/utils/user";
import { showToast } from "~/utils/showToast";
import Spinner from "../ui/Spinner";

interface LoginModalProps {
    show: boolean
    onClose: () => void
}

/**
 * 
 * @returns 
 */
export default function LoginModal({show, onClose}: LoginModalProps) {
    // Authentication
    const { login} = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false)

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

    // Handlers
    const handleUserLogin = async () => {
        setIsLoading(true)
        const response = await authenticateUser(formData.email, formData.password);
        const newToken = response ? (response.result ? response.result.token : "") : "";
        
        if (newToken && newToken !== "NULL") {
            login(newToken);
            setIsLoading(false)
            showToast("success", "Successfully logged in!")
        } else {
            showToast("error", "Invalid credentials.")
        }
    }

    const handleUserRegister = async () => {
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
        onClose()
        router.push("/")
    }

    return (
        <>
            <Modal show={show} onClose={handleClose} size="lg">
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
                    <Button onClick={handleUserLogin} disabled={isLoading}>{isLoading? <Spinner/> : "Log in"}</Button>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};
