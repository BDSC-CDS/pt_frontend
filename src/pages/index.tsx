import Head from "next/head";
import Header from '../components/Header';
import Link from "next/link";
import { BiCalculator, BiMessageSquareDetail, BiLayer } from 'react-icons/bi';
import { GrDocumentLocked } from "react-icons/gr";

/**
 * Home component that represents the main page of the application.
 */
export default function Home() {
    return (
        <>
            <Head>
                <title>Privacy Toolbox</title>
                <meta name="description" content="A frontend template based on the T3 app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col p-8">
                <Header />
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Welcome to the Privacy Toolbox!</h1>
                </div>
                <section>
                    <div className="flex items-start mb-12"> {/* Increased bottom margin */}
                        <p className="text-md w-3/5">
                            Our mission is to advance the field of biomedical data research by harnessing the expertise of the SPHN DeID task force and translating their recommendations into a dynamic, adaptable platform. Our goal is to revolutionize the process of risk assessment and de-identification for biomedical datasets, streamlining it for research purposes.

                            In pursuit of this objective, we are committed to developing an automated de-identification tool that not only ensures transparency but also provides a clear understanding of risk levels. This innovation promises to be a valuable asset for researchers, regulatory authorities, and Data Protection Officers (DPOs) alike.

                            Join us on this exciting journey towards enhanced biomedical data privacy and research efficiency.
                        </p>
                        <div className="ml-6 w-2/5 flex justify-center">
                            <GrDocumentLocked size={"12em"} style={{ color: '#306278' }} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Link
                            href="/risk_assessment"
                            className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                                <BiCalculator size={"3em"} className="text-[#306278]" />
                            </div>
                            <h3 className="text-lg font-semibold">Risk Assessment</h3>
                            <p className="text-sm text-gray-600 mt-2">Analyze and assess risk levels in your data.</p>
                        </Link>
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
