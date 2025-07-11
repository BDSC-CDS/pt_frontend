
import Head from 'next/head';
import { useAuth } from '~/utils/authContext';
import { getRiskAssessment } from '~/utils/RiskAssessmentArx';
import DatasetSelector from '~/components/DatasetSelector';
import { useRouter } from 'next/router';
import withAuth from '~/components/withAuth';
import { showToast } from '~/utils/showToast';


function RiskAssessmentArx() {
    const { isLoggedIn } = useAuth();

    const router = useRouter();

    const handleRowClick = (id: number | undefined) => {
        if (id) {
            router.push(`/risk_assessment_arx/${id}`);
        }
    }

    const handleRiskAssessment = async (id: number | undefined) => {
        if (id) {
            const response = await getRiskAssessment(id);

            // Handle successful response
            if (response) {

                router.push(`/risk_assessment_arx/${id}`);
            } else {
                showToast("error", "No quasi-identifiers have been defined for this dataset.")
            }
        }
    };

    return (
        <>
            <Head>
                <title>Formal Risk Assessment</title>
            </Head>
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Formal Risk Assessment</h1>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p>
                        On this page you are able to formally assert the risk of reidetification of your dataset by using ARX.
                    </p>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <p className="font-bold">Please select a dataset to start</p>
                </div>

                <DatasetSelector
                    onRowClick={handleRowClick}
                    preview
                    download
                />
            </div>
        </>
    );
}

export default withAuth(RiskAssessmentArx)