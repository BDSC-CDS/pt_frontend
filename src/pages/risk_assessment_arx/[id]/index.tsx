import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRiskAssessment } from '~/utils/RiskAssessmentArx';
import { TemplatebackendGetRiskAssessmentReply } from '~/internal/client';
import dynamic from 'next/dynamic';
import withAuth from '~/components/withAuth';
import Spinner from '~/components/ui/Spinner';
import DatasetEditMetadataModal from '~/components/modals/DatasetEditMetadataModal';
import jsPDF from 'jspdf';


const buttonClass = "flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer mr-2"


const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

const RiskAssessmentPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [showColTypeModal, setShowColTypeModal] = useState(false);
    const [data, setData] = useState<TemplatebackendGetRiskAssessmentReply | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    const getDatasetRiskAssessment = async (datasetId: number) => {
        try {
            setLoading(true);
        
            const response = await getRiskAssessment(datasetId);
            if (response) {
                setData(response)
            }
        } catch (error) {
            console.error('Error fetching risk assessment:', error);
            return undefined;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            getDatasetRiskAssessment(Number(id));
        }
    }, [id]);

    if (loading) {
        return (
            <Spinner/>
        );
    }

    const handleColumnTypeChange = async () => {
        setShowColTypeModal(true);
    };

    const riskAssessment = data?.result?.riskAssessment as {
        quasi_identifiers?: string[];
        [key: string]: any;
    } | undefined;

    const quasiIdentifiers = riskAssessment?.quasi_identifiers ?? [];
    if (quasiIdentifiers.length === 0) {
        return <div>No quasi-identifiers have been defined for this risk assessment.</div>;
    }

    const resultsMetadata = riskAssessment?.risk_assessment?.resultsMetadata || {};
    const sensitiveAttributes: string[] = [];
    let initialAverageProsecutor: number = 0;
    let initialHighestProsecutor: number = 0;

    Object.values(resultsMetadata).forEach((metadata: any) => {
        if (metadata.attributeTypes?.sensitive) {
            sensitiveAttributes.push(...metadata.attributeTypes.sensitive);
        }
        if (metadata.risks?.initialAverageProsecutor != null) {
            initialAverageProsecutor = metadata.risks.initialAverageProsecutor;
        }
        if (metadata.risks?.initialHighestProsecutor != null) {
            initialHighestProsecutor = metadata.risks.initialHighestProsecutor;
        }
    });


    const handleExportPDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const headerHeight = 20;
        let cursorY = margin + headerHeight;
    
        const addHeader = async (firstPage = false) => {
            if (!firstPage) return;
            pdf.setFillColor("#306278");
            pdf.rect(0, 0, pageWidth, headerHeight, "F");
    
            const response = await fetch("/logo.png");
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise((resolve) => {
                reader.onloadend = () => {
                    const base64Logo = reader.result as string;
                    const logoWidth = 15;
                    const logoHeight = 10;
                    pdf.addImage(base64Logo, "PNG", margin, (headerHeight - logoHeight) / 2, logoWidth, logoHeight);
    
                    pdf.setFont("helvetica", "bold");
                    pdf.setFontSize(14);
                    pdf.setTextColor("#FFFFFF");
                    pdf.text("Privacy Toolbox", margin + logoWidth + 5, headerHeight / 1.5);
                    resolve(null);
                };
            });
        };
    
        const addFooter = (pageNumber: number) => {
            pdf.setFont("helvetica", "italic");
            pdf.setFontSize(10);
            pdf.setTextColor("#000000");
            pdf.text(`Page ${pageNumber}`, pageWidth - margin - 20, pageHeight - 10);
        };
    
        let pageNumber = 1;
        await addHeader(true);
        addFooter(pageNumber);
    
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Quantitative Risk Assessment", margin, cursorY);
        cursorY += 10;
    
        // Quasi-identifiers
        pdf.setFont("helvetica", "bold");
        pdf.text("Quasi-Identifiers:", margin, cursorY);
        pdf.setFont("helvetica", "normal");
        cursorY += 6;
        pdf.text(quasiIdentifiers, margin, cursorY);
    
        cursorY += 10;
    
        // Sensitive Attributes
        pdf.setFont("helvetica", "bold");
        pdf.text("Sensitive Attributes:", margin, cursorY);
        pdf.setFont("helvetica", "normal");
        cursorY += 6;
        pdf.text(sensitiveAttributes, margin, cursorY);
    
        cursorY += 6;
    
        // Prosecutor Risk
        pdf.setFont("helvetica", "bold");
        pdf.text("Re-identification Risk Estimates:", margin, cursorY);
        cursorY += 6;
        pdf.setFont("helvetica", "normal");
        pdf.text(`Average Prosecutor Risk: ${initialAverageProsecutor.toFixed(4)}`, margin, cursorY);
        cursorY += 6;
        pdf.text(`Highest Prosecutor Risk: ${initialHighestProsecutor.toFixed(4)}`, margin, cursorY);
        cursorY += 10;

    
        pdf.save("risk-assessment.pdf");
    };
    
    return (
        

        
        <div className="container">

            {/* Import modal to change metadata*/}
            <DatasetEditMetadataModal show={showColTypeModal} datasetId={Number(id)} onClose={() => setShowColTypeModal(false)} />
            
            <h2 className="text-xl font-bold mb-4">Risk Assessment Details for ID: {id}</h2>

            <div className="card">
                <h2>Quasi Identifiers</h2>
                <p>{quasiIdentifiers}</p>
            </div>

            <div className="card">
                <h2>Sensitive Attributes</h2>
                <ul>
                    {sensitiveAttributes.length > 0 ? (
                        sensitiveAttributes.map((attr, index) => <li key={index}>{attr}</li>)
                    ) : (
                        <li>No sensitive attributes defined</li>
                    )}
                </ul>
            </div>

            <div className="card">
                <h2>Risk Assessment</h2>
                <div className="gauge-section">
                    <div>
                        <h3>Average Prosecutor Risk</h3>
                        <GaugeChart
                            animate={false}
                            arcsLength={[0.1, 0.8]}
                            colors={['#2a9d8f', '#e76f51']}
                            nrOfLevels={2}
                            percent={initialAverageProsecutor}
                            textColor="black"
                        />
                    </div>
                    <div>
                        <h3>Highest Prosecutor Risk</h3>
                        <GaugeChart
                            animate={false}
                            arcsLength={[0.1, 0.8]}
                            colors={['#2a9d8f', '#e76f51']}
                            nrOfLevels={2}
                            percent={initialHighestProsecutor}
                            textColor="black"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Benchmark Thresholds for Identifiable Groups</h2>
                <table className="table-auto border-collapse border border-gray-400 w-full">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2">Scenario Context (Matrix)</th>
                            <th className="border border-gray-400 px-4 py-2">Threshold</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-400 px-4 py-2">Public - High possibility of attack, low impact</td>
                            <td className="border border-gray-400 px-4 py-2">Max &lt; 0.1</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 px-4 py-2">Public - High possibility of attack, medium impact</td>
                            <td className="border border-gray-400 px-4 py-2">Max &lt; 0.075</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 px-4 py-2">Public - High possibility of attack, high impact</td>
                            <td className="border border-gray-400 px-4 py-2">Max &lt; 0.05</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 px-4 py-2">Non-public - Low-med possibility of attack, low-medium impact</td>
                            <td className="border border-gray-400 px-4 py-2">Avg &lt; 0.1</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 px-4 py-2">Non-public - Medium possibility of attack, medium impact</td>
                            <td className="border border-gray-400 px-4 py-2">Avg &lt; 0.075</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-400 px-4 py-2">Non-public - Medium-high possibility of attack, medium-high impact</td>
                            <td className="border border-gray-400 px-4 py-2">Avg &lt; 0.05</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className='flex justify-start my-4 space-x-4'>
                <button
                    onClick={handleColumnTypeChange}
                    className={buttonClass}
                >
                    <p className='ml-2 text-md'> Edit Metadata </p>
                </button>

                <button
                    onClick={handleExportPDF}
                    className={buttonClass}
                >
                    <p className='ml-2 text-md'> Download PDF Report </p>
                </button>
            </div>

        </div>
    );
};

export default withAuth(RiskAssessmentPage);
