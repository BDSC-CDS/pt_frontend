import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getRiskAssessment } from "/workspaces/pt_frontend/src/utils/RiskAssessmentArx"
import { TemplatebackendGetRiskAssessmentReply, TemplatebackendMetadata } from '~/internal/client';

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

    return (
        <div>
            <h1>Risk Assessment Details for ID: {id}</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default RiskAssessmentPage;
