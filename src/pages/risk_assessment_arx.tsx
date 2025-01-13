
import Head from 'next/head';
import { useRouter } from 'next/router';
import { listDatasets } from "../utils/dataset"
import { useEffect, useState } from 'react';
import { TemplatebackendDataset } from '~/internal/client';
import { useAuth } from '~/utils/authContext';
import { getRiskAssessment } from '~/utils/RiskAssessmentArx';
import DataTable from '~/components/DataTable';

export default function RiskAssessmentArx() {
    // Authentication
    const { isLoggedIn } = useAuth();

    // Routing
    const router = useRouter();

    // States
    const [datasetsList, setDatasetsList] = useState<Array<TemplatebackendDataset>>([]);

    const getListDatasets = async (offset?: number, limit?: number) => {
        // Call API
        let response;
        if (!offset && !limit) {
            response = await listDatasets();
        } else if (offset && limit) {
            response = await listDatasets(
            );
        } else {
            console.log("ERROR You have to define both the offset and the limit") // TODO
            return;
        }
        const result = response?.result?.datasets
        if (result) {
            setDatasetsList(result);
        }
    }

    useEffect(() => {
        try {
            getListDatasets();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, []);

   
    // Event handlers
    const handleRowClick = (id: number | undefined) => {
        if (id) {
            router.push(`/dataset/${id}`);
        }
    };

    const handleRiskAssessment = async (id: number | undefined) => {
        if (id) { 
            const response = await getRiskAssessment(id);
            
            // Handle successful response
            if (response) {
                
                router.push(`/risk_assessment_arx/${id}`);
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
                    {/* Dataset table */}
                    {datasetsList.length > 0 ? (
                        <DataTable 
                            data={datasetsList.map(dataset => ({...dataset, datasetQuasiIdentifiers:"Not yet implemented"}))}
                            columns={[
                                {name:"id", header:"Dataset ID"},
                                {name:"datasetName", header:"Dataset Name"},
                                {name:"datasetQuasiIdentifiers", header: "Quasi-identifiers"},
                                {name:"createdAt", header:"Created At"},
                            ]}
                            onRowClick={(row) => handleRowClick(row.id)}
                            actions={[
                                {name:"Risk Assessment", callback: (row) => handleRiskAssessment(row.id)},
                            ]}
                        />
                    ) : (
                        <div className="text-center text-gray-500 mt-20">No datasets yet</div>
                    )}
                </div>
            )}
        </>
    );
}