
import { useRouter } from 'next/router';
import { listDatasets } from "../utils/dataset"
import { useEffect, useState } from 'react';
import { TemplatebackendDataset } from '~/internal/client';
import DataTable from '~/components/DataTable';
import DatasetPreviewModal from './modals/DatasetPreviewModal';


interface DatasetSelectorProps {
    actions?: {
        name: string;
        callback: (row: number | undefined) => void;
    }[];
    preview?: boolean;
};

const DatasetSelector = ({
    actions,
    preview,
}: DatasetSelectorProps): JSX.Element => {
    const router = useRouter();

    const [datasetsList, setDatasetsList] = useState<Array<TemplatebackendDataset>>([]);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
    const [datasetToPreview, setDatasetToPreview] = useState<number>()

    const handleRowClick = (id: number | undefined) => {
        if (id) {
            router.push(`/dataset/${id}`);
        }
    };

    const getListDatasets = async (offset?: number, limit?: number) => {
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
        const handleRouteChange = () => {
            try {
                getListDatasets();
            } catch (error) {
                alert("Error listing the datasets: "+error)
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
        return { name: a.name, callback: (row: { id: number | undefined }) => a.callback(row.id) }
    })

    if(preview){
        mappedActions?.push({name: "Preview", callback: (row) => previewDataset(row.id)})
    }

    const previewDataset = async (id: number | undefined) => {     
        if(id){
            setDatasetToPreview(id)
            setIsPreviewModalOpen(true)
        }
    }

    return (
        <>
            {datasetsList.length > 0 ? (
                <DataTable
                    data={datasetsList.map(dataset => ({ ...dataset, id: dataset.id ?? 0 }))}
                    columns={[
                        { name: "id", header: "Dataset ID" },
                        { name: "datasetName", header: "Dataset Name" },
                        // { name: "datasetQuasiIdentifiers", header: "Quasi-identifiers" },
                        { name: "createdAt", header: "Created At" },
                    ]}
                    onRowClick={(row) => handleRowClick(row.id)}
                    actions={mappedActions}
                />
            ) : (
                <div className="text-center text-gray-500 mt-20">No datasets yet</div>
            )}

           
            <DatasetPreviewModal show={isPreviewModalOpen} datasetId={datasetToPreview!} onClose={()=>setIsPreviewModalOpen(false)}/>
        </>
    );
}

export default DatasetSelector;