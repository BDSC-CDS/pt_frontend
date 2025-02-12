import { Button, Modal } from "flowbite-react"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "~/utils/authContext"
import { authenticateUser } from "~/utils/authentication"
import { createUser } from "~/utils/user"
import { showToast } from "~/utils/showToast"
import Spinner from "../ui/Spinner"
import { ResponseError } from "~/internal/client"
import InputField from "../ui/InputField"
import { z } from "zod"

interface LogoutModalProps {
    show: boolean
    onClose: () => void
}


/**
 * Confirmation modal to log out.
 */
export default function LogoutModal({ show, onClose }: LogoutModalProps) {
    const router = useRouter()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        onClose()
        showToast("success", "Successfully logged out.")
        router.push("/")   
    };

    return (
        <Modal show={show} onClose={onClose} size="lg">
            <Modal.Header>Log out</Modal.Header>
            <Modal.Body>
                <p className="text-center ">Do you want to log out ?</p>
            </Modal.Body>

            <Modal.Footer className="flex justify-center gap-3">
                <Button onClick={handleLogout}>
                    Yes
                </Button>
                <Button onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )   
}