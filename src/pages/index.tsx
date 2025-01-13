import Head from "next/head";
import Header from "../components/Header";
import Link from "next/link";
import {
    BiCalculator,
    BiMessageSquareDetail,
    BiLayer,
    BiSolidReport,
    BiSolidRuler,
} from "react-icons/bi";
import { GrDocumentLocked } from "react-icons/gr";
import { ReactNode } from "react";

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
                        icon={<BiMessageSquareDetail size="3em" />}
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
                        href="/dataset"
                        icon={<BiSolidRuler size="3em" />}
                        title="Rule-Based De-identification"
                        description="Apply basic rules to transform and de-identify your data."
                    />
                    <ToolCard
                        href="/formal_deid"
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
            </div>
        </>
    );
}


/**
 * Props for the ToolCard component.
 */
interface ToolCardProps {
    href: string;
    icon: ReactNode;
    title: string;
    description: string;
    disabled?:boolean;
}

/**
 * ToolCard component for rendering each tool as a card.
 */
function ToolCard({
    href,
    icon,
    title,
    description,
    disabled = false,
}: ToolCardProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (disabled) {
            e.preventDefault(); // Prevent navigation if disabled
            alert("This feature is not implemented yet.");
        }
    };

    return (
        <Link
            href={disabled ? "#" : href} // Disable navigation when disabled
            onClick={handleClick}
            className={`flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform ${
                disabled
                    ? "bg-gray-200 text-gray-400"
                    : "hover:scale-105"
            }`}
        >
            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 mt-2">{description}</p>
            {disabled && (
                <p className="mt-2 text-sm text-center">
                    Not Yet Implemented
                </p>
            )}
        </Link>
    );
}

