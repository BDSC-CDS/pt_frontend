import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRiskAssessment } from "~/utils/RiskAssessmentArx";
import { TemplatebackendGetRiskAssessmentReply, TemplatebackendGetRiskAssessmentResult } from '~/internal/client';
import dynamic from 'next/dynamic';
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
                        <GaugeChart percent={initialAverageProsecutor || 0} textColor='black' />
                    </div>
                    <div>
                        <h3>Highest Prosecutor Risk</h3>
                        <GaugeChart percent={initialHighestProsecutor || 0} textColor='black' />
                    </div>
                </div>
            </div>
        </div>
    );
};

// <GaugeChart id="gauge-chart2"
//                             nrOfLevels={20}
//                             cornerRadius={0}
//                             percent={currentRiskPc}
//                             textColor='black'
//                             animate={false}
//                         />

export default RiskAssessmentPage;

