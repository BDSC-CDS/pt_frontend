"use client";

import { useRouter } from 'next/router';
import { getMetadata, getDatasetContent, revertDataset, getInfo, getDatasetCsv, deleteDataset, getDatasetDataframe } from "../../../utils/dataset"
import { useEffect, useState } from 'react';
import { TemplatebackendMetadata } from '~/internal/client';
import {
    BiCalculator,
    BiSolidReport,
    BiSolidRuler,
    BiUndo,
} from "react-icons/bi";
import DataTable from '~/components/DataTable';
import withAuth from '~/components/withAuth';
import { showToast } from '~/utils/showToast';
import { downloadBytesFile } from '~/utils/download';
import { MdDelete, MdDownload, MdEdit } from 'react-icons/md';
import { HiPencilAlt } from 'react-icons/hi';
import DatasetEditMetadataModal from '~/components/modals/DatasetEditMetadataModal';
import DatasetRenameModal from '~/components/modals/DatasetRenameModal';
import Spinner from '~/components/ui/Spinner';

const DatasetPage = () => {
    // Routing
    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const datasetId = Number(id);

    // States
    const [metadata, setMetadata] = useState<Array<TemplatebackendMetadata>>();
    const [columns, setColumns] = useState<Array<Array<string | undefined> | undefined>>();
    const [nRows, setNRows] = useState<number>(0);
    const [nColumns, setNColumns] = useState(0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10); // Rows per page
    const [currentRows, setCurrentRows] = useState<number>(0); // Number of rows in the current page
    const [datasetName, setDatasetName] = useState<string>();
    const [createdAt, setCreatedAt] = useState<Date>();
    const [datasetOriginalFilename, setDatasetOriginalFilename] = useState<string>();
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showEditMetadataModal, setShowEditMetadataModal] = useState(false);
    // const [pageInput, setPageInput] = useState<number>(page + 1);


    // Fetch metadata
    const getDatasetMetadata = async () => {
        const response = await getMetadata(datasetId);
        if (response) {
            setMetadata(response.metadata?.metadata)
            if (response?.metadata?.metadata) {
                setNColumns(response.metadata?.metadata.length);
            }
        }
    }

    const getAndProcessDatasetContent = async () => {
        const offset = page * limit;
        const response = await getDatasetContent(datasetId, offset, limit);
        if (response && response.result?.columns) {
            const result = response.result?.columns.map(col => col.value);
            setColumns(result);
            setCurrentRows(result[0]?.length || 0);
        }
        if (response && response.result?.nRows) {
            setNRows(response.result?.nRows)
        }
    }

    const getDatasetInfo = async () => {
        const response = await getInfo(datasetId);
        if (response?.dataset) {
            setDatasetName(response.dataset.datasetName);
            setCreatedAt(response.dataset.createdAt);
            setDatasetOriginalFilename(response.dataset.originalFilename);
        }
    }

    useEffect(() => {
        const handleRouteChange = () => {
            try {
                getDatasetMetadata();
                getDatasetInfo();
                getAndProcessDatasetContent();
            } catch (error) {
                showToast("error", "Error retrieving dataset data.")
            }
        };

        // Attach event listener
        router.events.on('routeChangeComplete', handleRouteChange);

        // Initial load
        handleRouteChange();

        // Clean up event listener on unmount
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [id, page, limit, router.events]);

    // Event handlers
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPage = e.target.value === '' ? '' : parseInt(e.target.value, 10);
        if (newPage === '' || (newPage > 0 && newPage <= Math.ceil(nRows / limit))) {
            setPage(Number(newPage) - 1);
        }
    };

    const handleNextPage = () => {
        if ((page + 1) * limit < nRows) {
            setPage(prev => prev + 1);
        }
    }

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(prev => prev - 1);
        }
    }

    const handleDownloadCSV = async () => {
        if (datasetId) {
            try {
                const response = await getDatasetCsv(datasetId);
                if (!response) {
                    throw new Error('No response from the server');
                }

                const data = await response.blob();
                downloadBytesFile(`dataset_${datasetId}.csv`, data);
            } catch (error) {
                showToast("error", "Error while trying to download the dataset: " + error)
            } finally {
                showToast("success", "Dataset successfully downloaded.")
            }
        }
    }

    const handleDownloadDataframe = async () => {
        if (datasetId) {
            try {
                const response = await getDatasetDataframe(datasetId);
                if (!response) {
                    throw new Error('No response from the server');
                }

                const data = await response.blob();
                downloadBytesFile(`dataset_${datasetId}.parquet`, data);
            } catch (error) {
                showToast("error", "Error while trying to download the dataset: " + error)
            } finally {
                showToast("success", "Dataset successfully downloaded.")
            }
        }
    }

    const handleDelete = async () => {
        if (datasetId) {
            try {
                const response = await deleteDataset(datasetId);
                console.log("Dataset successfully deleted.")
                router.push("/dataset")
            } catch (error) {
                console.error("Error while trying to delete a dataset: ", error)
            } finally {
                showToast("success", "Dataset successfully deleted.")
            }
        }
    }

    const handleTransform = async () => {
        if (datasetId) {
            router.push(`/rule-based-deid/${datasetId}`);
        }
    };
    const handleRiskAssess = async () => {
        if (datasetId) {
            router.push(`/risk_assessment_arx/${datasetId}`);
        }
    };
    const handleDeidentify = async () => {
        if (datasetId) {
            router.push(`/deidentification-notebook/${datasetId}`);
        }
    };
    const handleReverse = async () => {
        if (datasetId) {
            const response = await revertDataset(datasetId);
            if (response && response?.id) {
                router.push(`/dataset/${response.id}`);
            } else {
                showToast("error", "The dataset has not been transformed yet.");
            }
        }
    };

    return (
        <> 
            <div className="flex justify-between items-center mb-4">
                <div className="bg-gray-100 p-5 rounded-lg shadow text-md w-1/2">
                    <h2 className="text-lg font-bold mb-2"> {datasetName}</h2>
                    <p><strong>Created Date:</strong> {createdAt?.toLocaleString()} </p>
                    <p><strong>Number of Rows:</strong> {nRows}</p>
                    <p><strong>Number of Columns:</strong> {nColumns} </p>
                    <p><strong>Original Filename:</strong> {datasetOriginalFilename} </p>
                </div>

                <div className="flex flex-col gap-2 ">
                    <button
                        className="flex items-center gap-2 p-2 rounded bg-gray-300 hover:bg-gray-200"
                        onClick={() => setShowRenameModal(true)}
                    >
                        <HiPencilAlt />
                        Rename Dataset
                    </button>
                    <button
                        className="flex items-center gap-2 p-2 rounded bg-gray-300 hover:bg-gray-200"
                        onClick={() => setShowEditMetadataModal(true)}
                    >
                        <MdEdit />
                        Edit Metadata
                    </button>
                    <button
                        className="flex items-center gap-2 p-2 rounded bg-gray-300 hover:bg-gray-200"
                        onClick={handleDownloadCSV}
                    >
                        <MdDownload />
                        Download CSV
                    </button>
                    <button
                        className="flex items-center gap-2 p-2 rounded bg-gray-300 hover:bg-gray-200"
                        onClick={handleDownloadDataframe}
                    >
                        <MdDownload />
                        Download Dataframe
                    </button>
                    {/* <button
                        className="flex items-center gap-2 p-2 rounded bg-gray-300 hover:bg-red-200"
                        onClick={handleDelete}
                    >
                        <MdDelete/>
                        Delete
                    </button> */}
                </div>
            </div>

            {/* DatasetRenameModal modal */}
            <DatasetRenameModal show={showRenameModal} onClose={() => setShowRenameModal(false)} datasetId={datasetId} datasetName={datasetName || ""} />

            {/* DatasetEditMetadata modal */}
            <DatasetEditMetadataModal show={showEditMetadataModal} onClose={() => setShowEditMetadataModal(false)} datasetId={datasetId} />
            
            <br />


            Actions you can perform with this dataset:

            <div className="inline-flex rounded-md shadow-sm pl-8 pb-8" role="group">
                <button onClick={handleTransform} type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    <BiSolidRuler className="w-3 h-3 me-2" />
                    Rule based-deidentification
                </button>
                <button onClick={handleReverse} type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    <BiUndo className="w-3 h-3 me-2" />
                    Reverse transformation
                </button>
                <button onClick={handleRiskAssess} type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    <BiCalculator className="w-3 h-3 me-2" />
                    Assess risk of reidentification
                </button>
                <button onClick={handleDeidentify} type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">
                    <BiSolidReport className="w-3 h-3 me-2" />
                    Deidentify in a notebook using ARX
                </button>
            </div>

            {/* Dataset table view */}
            {metadata && columns && columns[0] ? (
                <DataTable
                    data={columns[0].map((_, rowIndex) => {
                        let row: Record<string, any> = {}
                        metadata.forEach((meta, colIndex) => {
                            row[`column${meta.columnId}`] = columns[colIndex]?.[rowIndex]
                        })
                        return row
                    })}
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
                 <div className="flex justify-center items-center h-28 w-full">
                    <Spinner/>
                </div>
            )}

            {/* Pagination Controls */}
            <div className='flex justify-center items-center  space-x-2 mt-4 '>
                <span className='flex justify-center '>Page </span>
                <input
                    type="number"
                    min="1"
                    max={Math.ceil(nRows / limit)}
                    value={page + 1}
                    onChange={handlePageInputChange}
                    className="border rounded w-16 p-1 text-center"
                />
            </div>
            <div className="flex justify-end items-center  space-x-2 mt-2">
                <button
                    className={`p-2 w-24 rounded ${page === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-200'}`}
                    onClick={handlePrevPage}
                    disabled={page === 0}
                >
                    Previous
                </button>
                <button
                    className={`p-2 w-24 rounded ${((page + 1) * limit >= nRows) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-200'}`}
                    onClick={handleNextPage}
                    disabled={(page + 1) * limit >= nRows}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default withAuth(DatasetPage);
