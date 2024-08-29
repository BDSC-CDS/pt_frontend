import Head from 'next/head';
import Header from '../components/Header';
import Link from 'next/link';

export default function About() {
    return (
        <>
            <Head>
                <title>About Us | My T3 App</title>
                <meta name="description" content="About us page" />
            </Head>
            <div className="flex flex-col p-8">
                <Header />
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">About Us</h1>
                </div>
                <section>
                    <h2 className="text-2xl font-semibold mb-4">About SPHN</h2>
                    <p className="mb-4">
                        The Swiss Personalized Health Network (SPHN) is an initiative of the Swiss Federal Government to establish a national data infrastructure for clinical and omics data for research.
                    </p>
                    <p className="mb-4">
                        The State Secretariat for Education, Research and Innovation (SERI) allocated CHF 68 million to the SPHN initiative for the period 2017-2020, and CHF 66.9 million for 2021-2024. After 2024, the SPHN data infrastructure will be permanently integrated into the Swiss research landscape. For more information, read our mandate from the SERI and the Federal Office of Public Health (FOPH) for the first (2017-2020) and the second funding period (2021-2024).
                    </p>
                    <h3 className="text-xl font-semibold mt-6 mb-4">What we do</h3>
                    <p className="mb-4">
                        Our vision is to lay the foundations for a nationwide exchange of health-related data, enabling multidisciplinary personalized-health research to improve disease prevention and medical practice, and paving the way for the development of ground-breaking treatments.
                    </p>
                    <p className="mb-4">
                        To achieve this, SPHN has adopted a decentralized approach and builds a scalable network of data providers. To make health data interoperable and accessible for research, we provide common standards for data formats, semantics, governance, and exchange. In addition, we develop processes and IT infrastructures that adhere to stringent ethical and legal requirements, for instance regarding data protection.
                    </p>
                    <Link href="#" className="text-blue-600 hover:text-blue-800">Read more...</Link>
                </section>
            </div>
        </>
    );
}
