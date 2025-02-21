import { Button, Modal } from "flowbite-react";
import { ReactNode, useEffect, useState } from "react";
import { TemplatebackendMetadata } from "~/internal/client";
import { getDatasetContent, getInfo, getMetadata } from "~/utils/dataset";
import DataTable from "../DataTable";
import Spinner from "../ui/Spinner";
import { useRouter } from "next/router";
import { showToast } from "~/utils/showToast";

interface DatasetPreviewModalProps {
    show: boolean
    datasetId: number,
    onClose: () => void,
}

interface DatasetInfo {
    name: string,
    createdAt?: Date,
    colNumber: number,
    rowNumber: number,
    metadata: TemplatebackendMetadata[],
    data: {}[],
    columns: { name: string; header: string; tooltip?: ReactNode; }[]
}

// Adjust the number of rows to preview here
const PREVIEW_NB_ROWS = 5

export default function DatasetPreviewModal({show, datasetId, onClose}: DatasetPreviewModalProps) {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(true)
    const [datasetInfo, setDatasetInfo] = useState<DatasetInfo>()

    const getDatasetInfo = async () => {
        try {
            setIsLoading(true)

            const response1 = await getInfo(datasetId);
            if (!response1?.dataset) {
                throw new Error("Dataset not found.")
            }

            const datasetName = response1.dataset.datasetName
            const datasetCreatedAt = response1.dataset.createdAt

            const response2 = await getMetadata(datasetId)
            if (!response2?.metadata) {
                throw new Error("Metadata not found.")
            }

            const datasetMetadata = response2.metadata.metadata
            const datasetColNumber = datasetMetadata?.length
            
            const response3 = await getDatasetContent(datasetId, 0, PREVIEW_NB_ROWS)
            if (!response3?.result || !response3?.result?.columns) {
                throw new Error("Dataset content not found.")
            }

            const datasetRowNumber = response3.result.nRows

            // Process dataset columns
            const datasetRows = getDataFromColumns(
                response3.result?.columns.map(c => c.value) ?? [], 
                datasetMetadata?.map(m => m.columnName) ?? []
            )
            
            // Process dataset metadata
            const datasetColumns = datasetMetadata? datasetMetadata.map((meta, index) => ({
                name: `column${meta.columnId}`,
                header: meta.columnName || `column${index}`,
                tooltip: (
                    <div className="text-sm" style={{ textTransform: "none" }}>
                        <p><strong>Type:</strong> {meta.type}</p>
                        <p><strong>Identifier:</strong> {meta.identifier}</p>
                        <p><strong>Is the ID Column:</strong> {meta.isId ? "Yes" : "No"}</p>
                    </div>
                )
            }))
            : [];

            // Construct new dataset info object
            const newDatasetInfo: DatasetInfo = {
                name: datasetName || "",
                createdAt: datasetCreatedAt || undefined,
                colNumber: datasetColNumber || 0,
                rowNumber: datasetRowNumber || 0,
                metadata: datasetMetadata || [],
                data: datasetRows,
                columns: datasetColumns
            }

            // Update state
            setDatasetInfo(newDatasetInfo)
        } catch (error) {
            console.error("Error fetching the dataset info:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
        
    }

    const getDataFromColumns = (columns:(string[] | undefined)[], metadata: (string | undefined)[]) => {
        const rows: Record<string, any>[] = Array.from({length: columns[0]!.length}, (_, rowIndex) => {
            const row: Record<string, any> = {}
            metadata.forEach((_, colIndex) => {
                row[`column${colIndex}`] = columns[colIndex]?.[rowIndex]
            })
            return row
        })

        return rows
    }

    useEffect(() => {
        if (show) {
            try {
                getDatasetInfo()
            } catch (error) {
                showToast("error", "Error retrieving dataset info.")
            }
        }
    }, [show]);

    // Handlers
    const handleCloseModal = () => {
        setIsLoading(true)
        onClose()
    }

    return (
        <>
            

            <Modal show={show} onClose={handleCloseModal} size="7xl">
                <Modal.Header/>
                <Modal.Body>
                    {isLoading ? (<Spinner/>) : (
                        <div className="flex flex-col gap-5">
                            {/* Dataset Info */}
                            {datasetInfo && (
                                <div className="bg-gray-50 p-5 rounded-lg border text-md ">
                                    <h2 className="text-lg font-bold mb-2"> {datasetInfo.name}</h2>
                                    <p><strong>Created Date:</strong> {datasetInfo.createdAt?.toLocaleDateString()} </p>
                                    <p><strong>Number of Rows:</strong> {datasetInfo.rowNumber}</p>
                                    <p><strong>Number of Columns:</strong> {datasetInfo.colNumber} </p>
                                </div>
                            )}
                            
                            {/* Dataset table view */}
                            {datasetInfo && (
                                <DataTable
                                    data={datasetInfo.data}
                                    columns={datasetInfo.columns}
                                />
                            )}
                        </div> 
                    )}                   
                </Modal.Body>
                <Modal.Footer className="flex justify-center gap-3">
                    <Button onClick={() => router.push(`/dataset/${datasetId}`)}>Go to Dataset</Button>
                    <Button color="gray" onClick={handleCloseModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};
