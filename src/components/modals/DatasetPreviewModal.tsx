import { Button, Modal } from 'flowbite-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getDatasetContent, getInfo } from '~/utils/dataset';

interface DatasetPreviewModalProps {
    show: boolean
    datasetId: number,
    onClose: () => void,
}

interface DatasetInfo {
    name: string,
    createdAt?: Date
}

export default function DatasetPreviewModal({show, datasetId, onClose}: DatasetPreviewModalProps) {
    const router = useRouter()

    const [datasetInfo, setDatasetInfo] = useState<DatasetInfo>({} as DatasetInfo)

    const getDatasetInfo = async () => {
        const response = await getInfo(datasetId);
        const datasetName = response?.dataset?.datasetName
        const datasetCreatedAt = response?.dataset?.createdAt

        if (!response?.dataset) {
            throw new Error("Dataset not found.")
        }

        setDatasetInfo({
            name: datasetName || "",
            createdAt: datasetCreatedAt || undefined 
        })

        console.log("info",datasetInfo)
    }

    // const getDatasetRows = async (id: number) => {
    //     const response = await getDatasetContent(id, 0, 10);
    //     const columns = response?.result?.columns

    //     if (columns && columns[0]){
    //         return columns[0].map((_, rowIndex) => {
    //             let row: Record<string, any> = {}
    //             metadata.forEach((meta, colIndex) => {
    //                 row[`column${meta.columnId}`] = columns[colIndex]?.[rowIndex]
    //             })
    //             return row
    //         })
    //     }

        

    //     return columns
    // }

    // useEffect(() => {
    //     try {
    //         getDatasetInfo();
    //     } catch (error) {
    //         alert("Error retrieving the dataset info.")
    //     }
    // }, []);

    useEffect(() => {
        if (show) getDatasetInfo();
    }, [show, datasetId]);
    
    return (
        <>
            <Modal show={show} onClose={onClose} size="4xl">
                <Modal.Header/>
                <Modal.Body>
                    <div className="bg-gray-100 p-5 rounded-lg shadow text-md ">
                        <h2 className="text-lg font-bold mb-2"> {datasetInfo.name}</h2>
                        <p><strong>Created Date:</strong> {datasetInfo.createdAt?.toLocaleDateString()} </p>
                        {/* <p><strong>Number of Rows:</strong> {nRows}</p>
                        <p><strong>Number of Columns:</strong> {nColumns} </p> */}
                    </div>
                    <br />
                    {/* Dataset table view
                    {metadata && columns && columns[0] ? (
                        <DataTable
                            data={}
                            columns={metadata?.map((meta, index) => ({
                                name: `column${meta.columnId}`,
                                header: meta.columnName ? meta.columnName : `column${index}`,
                                tooltip: (
                                    <div className="text-sm" style={{ textTransform: 'none' }}>
                                        <p><strong>Type:</strong> {meta.type}</p>
                                        <p><strong>Identifier:</strong> {meta.identifier}</p>
                                        <p><strong>Is the ID Column:</strong> {meta.isId ? 'Yes' : 'No'}</p>
                                    </div>
                                )
                            }))}
                        />
                    ) : (
                        <div className="text-center text-gray-500 mt-20">The dataset is empty.</div>
                    )} */}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};
