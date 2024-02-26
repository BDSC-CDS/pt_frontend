import Head from 'next/head';
import Header from '../components/Header';

// About component for displaying the 'About Us' page
export default function About() {
    return (
        <>
            <Head>
                <title>About Us | My T3 App</title>
                <meta name="description" content="About us page" />
            </Head>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">About Us</h1>
                <p className="mt-4 text-center">
                    This is the about page of the Privacy Toolbox. Here you can find information about our team and mission.
                </p>
            </main>
        </>
    );
}
