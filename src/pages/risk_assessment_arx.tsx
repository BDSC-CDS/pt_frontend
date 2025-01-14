
import Head from 'next/head';
import { useAuth } from '~/utils/authContext';
import { getRiskAssessment } from '~/utils/RiskAssessmentArx';
import DatasetSelector from '~/components/DatasetSelector';


export default function RiskAssessmentArx() {
    const { isLoggedIn } = useAuth();


    const handleRiskAssessment = async (id: number | undefined) => {
        if (id) { 
            const response = await getRiskAssessment(id);
            
            // Handle successful response
            if (response) {
                
                const jsonContent = JSON.stringify(response, null, 2);
                const blob = new Blob([jsonContent], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                // Trigger file download
                const a = document.createElement('a');
                a.href = url;
                a.download = `risk_assessment_${id}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                alert("No quasi-identifiers have been defined for this dataset.");
            }
        }

    };

    return (
        <>
            <Head>
                <title>Quantitative Risk Assessment</title>
            </Head>
            {!isLoggedIn && (
                <p className='m-8'> Please log in to consult your datasets.</p>
            )}
            {isLoggedIn && (
                <div className="flex flex-col p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Quantitative Risk Assessment</h1>
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
                        // onRowClick={(id) => handleRowClick(id)}
                        actions={[
                            { name: "Risk assesment", callback: (id) => handleRiskAssessment(id) },
                        ]}
                    />
                </div>
            )}
        </>
    );
}