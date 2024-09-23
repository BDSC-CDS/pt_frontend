import Head from 'next/head';
import Header from '../components/Header';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import apiClient from '../utils/apiClientIndex';
import { TemplatebackendCreateHelloReply } from '~/internal/client';

// Contact component for the 'Contact Us' page
export default function Contact() {
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
        <>
            <Head>
                <title>Contact Us</title>
                <meta name="description" content="Contact us page" />
            </Head>
            <div className="flex flex-col p-8">
                <Header />
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Contact Us</h1>
                </div>
                <section>
                    {/* Form for submitting contact information */}
                    <form onSubmit={handleSubmit} className='w-full max-w-md'>
                        {/* Input fields for name, email, and message */}
                        <div className="mb-6">
                            <label htmlFor="name" className="block mb-2 text-lg">Name:</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="border rounded p-3 w-full text-black text-lg" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block mb-2 text-lg">Email:</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="border rounded p-3 w-full text-black text-lg" />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="message" className="block mb-2 text-lg">Message:</label>
                            <textarea id="message" name="message" value={formData.message} onChange={handleChange} className="border rounded p-3 w-full text-black text-lg" rows={5}></textarea>
                        </div>
                        {/* Submit button */}
                        <button type="submit" className="bg-[#4B5563] text-white px-4 py-3 rounded w-full text-lg">Send</button>
                    </form>
                </section>
            </div>
        </>
    );
}
