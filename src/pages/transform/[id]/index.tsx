"use client";

import { useRouter } from 'next/router';
import TabsComponent from '../../../components/Tabs';
import dynamic from "next/dynamic";
import { Table } from 'flowbite-react';
import { getConfigs, createConfig } from "../../../utils/config"
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import { useEffect, useState } from 'react';
import { TemplatebackendColumn, TemplatebackendConfig, TemplatebackendGetConfigsReply, TemplatebackendMetadata } from '~/internal/client';
import { useAuth } from '~/utils/authContext';

const TransformPage = () => {

    const router = useRouter();
    const { id } = router.query; // Get the dynamic part of the URL
    const datasetId = Number(id);
    const { isLoggedIn } = useAuth();
    const [configs, setConfigs] = useState<TemplatebackendConfig[]>([]);

    const handleGetConfigs = async () => {
        const response = await getConfigs();
        if (response && response.result?.config && response.result?.config.length > 0) {
            console.log(response.result?.config)
            setConfigs(response.result?.config)
        }
    }
    useEffect(() => {
        if (id) {
            try {
                handleGetConfigs();
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
                <div>
                    <h1 className='mt-5 text-center text-xl font-bold'>Configurations</h1>

                    <div className="mt-5 overflow-x-auto w-full outline outline-offset-2 outline-gray-300 rounded ml-3">
                        {/* {configs.length > 0 ? (
                            <ul>
                                {configs.map((item, index) => (
                                    <li key={index}>
                                        <strong>{item.tenantid}:</strong> {item.scrambleFieldFields}

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No configuration data available.</p>
                        )} */}
                        <Table hoverable>
                            <Table.Head>
                                <Table.HeadCell>Id</Table.HeadCell>
                                <Table.HeadCell>Scramble Fields</Table.HeadCell>
                                <Table.HeadCell>Shift Dates</Table.HeadCell>
                                <Table.HeadCell>Created At</Table.HeadCell>


                            </Table.Head>
                            <Table.Body className="divide-y">
                                {configs.map((item, index) => (
                                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.id}
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.hasScrambleField ? 'Yes' : 'No'}
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.hasDateShift ? 'Yes' : 'No'}
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {item.createdAt ? item.createdAt.toLocaleDateString() : 'N/A'}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div >
                </div>}
        </>
    );
};

export default TransformPage;
