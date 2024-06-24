
import { Table } from 'flowbite-react';
import Head from 'next/head';
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import { useRouter } from 'next/router';
import { storeDataset, listDatasets } from "../utils/dataset"
import { useEffect, useState } from 'react';
import { TemplatebackendDataset } from '~/internal/client';
import { Button, Modal } from 'flowbite-react';
import Papa from "papaparse";
import { useAuth } from '~/utils/AuthContext';

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
    const { isLoggedIn } = useAuth();


    const getListDatasets = async (offset?: number, limit?: number) => {
        // Call API
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
        try {
            getListDatasets();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        const file = event.target.files[0];
        if (!file || !file.name) return;
        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (fileType !== 'csv') {
            alert('Please upload a CSV file.');
            event.target.value = '';
            return;
        }
        Papa.parse(file, {
            complete: (result) => {
                // const data = result.data as Record<string, any>[];
                if (result.data.length === 0) {
                    alert("No data found in the CSV.");
                    event.target.value = '';
                    return;
                }
                // setCsvData(result.data);
                console.log(result.data)
                // Get headers (column names)
                if (!result.data[0]) {
                    console.log("First item is undefined, which shouldn't happen.");
                    return;
                }

                //detect types
                const initialTypes = detectColumnTypes(result.data as Record<string, any>[]);
                setColumnTypes(initialTypes);
                // read data
                const headers = Object.keys(result.data[0]);
                console.log("headers: ", headers)
                const csvString = [
                    headers.join(",") // Header row
                ].concat(
                    result.data.map(row => {
                        const record = row as Record<string, any>;
                        return headers.map(fieldName => `"${String(record[fieldName] || '').replace(/"/g, '""')}"`).join(',')
                    })
                ).join('\\n');
                console.log("CSV Format String: ", csvString);
                // set variable
                setCsvString(csvString);
            },
            header: true,
        });
    };

    const detectColumnTypes = (data: Record<string, any>[]): ColumnTypes => {
        const types: ColumnTypes = {};
        const sampleData = data[0];
        for (const key in sampleData) {
            const value = sampleData[key];
            types[key] = typeof value;
            if (!isNaN(Date.parse(value)) && value.includes('-')) {
                types[key] = 'date';
            } else if (!isNaN(parseFloat(value))) {
                types[key] = Number.isInteger(parseFloat(value)) ? 'int' : 'float';
            }
        }
        return types;
    };
    const setColumnType = (column: string, type: string) => {
        setColumnTypes(prev => ({ ...prev, [column]: type }));
    };

    const processCSV = async () => {
        if (fileName == '') {
            alert("You must input a name for the dataset.")
            return;
        }
        // check that there is not already a dataset with same name
        const all_names = datasetsList.map((dataset) => dataset.datasetName);
        console.log(all_names.indexOf(fileName) > -1)
        if (all_names.indexOf(fileName) > -1) {
            alert("There already is a dataset with this name.")
            return;
        }
        if (csvString == '') {
            alert("You must upload a file.")
            return;
        }
        //open type detection window
        setIsTypeModalOpen(true);
    }

    const submitCSVToBackend = async () => {
        try {
            const types = JSON.stringify(columnTypes)
            const response = await storeDataset(fileName, csvString, types);
            if (!response) {
                alert('Failed to upload CSV');
            }
        } catch (error) {
            alert("Error uploading the CSV.");
        }
        setCsvString('');
        closeUploadModals();
    }

    const closeUploadModals = () => {
        setIsUploadModalOpen(false);
        setIsTypeModalOpen(false)
        setFileName('');
        getListDatasets();
    };
    const router = useRouter();
    const handleRowClick = (id: number | undefined) => {
        if (id) {
            router.push(`/dataset/${id}`);
        }
    };

    return (
        <>
            <Head>
                <title>Datasets</title>
            </Head>
            {!isLoggedIn &&
                <p className='m-8'> Please log in to consult your datasets.</p>
            }
            {isLoggedIn &&
                <div className="flex flex-col items-end p-5">
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                        <MdOutlineAdd size={30} />
                        <p className='ml-2 text-sm'> Upload</p>
                    </button>
                    <Modal show={isUploadModalOpen} onClose={() => closeUploadModals()}>
                        <Modal.Body>
                            <div className="space-y-6">
                                <h2 className="text-lg  mb-2">Upload CSV File</h2>
                                <input
                                    type="text"
                                    placeholder="Enter filename"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="input input-bordered w-full max-w-xs"
                                />
                                <input type="file" accept=".csv" onChange={handleFileUpload} />

                            </div>
                            <button className='mt-4 bg-gray-400 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer'
                                onClick={() => processCSV()}
                            >
                                Submit
                            </button>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => {
                                closeUploadModals();
                                router.push('dataset');
                            }}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={isTypeModalOpen} onClose={() => setIsTypeModalOpen(false)}>
                        <Modal.Header>
                            Edit Column Types
                        </Modal.Header>
                        <Modal.Body>
                            <div className="space-y-4">
                                {Object.keys(columnTypes).map((column, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span>{column}:</span>
                                        <select value={columnTypes[column]} onChange={(e) => setColumnType(column, e.target.value)} className="select select-bordered">
                                            <option value="string">String</option>
                                            <option value="int">Integer</option>
                                            <option value="float">Float</option>
                                            <option value="date">Date</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => submitCSVToBackend()}>Save</Button>
                        </Modal.Footer>
                    </Modal>

                    <div className="mt-5 overflow-x-auto w-full outline outline-offset-2 outline-gray-300 rounded">
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
                                    < Table.Row key={dataset.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleRowClick(dataset.id)}
                                    >
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {dataset.id}
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {dataset.datasetName}
                                        </Table.Cell>
                                        <Table.Cell> {dataset.createdAt ? new Date(dataset.createdAt).toLocaleDateString() : 'Date not available'}</Table.Cell>
                                        < Table.Cell >
                                            <a href="#" onClick={(e) => e.stopPropagation()}>
                                                <MdMoreHoriz size={20} />
                                            </a>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div >
                </div >
            }
        </>
    );
}
