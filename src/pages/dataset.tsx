import { Table } from 'flowbite-react';
import Head from 'next/head';
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import { useRouter } from 'next/router';
import { storeDataset, listDatasets, deleteDataset } from "../utils/dataset";
import { useEffect, useState } from 'react';
import { TemplatebackendDataset } from '~/internal/client';
import { Button, Modal } from 'flowbite-react';
import Papa from "papaparse";
import { useAuth } from '~/utils/authContext';
import Link from 'next/link';


export default function Dataset() {
    interface ColumnTypes {
        [key: string]: string;
    }
    const [datasetsList, setDatasetsList] = useState<Array<TemplatebackendDataset>>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [csvString, setCsvString] = useState('');
    const [columnTypes, setColumnTypes] = useState<ColumnTypes>({});
    const [columnIdentifying, setColumnIdentifying] = useState<ColumnTypes>({});
    const { isLoggedIn } = useAuth();
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [csvPreview, setCsvPreview] = useState<string[][]>([]);

    const router = useRouter();

    const handleMenuOpen = (id: number | undefined) => {
        if (id) {
            setOpenMenuId(id);
        }
    };

    const handleMenuClose = () => {
        setOpenMenuId(null);
        getListDatasets();
    };

    const getListDatasets = async () => {
        const response = await listDatasets();
        const result = response?.result?.datasets;
        if (result) {
            setDatasetsList(result);
        }
    };

    useEffect(() => {
        try {
            getListDatasets();
        } catch (error) {
            alert("Error listing the datasets");
        }
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    };

    const processCSV = async () => {
     
    };

    const submitCSVToBackend = async () => {
     
    };

    const closeUploadModals = () => {
        setIsUploadModalOpen(false);
        setIsTypeModalOpen(false);
        setFileName('');
        getListDatasets();
    };

    const handleRowClick = (id: number | undefined) => {
        if (id) {
            router.push(`/dataset/${id}`);
        }
    };

    const handleTransform = async (id: number | undefined) => {
        if (id) {
            router.push(`/transform/${id}`);
        }
    };

    const handleDelete = async (id: number | undefined) => {
        if (id) {
            const response = await deleteDataset(id);
            getListDatasets();
        }
    };

    return (
        <>
            <Head>
                <title>Datasets</title>
            </Head>
            {!isLoggedIn && (
                <p className='m-8'> Please log in to consult your datasets.</p>
            )}
            {isLoggedIn && (
                <div className="flex flex-col p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Datasets</h1>
                        <div className="flex space-x-4">
                            <Link href='/questionnaire/new' passHref className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                                <span className="text-xl font-bold">+</span>
                                <p className='ml-2 text-sm'>New project</p>
                            </Link>
                        </div>
                    </div>

                    <Modal show={isUploadModalOpen} onClose={closeUploadModals}>
                        
                    </Modal>

                    <Modal show={isTypeModalOpen} onClose={() => setIsTypeModalOpen(false)}>
                        
                    </Modal>

                    {datasetsList.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                            <Table hoverable>
                                <Table.Head>
                                    <Table.HeadCell>Dataset ID</Table.HeadCell>
                                    <Table.HeadCell>Dataset name</Table.HeadCell>
                                    <Table.HeadCell>Date created</Table.HeadCell>
                                    <Table.HeadCell>
                                        <span className="sr-only">Edit</span>
                                    </Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {datasetsList.map((dataset) => (
                                        <Table.Row
                                            key={dataset.id}
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleRowClick(dataset.id)}
                                        >
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {dataset.id}
                                            </Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {dataset.datasetName}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {dataset.createdAt
                                                    ? new Date(dataset.createdAt).toLocaleDateString()
                                                    : 'Date not available'}
                                            </Table.Cell>
                                            <Table.Cell className="flex justify-start items-center" onMouseLeave={handleMenuClose}>
                                                <a onMouseEnter={() => handleMenuOpen(dataset.id)} className="text-gray-900 hover:text-blue-500">
                                                    <MdMoreHoriz size={20} />
                                                </a>
                                                {openMenuId === dataset.id && (
                                                    <div className="dropdown-menu">
                                                        <ul className="absolute w-40 bg-white rounded-md shadow-lg z-10">
                                                            <li
                                                                className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                onClick={() => handleTransform(dataset.id)}
                                                            >
                                                                Transform
                                                            </li>
                                                            <li
                                                                className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                onClick={() => handleDelete(dataset.id)}
                                                            >
                                                                Delete
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-20">No datasets yet</div>
                    )}
                </div>
            )}
        </>
    );
}
