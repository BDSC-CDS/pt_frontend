import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRiskAssessment } from "~/utils/RiskAssessmentArx";
import { TemplatebackendGetRiskAssessmentReply, TemplatebackendGetRiskAssessmentResult } from '~/internal/client';
import dynamic from 'next/dynamic';
import withAuth from '~/components/withAuth';
const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

// The RiskAssessmentPage component
const RiskAssessmentPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [data, setData] = useState<TemplatebackendGetRiskAssessmentReply | null | undefined>(undefined);

    useEffect(() => {
        if (id) {
            getRiskAssessment(Number(id))
                .then(response => setData(response))
                .catch(console.error);
        }
    }, [id]);

    if (data === undefined) {
        return (
            <div>
                <div>Loading...</div>
            </div>
        );
    }

    const riskAssessment: any = data.result?.riskAssessment!;
    const quasiIdentifiers = riskAssessment?.quasi_identifiers;

    // Show message if no quasi-identifiers
    if (!quasiIdentifiers || quasiIdentifiers.length === 0) {
        return (
            <div>
                <h2 className="text-xl font-bold mb-4">No quasi-identifiers defined</h2>
                <p>Please define at least one quasi-identifier to generate a risk assessment.</p>
            </div>
        );
    }


    const riskAssessment: any = data.result?.riskAssessment!;
    const resultsMetadata = riskAssessment?.risk_assessment?.resultsMetadata;
    const quasiIdentifiers = riskAssessment?.quasi_identifiers;
    const sensitiveAttributes: string[] = [];
    let initialAverageProsecutor: number | null = null;
    let initialHighestProsecutor: number | null = null;

    // Check if resultsMetadata is an object and iterate through its values
    if (resultsMetadata && typeof resultsMetadata === 'object') {
        Object.values(resultsMetadata).forEach((metadata: any) => {
            // Extract sensitive attributes
            if (metadata.attributeTypes?.sensitive) {
                sensitiveAttributes.push(...metadata.attributeTypes.sensitive);
            }

            // Extract prosecutor risk values
            if (metadata.risks?.initialAverageProsecutor !== null) {
                initialAverageProsecutor = metadata.risks.initialAverageProsecutor;
            }
            if (metadata.risks?.initialHighestProsecutor !== null) {
                initialHighestProsecutor = metadata.risks.initialHighestProsecutor;
            }
        });
    }


    return (
        <div className="container">
            <h2 className="text-xl font-bold mb-4">Risk Assessment Details for ID: {id}</h2>
            {/* Quasi Identifiers */}
            <div className="card">
                <h2>Quasi Identifiers</h2>
                <p>{quasiIdentifiers || "No quasi-identifiers defined"}</p>
            </div>

            {/* Sensitive Attributes */}
            <div className="card">
                <h2>Sensitive Attributes</h2>
                <ul>
                    {sensitiveAttributes && sensitiveAttributes.length > 0 ? (
                        sensitiveAttributes.map((attr: string, index: number) => (
                            <li key={index}>{attr}</li>
                        ))
                    ) : (
                        <li>No sensitive attributes defined</li>
                    )}
                </ul>
            </div>

            {/* Risk Gauge */}
            <div className="card">
                <h2>Risk Assessment</h2>
                <div className="gauge-section">
                    <div>
                        <h3>Average Prosecutor Risk</h3>
                        <GaugeChart animate={false} arcsLength={[0.1, 0.8]} colors={['#2a9d8f', '#e76f51']} nrOfLevels={2} percent={initialAverageProsecutor || 0} textColor='black' />
                    </div>
                    <div>
                        <h3>Highest Prosecutor Risk</h3>
                        <GaugeChart animate={false} arcsLength={[0.1, 0.8]} colors={['#2a9d8f', '#e76f51']} nrOfLevels={2} percent={initialHighestProsecutor || 0} textColor='black' />
                    </div>
                </div>
            </div>

            {/* Benchmark Thresholds Table */}
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
        </div>
    );
};

export default withAuth(RiskAssessmentPage);

