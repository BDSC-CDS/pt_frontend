"use client";

import { useRouter } from 'next/router';
import TabsComponent from '../../../components/Tabs';
import dynamic from "next/dynamic";
import { Table } from 'flowbite-react';
import { get_metadata, get_dataset_content } from "../../../utils/dataset"
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import { useEffect, useState } from 'react';
import { TemplatebackendColumn, TemplatebackendMetadata } from '~/internal/client';
import { useAuth } from '~/utils/AuthContext';

const DatasetPage = () => {
    const [metadata, setMetadata] = useState<Array<TemplatebackendMetadata>>();
    const [columns, setColumns] = useState<Array<Array<string | undefined> | undefined>>();
    const [nRows, setNRows] = useState<number>(0);
    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const datasetId = Number(id);
    const { isLoggedIn } = useAuth();
    const getDatasetMetadata = async () => {
        const response = await get_metadata(datasetId);
        if (response) {
            setMetadata(response.metadata?.metadata)
        }
    }
    const getDatasetContent = async () => {
        const response = await get_dataset_content(datasetId);
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
    useEffect(() => {
        if (id) {
            try {
                getDatasetMetadata();
                getDatasetContent();
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
                <div className="mt-5 overflow-x-auto w-full outline outline-offset-2 outline-gray-300 rounded ml-3">
                    <Table hoverable>
                        <Table.Head>
                            {metadata?.map((meta) =>
                                <Table.HeadCell>{meta.columnName}</Table.HeadCell>
                            )}
                            {/* <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell> */}
                        </Table.Head>
                        <Table.Body className="divide-y">

                            {/* {columns?.map((element) => ( */}
                            {Array.from({ length: nRows }, (_, index) => (
                                < Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                // onClick={() => handleRowClick(dataset.id)}
                                >
                                    {/* Display each cell in a row. Assuming you need multiple cells per row here, adjust accordingly */}
                                    {columns?.map((col, colIndex) => (

                                        <Table.Cell key={colIndex} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {col?.at(index)}
                                        </Table.Cell>
                                    ))}
                                    {/* < Table.Cell >
                                    <a href="#" onClick={(e) => e.stopPropagation()}>
                                        <MdMoreHoriz size={20} />
                                    </a>
                                </Table.Cell> */}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div >
            }
        </>
    );
};

export default DatasetPage;
