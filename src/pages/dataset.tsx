import Head from 'next/head';
import { useRouter } from 'next/router';
import { deleteDataset, getDatasetCsv } from "../utils/dataset"
import DatasetSelector from '~/components/DatasetSelector';
import withAuth from '~/components/withAuth';
import { showToast } from '~/utils/showToast';
import { downloadBytesFile } from '~/utils/download';

function Dataset() {
    // Routing
    const router = useRouter();

    // Handlers
    const handleRowClick = (id: number | undefined) => {
        if (id) {
            router.push(`/dataset/${id}`);
        }
    }

    const handleTransform = async (id: number | undefined) => {
        if (id) {
            router.push(`/rule-based-deid/${id}`);
        }
    };

    const handleDelete = async (id: number | undefined) => {
        if (id) {
            try {
                const response = await deleteDataset(id);
                console.log("Dataset successfully deleted.")
                router.push("/dataset")// Needed to trigger a refresh for the dataset list
            } catch (error) {
                console.error("Error while trying to delete a dataset: ", error)
            } finally {
                showToast("success", "Dataset successfully deleted.")
            }
        }
    };

    const handleOpenDeidentificationNotebook = async (id: number | undefined) => {
        if (id) {
            router.push(`/deidentification-notebook/${id}`);
        }
    };

    const handleAssessRisk = async (id: number | undefined) => {
        if (id) {
            router.push(`/risk_assessment_arx/${id}`);
        }
    };

    const handleDownload = async (id: number | undefined) => {
        if (id) {
            try {
                const response = await getDatasetCsv(id);
                if (!response) {
                    throw new Error('No response from the server');
                }
                
                const data = await response.blob();
                downloadBytesFile(`dataset_${id}.csv`, data);
            } catch (error) {
                showToast("error", "Error while trying to download the dataset: " + error)
            } finally {
                showToast("success", "Dataset successfully downloaded.")
            }
        }
    };

    return (
        <>
            <Head>
                <title>My Datasets</title>
            </Head>
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Datasets</h1>
                </div>

                <DatasetSelector
                    onRowClick={handleRowClick}
                    actions={[
                        { name: "Rule-based DeID", callback: (id) => handleTransform(id) },
                        { name: "Formal DeID", callback: (id) => handleOpenDeidentificationNotebook(id) },
                        { name: "Assess risk", callback: (id) => handleAssessRisk(id) },
                        { name: "Download", callback: (id) => handleDownload(id) },
                        { name: "Delete", callback: (id) => handleDelete(id) },
                    ]}
                    preview
                />
            </div>       
        </>
    );
}

export default withAuth(Dataset)