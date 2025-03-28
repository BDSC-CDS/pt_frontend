import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRiskAssessment } from '~/utils/RiskAssessmentArx';
import { TemplatebackendGetRiskAssessmentReply } from '~/internal/client';
import dynamic from 'next/dynamic';
import withAuth from '~/components/withAuth';

const GaugeChart = dynamic(() => import('react-gauge-chart'), { ssr: false });

// Fully typed shape of the riskAssessment object
type RiskAssessmentType = {
  quasi_identifiers: string[];
  risk_assessment?: {
    resultsMetadata?: Record<
      string,
      {
        attributeTypes?: {
          sensitive?: string[];
        };
        risks?: {
          initialAverageProsecutor?: number | null;
          initialHighestProsecutor?: number | null;
        };
      }
    >;
  };
};

const RiskAssessmentPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState<TemplatebackendGetRiskAssessmentReply | null | undefined>(undefined);

  useEffect(() => {
    if (id) {
      getRiskAssessment(Number(id))
        .then((response) => setData(response))
        .catch(console.error);
    }
  }, [id]);

  // Initial loading state
  if (data === undefined) {
    return (
      <div className="container">
        <div>Loading...</div>
      </div>
    );
  }

  // No data case
  if (data === null || !data.result?.riskAssessment) {
    return (
      <div className="container">
        <h2 className="text-xl font-bold mb-4">Risk assessment not available</h2>
        <p>Unable to retrieve risk assessment data for ID: {id}</p>
      </div>
    );
  }

  const riskAssessment = data.result.riskAssessment as RiskAssessmentType;

  const quasiIdentifiers = riskAssessment.quasi_identifiers;

  if (!Array.isArray(quasiIdentifiers) || quasiIdentifiers.length === 0) {
    return (
      <div className="container">
        <h2 className="text-xl font-bold mb-4">No quasi-identifiers defined</h2>
        <p>Please define at least one quasi-identifier to generate a risk assessment.</p>
      </div>
    );
  }

  // Extract sensitive attributes and prosecutor risks
  const resultsMetadata = riskAssessment.risk_assessment?.resultsMetadata;
  const sensitiveAttributes: string[] = [];
  let initialAverageProsecutor: number | null = null;
  let initialHighestProsecutor: number | null = null;

  if (resultsMetadata && typeof resultsMetadata === 'object') {
    Object.values(resultsMetadata).forEach((metadata) => {
      if (metadata.attributeTypes?.sensitive) {
        sensitiveAttributes.push(...metadata.attributeTypes.sensitive);
      }

      if (metadata.risks?.initialAverageProsecutor !== null) {
        initialAverageProsecutor = metadata.risks.initialAverageProsecutor ?? initialAverageProsecutor;
      }

      if (metadata.risks?.initialHighestProsecutor !== null) {
        initialHighestProsecutor = metadata.risks.initialHighestProsecutor ?? initialHighestProsecutor;
      }
    });
  }

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Risk Assessment Details for ID: {id}</h2>

      {/* Quasi Identifiers */}
      <div className="card">
        <h2 className="font-semibold">Quasi Identifiers</h2>
        <p>{quasiIdentifiers.join(', ')}</p>
      </div>

      {/* Sensitive Attributes */}
      <div className="card mt-4">
        <h2 className="font-semibold">Sensitive Attributes</h2>
        <ul>
          {sensitiveAttributes.length > 0 ? (
            sensitiveAttributes.map((attr, index) => <li key={index}>{attr}</li>)
          ) : (
            <li>No sensitive attributes defined</li>
          )}
        </ul>
      </div>

      {/* Risk Gauge */}
      <div className="card mt-4">
        <h2 className="font-semibold mb-2">Risk Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="mb-2">Average Prosecutor Risk</h3>
            <GaugeChart
              animate={false}
              arcsLength={[0.1, 0.8]}
              colors={['#2a9d8f', '#e76f51']}
              nrOfLevels={2}
              percent={initialAverageProsecutor || 0}
              textColor="black"
            />
          </div>
          <div>
            <h3 className="mb-2">Highest Prosecutor Risk</h3>
            <GaugeChart
              animate={false}
              arcsLength={[0.1, 0.8]}
              colors={['#2a9d8f', '#e76f51']}
              nrOfLevels={2}
              percent={initialHighestProsecutor || 0}
              textColor="black"
            />
          </div>
        </div>
      </div>

      {/* Benchmark Thresholds Table */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Benchmark Thresholds for Identifiable Groups</h2>
        <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
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
