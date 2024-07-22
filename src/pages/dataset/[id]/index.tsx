"use client";

import { useRouter } from 'next/router';
import TabsComponent from '../../../components/Tabs';
import dynamic from "next/dynamic";
import { Table } from 'flowbite-react';
import { getMetadata, getDatasetContent } from "../../../utils/dataset"
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import { useEffect, useState } from 'react';
import { TemplatebackendColumn, TemplatebackendMetadata } from '~/internal/client';
import { useAuth } from '~/utils/authContext';

const DatasetPage = () => {
    const [metadata, setMetadata] = useState<Array<TemplatebackendMetadata>>();
    const [columns, setColumns] = useState<Array<Array<string | undefined> | undefined>>();
    const [nRows, setNRows] = useState<number>(0);
    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const datasetId = Number(id);
    const { isLoggedIn } = useAuth();
    const getDatasetMetadata = async () => {
        const response = await getMetadata(datasetId);
        if (response) {
            setMetadata(response.metadata?.metadata)
        }
    }
    const getAndProcessDatasetContent = async () => {
        const response = await getDatasetContent(datasetId);
        if (response && response.result?.columns) {
            const result = response.result?.columns.map((col) => {
                return col.value;
            })
            if (result) {
                console.log(result)
                setColumns(result)
                if (result[0]) {
                    setNRows(result[0].length)
                }
            }
        }
    }
    const handleTransform = async () => {
        if (datasetId) {
            router.push(`/transform/${datasetId}`);
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
    }, [id]);

    return (
        <>
            {!isLoggedIn &&
                <p className='m-8'> Please log in to consult your datasets.</p>
            }
            {isLoggedIn &&
                <>
                    <div className="mt-5 overflow-x-auto w-full outline outline-offset-2 outline-gray-300 rounded ml-3">
                        <Table hoverable>
                            <Table.Head>
                                {metadata?.map((meta) =>
                                    <Table.HeadCell>{meta.columnName}</Table.HeadCell>
                                )}

                            </Table.Head>
                            <Table.Body className="divide-y">

                                {Array.from({ length: nRows }, (_, index) => (
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
                    <button onClick={handleTransform} className=' w-40 m-5 ml-2 bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer'> Transform </button>
                </>
            }
        </>
    );
};

export default DatasetPage;
