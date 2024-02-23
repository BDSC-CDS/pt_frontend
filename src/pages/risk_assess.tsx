import Head from 'next/head';
import Header from '../components/Header';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import apiClient from '../utils/apiClientIndex';
import { TemplatebackendCreateHelloReply } from '~/internal/client';

// Contact component for the 'Contact Us' page
export default function RiskAssess() {
    // State for managing form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    // State to store the response from the backend
    const [response, setResponse] = useState<TemplatebackendCreateHelloReply>();

    // Function to fetch a response from the backend API
    const fetchHello = async () => {
        try {
            const response = await apiClient.indexServiceGetHello();
            console.log(response); // Log the response for debugging
            setResponse(response); // Update the state with the response
        } catch (error) {
            console.error("Error fetching hello:", error);
            // Handle any errors that occur during the fetch
        }
    };

    // Function to handle changes in form inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value, // Update the form data state
        }));
    };

    // Function to handle form submission
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission behavior
        console.log(formData); // Log the form data for debugging
        // Optionally call fetchHello here if needed
    };

    return (
        <div className='bg-gradient-to-b from-[#05514d] to-[#15162c]'>
            <Head>
                <title>Contact Us | My T3 App</title>
                <meta name="description" content="Contact us page" />
            </Head>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold">Contact Us</h1>
                {/* Form for submitting contact information */}
                <form onSubmit={handleSubmit} className='w-1/3 mt-8 pb-6'>
                    {/* Input fields for name, email, and message */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2">Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block mb-2">Message:</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange} className="border rounded p-2 w-full text-black" rows={3}></textarea>
                    </div>
                    {/* Submit button */}
                    <button type="submit" className="bg-[#05514d] text-white px-4 py-2 rounded">Send</button>
                </form>
                {/* Uncomment below to display response from the server */}
                {/* <div className='text-black bg-white w-60 h-50 rounded-md'>
                    <div className='p-3'>
                        <p className='font-bold'>Response:</p>
                        <p>{response ? response.content : "No response"}</p>
                    </div>
                </div> */}
            </main>
        </div >
    );
}
