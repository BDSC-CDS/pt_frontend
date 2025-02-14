
import { useRouter } from 'next/router';
import { listDatasets } from "../utils/dataset"
import { useEffect, useState } from 'react';
import { TemplatebackendDataset } from '~/internal/client';
import DataTable from '~/components/DataTable';
import DatasetPreviewModal from './modals/DatasetPreviewModal';
import { MdSearch } from 'react-icons/md';
import { showToast } from '~/utils/showToast';
import Spinner from './ui/Spinner';
import DatasetUploadModal from './modals/DatasetUploadModal';


interface DatasetSelectorProps {
    onRowClick: (row: number) => void;
    actions?: {
        name: string;
        callback: (row: number | undefined) => void;
    }[];
    preview?: boolean;
};

const DatasetSelector = ({
    actions,
    onRowClick,
    preview,
}: DatasetSelectorProps): JSX.Element => {
    const router = useRouter();

    const [datasetsList, setDatasetsList] = useState<Array<TemplatebackendDataset>>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
    const [datasetToPreview, setDatasetToPreview] = useState<number>()
    const [isLoading, setIsLoading] = useState(true);

    const getListDatasets = async (offset?: number, limit?: number) => {
        setIsLoading(true);
        try {
            let response;
            if (!offset && !limit) {
                response = await listDatasets();
            } else if (offset && limit) {
                response = await listDatasets(offset, limit);
            } else {
                console.log("ERROR: You have to define both the offset and the limit");
                return;
            }
            const result = response?.result?.datasets;
            if (result) {
                setDatasetsList(result);
            }
        } catch (error) {
            showToast("error", "Error listing datasets: " + error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handleRouteChange = () => {
            try {
                getListDatasets();
            } catch (error) {
                showToast("error", "Error listing datasets: "+error)
            }
        };

        // Attach event listener
        router.events.on('routeChangeComplete', handleRouteChange);

        // Initial load
        getListDatasets();

        // Clean up event listener on unmount
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    const mappedActions = actions?.map(a => {
        return { name: a.name, callback: (row: { id: number | undefined }) => a.callback(row.id)}
    })

    if(preview){
        mappedActions?.push()
    }

    const handleRowClick = (id: number | undefined) => {
        if (id) {
            onRowClick(id);
        }
    }

    const handlePreview = async (id: number | undefined) => {     
        if(id){
            setDatasetToPreview(id)
            setIsPreviewModalOpen(true)
        }
    }

    return (
        <>
            {isLoading ? (
                <div className="flex justify-center items-center h-96">
                    <Spinner />
                </div>
            ) : (
                <div>
                    {/* Dataset List */}
                    <DataTable
                        data={datasetsList.map(dataset => ({ ...dataset, id: dataset.id ?? 0 }))}
                        columns={[
                            { name: "id", header: "Dataset ID" },
                            { name: "datasetName", header: "Dataset Name" },
                            // { name: "datasetQuasiIdentifiers", header: "Quasi-identifiers" }, // NOT IMPLEMENTED: query dataset quasi-identifiers
                            { name: "createdAt", header: "Created At" },
                        ]}
                        onRowClick={(row) => handleRowClick(row.id)}
                        iconActions={preview ? [{Icon: MdSearch, tooltip: "Preview", callback: (row:any) => handlePreview(row.id)}] : undefined}
                        actions={mappedActions}
                        addRow={{
                            label: "New dataset",
                            onRowClick: () => setIsUploadModalOpen(true),
                        }}
                    />
                    
                    {/* Upload modal */}
                    {isUploadModalOpen && (
                        <DatasetUploadModal show={isUploadModalOpen} datasetNames={datasetsList.map(d => d.datasetName || "")} onSuccess={handleRowClick} onClose={() => setIsUploadModalOpen(false)} />
                    )}

                    {/* Preview modal */}
                    {preview && (
                        <DatasetPreviewModal show={isPreviewModalOpen} datasetId={datasetToPreview!} onClose={() => setIsPreviewModalOpen(false)} />
                    )}
                </div>
            )}
        </>
    );
}

export default DatasetSelector;