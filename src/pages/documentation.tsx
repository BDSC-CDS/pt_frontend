import Head from 'next/head';
import Header from '../components/Header';
import Link from 'next/link';
import { BiSolidReport, BiCalculator, BiSolidRuler, BiMessageSquareDetail, BiLayer } from "react-icons/bi";

export default function About() {
    return (
        <>
            <Head>
                <title>Documentation</title>
                <meta name="description" content="About us page" />
            </Head>
            <div className="flex flex-col p-8">
                <Header />
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Documentation</h1>
                </div>
                <section>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Qualitative Risk Assessment Link */}
                        <Link href="/risk_assessment" className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                                <BiSolidReport size={"3em"} className="text-[#306278]" />
                            </div>
                            <h3 className="text-lg font-semibold">Qualitative Risk Assessment</h3>
                            <p className="text-sm text-gray-600 mt-2">Analyze and assess risk levels in your data.</p>
                        </Link>

                        {/* Quantitative Risk Assessment Link */}
                        <a
                            href="https://new-link.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                                <BiCalculator size={"3em"} className="text-[#306278]" />
                            </div>
                            <h3 className="text-lg font-semibold">Quantitative Risk Assessment</h3>
                            <p className="text-sm text-gray-600 mt-2">Placeholder text</p>
                        </a>

                        {/* Rule-Based De-identification Link */}
                        <a
                            href="https://new-link.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                                <BiSolidRuler size={"3em"} className="text-[#306278]" />
                            </div>
                            <h3 className="text-lg font-semibold">Rule-Based De-identification</h3>
                            <p className="text-sm text-gray-600 mt-2">Placeholder text</p>
                        </a>

                        {/* Text DeID Link */}
                        <a
                            href="https://create.t3.gg/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                                <BiMessageSquareDetail size={"3em"} className="text-[#306278]" />
                            </div>
                            <h3 className="text-lg font-semibold">Text DeID</h3>
                            <p className="text-sm text-gray-600 mt-2">Automate text de-identification with ease.</p>
                        </a>

                        {/* Synthetic Data Generation Link */}
                        <a
                            href="https://create.t3.gg/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                                <BiLayer size={"3em"} className="text-[#306278]" />
                            </div>
                            <h3 className="text-lg font-semibold">Synthetic Data Generation</h3>
                            <p className="text-sm text-gray-600 mt-2">Generate synthetic data for research purposes.</p>
                        </a>
                    </div>
                </section>
            </div>
        </>
    );
}
