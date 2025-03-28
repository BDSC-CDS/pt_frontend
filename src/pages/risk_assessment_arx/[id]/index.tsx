import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRiskAssessment } from '~/utils/RiskAssessmentArx';
import { TemplatebackendGetRiskAssessmentReply } from '~/internal/client';
import dynamic from 'next/dynamic';
import withAuth from '~/components/withAuth';

const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

const RiskAssessmentPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const [data, setData] = useState<TemplatebackendGetRiskAssessmentReply | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getRiskAssessment(Number(id))
                .then((response) => setData(response ?? null))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div>
                <div>Loading...</div>
                <br />
                <p>We're fetching the data. If this takes too long, it may be that no quasi-identifiers have been defined.</p>
            </div>
        );
    }

    const riskAssessment = data?.result?.riskAssessment;
    const quasiIdentifiers = riskAssessment?.quasi_identifiers;

    if (!quasiIdentifiers || quasiIdentifiers.length === 0) {
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

    return (
        <div className="container">
            <h2 className="text-xl font-bold mb-4">Risk Assessment Details for ID: {id}</h2>

            <div className="card">
                <h2>Quasi Identifiers</h2>
                <p>{quasiIdentifiers.join(', ')}</p>
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
                {/* Your table here */}
            </div>
        </div>
    );
};

export default withAuth(RiskAssessmentPage);
