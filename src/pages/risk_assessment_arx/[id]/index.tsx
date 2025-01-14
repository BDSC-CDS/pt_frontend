import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRiskAssessment } from "/workspaces/pt_frontend/src/utils/RiskAssessmentArx";
import { TemplatebackendGetRiskAssessmentReply, TemplatebackendGetRiskAssessmentResult } from '~/internal/client';

// A simple gauge component to show the risk as a percentage
const Gauge = ({ value }: { value: number }) => {
    return (
        <div className="gauge-container">
            <svg className="gauge-svg" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="90" stroke="#ddd" strokeWidth="20" fill="none" />
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke={value < 0.5 ? 'green' : value < 0.8 ? 'yellow' : 'red'}
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${(value / 1) * 565} 565`}
                    transform="rotate(-90 100 100)"
                />
                <text x="50%" y="50%" textAnchor="middle" dy="7" fontSize="24" fill="black">
                    {Math.round(value * 100)}%
                </text>
            </svg>
        </div>
    );
};

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

    if (!data) {
        return <div>Loading...</div>;
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
            <h1>Risk Assessment Details for ID: {id}</h1>
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
                        <Gauge value={initialAverageProsecutor || 0} />
                    </div>
                    <div>
                        <h3>Highest Prosecutor Risk</h3>
                        <Gauge value={initialHighestProsecutor || 0} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskAssessmentPage;

