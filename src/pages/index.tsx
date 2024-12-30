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
            <div className="flex flex-col p-8">
                <section>                    
                    {/* Risk Assessment Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Risk Assessment</h2>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <ToolCard
                                href="/risk_assessment"
                                icon={<BiMessageSquareDetail size="3em" />}
                                title="Qualitative Risk Assessment"
                                description="TEXT"
                            />
                            <ToolCard
                                href="/risk_assessment_arx"
                                icon={<BiCalculator size="3em" />}
                                title="Formal Risk Assessment"
                                description="TEXT"
                            />
                        </div>
                    </div>
                    {/* De-Identification Section */}
                    <div>
                        <h2 className="text-2xl font-semibold">De-Identification</h2>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <ToolCard
                                href="/dataset"
                                icon={<BiSolidRuler size="3em" />}
                                title="Rule-based De-identification"
                                description="TEXT"
                            />
                            <ToolCard
                                href="/formal_deid"
                                icon={<BiSolidReport size="3em" />}
                                title="Formal De-identification"
                                description="TEXT"
                            />
                            <ToolCard
                                href="/synthetic_data"
                                icon={<BiLayer size="3em" />}
                                title="Synthetic Data Generation"
                                description="TEXT"
                            />
                        </div>
                    </div>
                </section>
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
}

/**
 * ToolCard component for rendering each tool as a card.
 */
function ToolCard({ href, icon, title, description }: ToolCardProps) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center text-center bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105"
        >
            <div className="flex items-center justify-center w-16 h-16 bg-[#A1C6D9] rounded-full mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 mt-2">{description}</p>
        </Link>
    );
}
