import Head from 'next/head';
import Header from '../components/Header';
import ToolCard from '../components/ToolCard';
import Link from 'next/link';
import { BiSolidReport, BiCalculator, BiSolidRuler, BiMessageSquareDetail, BiLayer } from "react-icons/bi";
import { HiDatabase, HiInbox, HiPresentationChartBar, HiOutlineCog, HiLockClosed, HiShieldCheck } from 'react-icons/hi';


export default function About() {
    return (
        <>
            <Head>
                <title>Documentation</title>
                <meta name="description" content="About us page" />
            </Head>
            <div className="flex flex-col">
                <Header />
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Documentation</h1>
                </div>
                <section>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Qualitative Risk Assessment Link */}
                        <ToolCard
                            href="/documentation/doc_qualitative_risk_assessment.md"
                            icon={<HiPresentationChartBar size="3em" />}
                            title="Qualitative Risk Assessment"
                            description="Assess the re-identification risk of a project in compliance with Swiss law requirements by going through a questionnaire."
                        />

                        {/* Formal Risk Assessment Link */}
                        <ToolCard
                            href="/documentation/doc_formal_risk_assessment.md"
                            icon={<BiCalculator size="3em" />}
                            title="Formal Risk Assessment"
                            description="Perform detailed and formal privacy assessments of your datasets."
                        />

                        {/* Rule-Based De-identification Link */}
                        <ToolCard
                            href="/documentation/doc_rule-based_de-identification.md"
                            icon={<BiSolidRuler size="3em" />}
                            title="Rule-Based De-identification"
                            description="Apply basic rules to transform and de-identify your data."
                        />

                        {/* Formal De-identification Link */}
                        <ToolCard
                            href="/documentation/doc_formal_de-identification.md"
                            icon={<BiSolidReport size="3em" />}
                            title="Formal De-identification"
                            description="Use advanced techniques to anonymize datasets."
                        />

                        {/* Text DeID Link */}
                        {/* <Link href="#" className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                                <BiMessageSquareDetail size={"3em"} className="text-[#306278]" />
                            </div>
                            <h3 className="text-lg font-semibold">Text De-identification</h3>
                            <p className="text-sm text-gray-600 mt-2">Automate text de-identification with ease.</p>
                        </Link> */}

                        {/* Synthetic Data Generation Link */}
                        {/* <Link href="#" className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
                            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                                <BiLayer size={"3em"} className="text-[#306278]" />
                            </div>
                            <h3 className="text-lg font-semibold">Synthetic Data Generation</h3>
                            <p className="text-sm text-gray-600 mt-2">Generate synthetic data for research purposes.</p>
                        </Link> */}
                    </div>
                </section>
            </div>
        </>
    );
}
