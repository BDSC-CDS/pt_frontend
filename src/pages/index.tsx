import Head from "next/head";
import Link from "next/link";
import { HiDatabase, HiInbox, HiPresentationChartBar, HiOutlineCog, HiLockClosed, HiShieldCheck  } from 'react-icons/hi';
import {
    BiCalculator,
    BiMessageSquareDetail,
    BiLayer,
    BiSolidReport,
    BiSolidRuler,
    BiSolidDetail,
} from "react-icons/bi";
import { ReactNode } from "react";
import ToolCard from '../components/ToolCard';


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

            {/* Title */}
            <div className="flex flex-col justify-center items-start mb-12">
                <h1 className="text-4xl font-extrabold text-gray-800">Privacy Toolbox</h1>
                <div className="text-lg text-gray-600 mt-2">
                    Secure Your Sensitive Data with Confidence
                </div>
            </div>

            {/* Risk Assessment Section */}
            <div className="mb-12">
                <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
                    Risk Assessment
                </h2>
                <p className="text-gray-600 mt-2">
                    Evaluate and understand the privacy risks in your datasets.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <ToolCard
                        href="/risk_assessment"
                        icon={<HiPresentationChartBar size="3em" />}
                        title="Qualitative Risk Assessment"
                        description="Assess the re-identification risk of a project in compliance with Swiss law requirements by going through a questionnaire."
                    />
                    <ToolCard
                        href="/risk_assessment_arx"
                        icon={<BiCalculator size="3em" />}
                        title="Formal Risk Assessment"
                        description="Perform detailed and formal privacy assessments of your datasets."
                    />
                </div>
            </div>

            {/* De-identification Section */}
            <div className="mb-12">
                <h2 className="text-3xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">
                    De-identification
                </h2>
                <p className="text-gray-600 mt-2">
                    Protect sensitive information while preserving data utility.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <ToolCard
                        href="/rule-based-deid"
                        icon={<BiSolidRuler size="3em" />}
                        title="Rule-Based De-identification"
                        description="Apply basic rules to transform and de-identify your data."
                    />
                    <ToolCard
                        href="/deidentification-notebook"
                        icon={<BiSolidReport size="3em" />}
                        title="Formal De-identification"
                        description="Use advanced techniques to anonymize datasets."
                    />
                    <ToolCard
                        href="#" // Set to null or undefined to disable navigation
                        icon={<BiLayer size="3em" />}
                        title="Synthetic Data"
                        description="Generate synthetic data for secure sharing and analysis."
                        disabled={true} // Pass a disabled prop
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <ToolCard
                        href="#" 
                        icon={<BiSolidDetail size="3em" />}
                        title="Text De-identification"
                        description="De-identify non structured data in free text form"
                        disabled={true}
                    />
                </div>
            </div>
        </>
    );
}

