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

interface LoginModalProps {
    show: boolean
    onClose: () => void
}

const loginSchema = z.object({
    email: z.string().min(1,{ message: "Invalid email address." }),
    password: z.string().min(1, { message: "Invalid password." }),
})

const registerSchema = z.object({
    firstName: z.string().min(1,{ message: "Invalid first name." }),
    lastName: z.string().min(1,{ message: "Invalid last name." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords don't match.",
            path: ['confirmPassword']
        })
    }
})


/**
 * Login or register forms modal.
 */
export default function LoginModal({ show, onClose }: LoginModalProps) {
    const router = useRouter()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRegister, setIsRegister] = useState<boolean>(false)

    // Form states
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    

    // Handle login and registration
    const handleSubmit = async () => {
        setIsLoading(true)
        setErrors({})

        try {
            const schema = isRegister ? registerSchema : loginSchema
            schema.parse(formData)

            if (isRegister) {
                const response = await createUser(formData.firstName, formData.lastName, formData.email, formData.password)
                if (!response.result?.id) {
                    throw "An account with this email already exists."
                }
                showToast("success", `New user created.`)
            }

            const authResponse = await authenticateUser(formData.email, formData.password)
            if (!authResponse.result?.token) throw new Error("Invalid credentials.")

            login(authResponse.result.token)
            showToast("success", "Successfully logged in!")
            onClose()
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors = err.errors.reduce((acc, error) => {
                    acc[`${error.path[0]}`] = error.message
                    return acc
                }, {} as Record<string, string>)
                setErrors(fieldErrors)
            } else {
                showToast("error", err instanceof ResponseError ? "An account with this email already exists" : String(err));
            }
        }

        setIsLoading(false)
    }

    // Handle input changes
    const handleInpuChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }

    // Close modal and reset form
    const handleClose = () => {
        setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" })
        setErrors({})
        onClose()
        router.push("/")
    }

    return (
        <Modal show={show} onClose={handleClose} size="lg">
            <Modal.Header>{isRegister ? "Register" : "Log in"}</Modal.Header>
            <Modal.Body className="flex flex-col justify-center items-center text-base">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    autoComplete="on"
                    className="w-full"
                >
                    {isRegister && (
                        <>
                            <InputField label="First name" name="firstName" value={formData.firstName} onChange={handleInpuChange} error={errors.firstName} />
                            <InputField label="Last name" name="lastName" value={formData.lastName} onChange={handleInpuChange} error={errors.lastName} />
                        </>
                    )}
                    <InputField label="Email" name="email" value={formData.email} onChange={handleInpuChange} error={errors.email} type="email"/>
                    <InputField label="Password" name="password" value={formData.password} onChange={handleInpuChange} error={errors.password} type="password" />
                    {isRegister && (
                        <InputField label="Confirm password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInpuChange} error={errors.confirmPassword} type="password" />
                    )}

                    <button type="submit" className="hidden"></button> {/* Ensures Enter works */}
                </form>

                <button onClick={() => setIsRegister(isReg => !isReg)} className="mt-2">
                    <span>Or <span className="text-blue-900 underline">{isRegister ? "log in" : "register"}</span></span>
                </button>
            </Modal.Body>

            <Modal.Footer className="flex justify-center gap-3">
                <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <Spinner /> : (isRegister ? "Register" : "Log in")}
                </Button>
                <Button onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )   
}