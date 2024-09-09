"use client";

import { useRouter } from 'next/router';
import TabsComponent from '../../../components/Tabs';
import dynamic from "next/dynamic";
import { Table, Tooltip } from 'flowbite-react';
import { getMetadata, getDatasetContent, revertDataset } from "../../../utils/dataset"
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import { useEffect, useState } from 'react';
import { TemplatebackendColumn, TemplatebackendMetadata } from '~/internal/client';
import { useAuth } from '~/utils/authContext';

const DatasetPage = () => {
    const [metadata, setMetadata] = useState<Array<TemplatebackendMetadata>>();
    const [columns, setColumns] = useState<Array<Array<string | undefined> | undefined>>();
    const [nRows, setNRows] = useState<number>(0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10); // Rows per page
    const [currentRows, setCurrentRows] = useState<number>(0); // Number of rows in the current page
    // const [pageInput, setPageInput] = useState<number>(page + 1);

    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const datasetId = Number(id);
    const { isLoggedIn } = useAuth();

    // Fetch metadata
    const getDatasetMetadata = async () => {
        const response = await getMetadata(datasetId);
        if (response) {
            setMetadata(response.metadata?.metadata)
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

    const handleTransform = async () => {
        if (datasetId) {
            router.push(`/transform/${datasetId}`);
        }
    };
    const handleReverse = async () => {
        if (datasetId) {
            const response = await revertDataset(datasetId);
            if (response && response?.id) {
                router.push(`/dataset/${response.id}`);
            } else {
                alert("The dataset has not been transformed and therefore cannot be reversed.");
            }
        }
    };

    useEffect(() => {
        if (id) {
            try {
                getDatasetMetadata();
                getAndProcessDatasetContent();
            } catch (error) {
                alert("Error getting the data");
            }
        }
    }, [id, page, limit]);

    return (
        <>
            {!isLoggedIn &&
                <p className='m-8'> Please log in to consult your datasets.</p>
            }
            {isLoggedIn &&
                <>
                    <div className='flex justify-center items-center'>
                        <button onClick={handleTransform} className=' w-40 m-5 ml-2 bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer'> Transform </button>
                        <button onClick={handleReverse} className=' w-40 m-5 ml-2 bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer'> Reverse </button>
                    </div>
                    <div className="mt-5 overflow-x-auto w-full outline outline-offset-2 outline-gray-300 rounded ml-3">
                        <Table hoverable>
                            <Table.Head>
                                {metadata?.map((meta) =>
                                    <Table.HeadCell key={meta.columnId}>
                                        <Tooltip
                                            content={(
                                                <div className="text-sm" style={{ textTransform: 'none' }}>
                                                    <p><strong>Type:</strong> {meta.type}</p>
                                                    <p><strong>Identifier:</strong> {meta.identifier}</p>
                                                    <p><strong>Is the ID Column:</strong> {meta.isId ? 'Yes' : 'No'}</p>
                                                </div>
                                            )}
                                        >
                                            <span className="cursor-pointer">{meta.columnName}</span>
                                        </Tooltip>
                                    </Table.HeadCell>
                                )}

                            </Table.Head>
                            <Table.Body className="divide-y">

                                {Array.from({ length: currentRows }, (_, index) => (
                                    < Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {/* Display each cell in a row. Assuming you need multiple cells per row here, adjust accordingly */}
                                        {columns?.map((col, colIndex) => (

                                            <Table.Cell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {col?.at(index)}
                                            </Table.Cell>
                                        ))}

                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div >


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
                    {/* Page Number Input */}
                    {/* <div className="flex justify-end items-center space-x-2 mt-2">
                        <input
                            type="number"
                            min="1"
                            max={Math.ceil(nRows / limit)}
                            value={pageInput}
                            onChange={handlePageInputChange}
                            className="border rounded w-16 p-1 text-center"
                        />
                        <button
                            className="bg-gray-500 text-white p-2 rounded"
                            onClick={handleGoToPage}
                        >
                            Go to Page
                        </button>
                    </div> */}

                </>
            }
        </>
    );
};

export default DatasetPage;
