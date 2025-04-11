import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRiskAssessment } from '~/utils/RiskAssessmentArx';
import { TemplatebackendGetRiskAssessmentReply } from '~/internal/client';
import dynamic from 'next/dynamic';
import withAuth from '~/components/withAuth';
import Spinner from '~/components/ui/Spinner';

const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

const RiskAssessmentPage = () => {
    const router = useRouter();
    const { id } = router.query;

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

    return (
        <div className="container">
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
        </div>
    );
};

export default withAuth(RiskAssessmentPage);
