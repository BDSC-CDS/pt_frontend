import Head from 'next/head';
import Header from '../components/Header';
import { ChangeEvent, useState } from 'react';
import { authenticateUser } from '../utils/authenticateUser';
import { useAuth } from '../utils/AuthContext';
import Link from 'next/link';
import { Button, Modal } from 'flowbite-react';
import { useRouter } from 'next/router';
import SideMenu from '~/components/SideMenu';
import FooterMenu from '~/components/Footer';

// The Authenticate component is used for handling the user authentication process.
export default function Authenticate() {
    // State for managing user input data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const router = useRouter();

    // Using the useAuth hook to access the login function
    const { login } = useAuth();

    // State for storing the authentication token received from the server
    const [token, setToken] = useState<string>();
    const [modal, setModal] = useState<boolean>(false);
    // Function to handle the authentication process
    const authUser = async () => {
        const response = await authenticateUser(formData.email, formData.password);
        const newToken = response ? (response.result ? response.result.token : '') : '';

        setToken(newToken === '' ? 'NULL' : newToken);
        if (newToken && newToken !== 'NULL') {
            login(newToken);
            setModal(true);
        }
    }

    // Function to handle changes in the form inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setToken('');
    };

    return (
        <>
            <Head>
                <title>Authentication</title>
            </Head>
            <div className='rounded flex flex-col items-center justify-center py-10'>
                <div className="text-center">
                    <h2 className="mb-4 text-4xl">
                        Authentication
                    </h2>
                </div>
                <form onSubmit={authUser} className='w-1/3 mt-8 pb-6'>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2">Password:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>
                </form>
                <button onClick={authUser}
                    className="rounded-lg bg-gray-500 bg-opacity-20 py-2 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer"
                >
                    Log in
                </button>
                <Link href="/user" passHref className='mt-4'>
                    <span>Or create an account here</span>
                </Link>
                <p className="mt-4 text-xl text-red-500">{token === 'NULL' && 'Your credentials are not correct'}</p>
                <Modal show={modal} onClose={() => setModal(false)}>
                    <Modal.Body>
                        <div className="space-y-6">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                You are logged in!
                            </p>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => { setModal(false); router.push('/'); }}>Close</Button>

                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}
