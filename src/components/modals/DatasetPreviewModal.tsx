import { Button, Modal } from 'flowbite-react';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { TemplatebackendColumn, TemplatebackendMetadata } from '~/internal/client';
import { getDatasetContent, getInfo, getMetadata } from '~/utils/dataset';
import DataTable from '../DataTable';

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

export default function DatasetPreviewModal({show, datasetId, onClose}: DatasetPreviewModalProps) {
    const router = useRouter()

    const [datasetInfo, setDatasetInfo] = useState<DatasetInfo>({
        name: "",
        createdAt: undefined,
        colNumber: 0,
        rowNumber: 0,
        metadata: [],
        data: [],
        columns: [],
    })

    const getDatasetInfo = async () => {
        const response1 = await getInfo(datasetId);
        if (!response1?.dataset) {
            throw new Error("Dataset not found.")
        }

        const response2 = await getMetadata(datasetId)
        if (!response2?.metadata) {
            throw new Error("Metadata not found.")
        }
        
        const response3 = await getDatasetContent(datasetId, 0, 5)
        if (!response3?.result) {
            throw new Error("Dataset content not found.")
        }

        const datasetName = response1.dataset.datasetName
        const datasetCreatedAt = response1.dataset.createdAt
        const datasetMetadata = response2.metadata.metadata
        const datasetColNumber = datasetMetadata?.length
        const datasetRowNumber = response3.result.nRows
        // const datasetRows = getDataFromColumns(response3.result.columns!.map(c => c.value), datasetMetadata!.map(m => m.columnName))
        const datasetColumns = datasetMetadata? datasetMetadata.map((meta, index) => ({
              name: `column${meta.columnId}`,
              header: meta.columnName || `column${index}`,
              tooltip: (
                  <div className="text-sm" style={{ textTransform: 'none' }}>
                      <p><strong>Type:</strong> {meta.type}</p>
                      <p><strong>Identifier:</strong> {meta.identifier}</p>
                      <p><strong>Is the ID Column:</strong> {meta.isId ? 'Yes' : 'No'}</p>
                  </div>
              )
          }))
        : [];

        const newDatasetInfo: DatasetInfo = {
            name: datasetName || "",
            createdAt: datasetCreatedAt || undefined,
            colNumber: datasetColNumber || 0,
            rowNumber: datasetRowNumber || 0,
            metadata: datasetMetadata || [],
            data: [],
            columns: datasetColumns
        }

        setDatasetInfo(newDatasetInfo)
    }

    // const getDataFromColumns = (columns:(string[] | undefined)[], metadata: (string | undefined)[]) => {
    //     const rows: Record<string, any>[] = Array.from({length: 5}, (_, rowIndex) => {
    //         const row: Record<string, any> = {}
    //         metadata.forEach((meta, colIndex) => {
    //             row[meta!] = columns[rowIndex]?.[colIndex]
    //         })
    //         return row
    //     })

    //     return rows
    // }

    useEffect(() => {
        if (show) {
            try {
                getDatasetInfo()
            } catch (error) {
                alert("Error retrieving the dataset info.")
            }
        }
    }, [show, datasetId]);
    
    return (
        <>
            <Modal show={show} onClose={onClose} size="4xl">
                <Modal.Header/>
                <Modal.Body>
                    <div className="bg-gray-100 p-5 rounded-lg shadow text-md ">
                        <h2 className="text-lg font-bold mb-2"> {datasetInfo.name}</h2>
                        <p><strong>Created Date:</strong> {datasetInfo.createdAt?.toLocaleDateString()} </p>
                        <p><strong>Number of Rows:</strong> {datasetInfo.rowNumber}</p>
                        <p><strong>Number of Columns:</strong> {datasetInfo.colNumber} </p>
                    </div>
                    <br />
                    {/* Dataset table view */}
                    {datasetInfo && (
                        <DataTable
                            data={datasetInfo.data}
                            columns={datasetInfo.columns}
                        />
                    )}
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};
