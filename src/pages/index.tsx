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
                <Header />
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Welcome to the Privacy Toolbox!</h1>
                </div>
                <section>
                    {/* Intro Text Section without image */}
                    <div className="mb-12">
                        <p className="text-md">
                            Our mission is to advance the field of biomedical data research by harnessing the expertise of the SPHN DeID task force and translating their recommendations into a dynamic, adaptable platform. Our goal is to revolutionize the process of risk assessment and de-identification for biomedical datasets, streamlining it for research purposes.

                            In pursuit of this objective, we are committed to developing an automated de-identification tool that not only ensures transparency but also provides a clear understanding of risk levels. This innovation promises to be a valuable asset for researchers, regulatory authorities, and Data Protection Officers (DPOs) alike.

                            Join us on this exciting journey towards enhanced biomedical data privacy and research efficiency.
                        </p>
                    </div>
                    {/* Tabular Data Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Tabular Data</h2>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <ToolCard
                                href="/risk_assessment"
                                icon={<BiMessageSquareDetail size="3em" />}
                                title="Questionnaire"
                                description="TEXT"
                            />
                            <ToolCard
                                href="/tools/formal_risk_assessment"
                                icon={<BiCalculator size="3em" />}
                                title="Formal Risk Assessment"
                                description="TEXT"
                            />
                            <ToolCard
                                href="/dataset"
                                icon={<BiSolidRuler size="3em" />}
                                title="Rule-Based De-identification"
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
                                title="Synthetic Data"
                                description="TEXT"
                            />
                        </div>
                    </div>
                    {/* Text Data Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold">Text Data</h2>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <ToolCard
                                href="/risk_assessment"
                                icon={<BiMessageSquareDetail size="3em" />}
                                title="Questionnaire"
                                description="TEXT"
                            />
                            <ToolCard
                                href="/text_deid"
                                icon={<BiSolidRuler size="3em" />}
                                title="Text De-identification"
                                description="TEXT"
                            />
                        </div>
                    </div>
                    {/* Image Data Section */}
                    <div>
                        <h2 className="text-2xl font-semibold">Image Data</h2>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <ToolCard
                                href="/risk_assessment"
                                icon={<GrDocumentLocked size="3em" />}
                                title="Image De-identification"
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
