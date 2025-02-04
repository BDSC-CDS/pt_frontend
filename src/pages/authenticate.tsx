import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import { authenticateUser } from "../utils/authentication";
import { useAuth } from "../utils/authContext";
import Link from "next/link";
import { useRouter } from "next/router";
import Spinner from "~/components/ui/Spinner";

export default function Authenticate() {

    // Authentication
    const { login } = useAuth();

    // Routing
    const router = useRouter();

    // States
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [token, setToken] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [successMessage, setSuccessMessage] = useState<string>(''); // Success message state
    const [errorMessage, setErrorMessage] = useState<string>(''); // Error message state

    // Handlers
    const authUser = async () => {
        setLoading(true)
        const response = await authenticateUser(formData.email, formData.password);
        const newToken = response ? (response.result ? response.result.token : "") : "";
        setLoading(false)

        setToken(newToken === "" ? "NULL" : newToken);
        
        if (newToken && newToken !== "NULL") {
            login(newToken);

            // Give user a feedback
            setSuccessMessage("Successfully logged in!")
            setTimeout(()=>router.push("/"), 500)
            
        } else {
            setErrorMessage("Your credentials are not correct.")
            setTimeout(() => setErrorMessage(""), 3000)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setToken("");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        authUser();
    };

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className="rounded flex flex-col items-center justify-center py-10">
                <div className="text-center">
                    <h2 className="mb-4 text-4xl">
                        Login
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="w-1/3 flex flex-col justify-center">

                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email:</label>
                        <input id="email" name="email" value={formData.email} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2">Password:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>

                    <button type="submit" className="mt-5 flex h-11 justify-center items-center gap-5 rounded-lg bg-gray-500 bg-opacity-20 py-2 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer">
                        {loading && (
                            <Spinner/>
                        )}
                        {!loading && (
                            <span>Log in</span>
                        )}
                    </button>
                </form>
               
                <Link href="/user" passHref className="mt-4">
                    <span>Or create an account <span className="text-blue-900 underline">here</span></span>
                </Link>

                {/* Message */}
                {successMessage && !errorMessage && (
                    <div className="mt-4 text-green-500">
                        {successMessage}
                    </div>
                )}

                {/* Message */}
                {!successMessage && errorMessage && (
                    <div className="mt-4 text-red-500">
                        {errorMessage}
                    </div>
                )}

                {/* <p className="mt-4 text-xl text-red-500">{token === "NULL" && "Your credentials are not correct"}</p> */}
            </div>
        </>
    );
}
