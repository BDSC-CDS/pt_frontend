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
    const [csvPreview, setCsvPreview] = useState<string[][]>([]); // New state for CSV preview

    const handleMenuOpen = (id: number | undefined) => {
        if (id) {
            setOpenMenuId(id);
        }
    };

    const handleMenuClose = () => {
        setOpenMenuId(null);
        getListDatasets();
    };

    const getListDatasets = async (offset?: number, limit?: number) => {
        // Call API
        let response;
        if (!offset && !limit) {
            response = await listDatasets();
        } else if (offset && limit) {
            response = await listDatasets();
        } else {
            console.log("ERROR You have to define both the offset and the limit"); // TODO
            return;
        }
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
                if (result.data.length === 0) {
                    alert("No data found in the CSV.");
                    event.target.value = '';
                    return;
                }

                // Get headers (column names)
                if (!result.data[0]) {
                    console.log("First item is undefined, which shouldn't happen.");
                    return;
                }

                // Detect types
                const initialTypes = detectColumnTypes(result.data as Record<string, any>[]);
                setColumnTypes(initialTypes);

                // Initialize columnIdentifying with default values
                const initialIdentifying: ColumnTypes = {};
                Object.keys(initialTypes).forEach(key => {
                    initialIdentifying[key] = 'identifier';
                });
                setColumnIdentifying(initialIdentifying);

                // Read data
                const headers = Object.keys(result.data[0]);
                console.log("headers: ", headers);
                const csvString = [
                    headers.join(",") // Header row
                ].concat(
                    result.data.map(row => {
                        const record = row as Record<string, any>;
                        return headers.map(fieldName => `"${String(record[fieldName] || '').replace(/"/g, '""')}"`).join(',');
                    })
                ).join('\\n');

                // Set variable
                setCsvString(csvString);
                // Set preview (first 5 rows)
                setCsvPreview([headers, ...result.data.slice(0, 3).map(row => headers.map(header => (row as Record<string, any>)[header] || ''))]);
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
    const setColumnIdentifying_ = (column: string, type: string) => {
        console.log("SET COLUMN IDENTIFIER: ", column, " AT VALUE ", type);
        setColumnIdentifying(prev => ({ ...prev, [column]: type }));
    };
    const processCSV = async () => {
        if (fileName == '') {
            alert("You must input a name for the dataset.");
            return;
        }
        // Check that there is not already a dataset with the same name
        const all_names = datasetsList.map((dataset) => dataset.datasetName);
        if (all_names.indexOf(fileName) > -1) {
            alert("There already is a dataset with this name.");
            return;
        }
        if (csvString == '') {
            alert("You must upload a file.");
            return;
        }
        // Open type detection window
        setIsTypeModalOpen(true);
    };

    const submitCSVToBackend = async () => {
        try {
            const types = JSON.stringify(columnTypes);
            const identifiers = JSON.stringify(columnIdentifying);
            const response = await storeDataset(fileName, csvString, types, identifiers);
            if (!response) {
                alert('Failed to upload CSV');
            }
        } catch (error) {
            alert("Error uploading the CSV.");
        }
        setCsvString('');
        closeUploadModals();
    };

    const closeUploadModals = () => {
        setIsUploadModalOpen(false);
        setIsTypeModalOpen(false);
        setFileName('');
        getListDatasets();
    };
    const router = useRouter();

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
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer flex items-center"
                        >
                            <MdOutlineAdd size={20} />
                            <span className='ml-2 text-sm'>New project</span>
                        </button>
                    </div>
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
                            Data information
                        </Modal.Header>
                        <Modal.Body>
                            <div className="space-y-4">
                                <div className="mb-4">
                                    <Table className="text-xs border border-slate-400 rounded">
                                        <Table.Head>
                                            {csvPreview[0]?.map((header, index) => (
                                                <Table.HeadCell className="text-xs" key={index}>{header}</Table.HeadCell>
                                            ))}
                                        </Table.Head>
                                        <Table.Body>
                                            {csvPreview.slice(1).map((row, rowIndex) => (
                                                <Table.Row key={rowIndex}>
                                                    {row.map((cell, cellIndex) => (
                                                        <Table.Cell key={cellIndex} className='py-1'>{cell}</Table.Cell>
                                                    ))}
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                                <div className="flex items-center justify-between font-bold">
                                    <span className="w-1/2">Column Name</span>
                                    <div className="flex space-x-4 w-1/2">
                                        <span className="w-1/2">Type</span>
                                        <span className="w-1/2">Identifier</span>
                                    </div>
                                </div>
                                {Object.keys(columnTypes).map((column, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="w-1/2">{column}:</span>
                                        <div className="flex space-x-4 w-1/2">
                                            <select
                                                value={columnTypes[column]}
                                                onChange={(e) => setColumnType(column, e.target.value)}
                                                className="select select-bordered w-1/2"
                                            >
                                                <option value="string">String</option>
                                                <option value="int">Integer</option>
                                                <option value="float">Float</option>
                                                <option value="date">Date</option>
                                            </select>
                                            <select
                                                value={columnIdentifying[column]}
                                                onChange={(e) => setColumnIdentifying_(column, e.target.value)}
                                                className="select select-bordered w-1/2"
                                            >
                                                <option value="identifier">Identifier</option>
                                                <option value="quasi-identifier">Quasi-identifier</option>
                                                <option value="non-identifying">Non-identifying</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => submitCSVToBackend()}>Save</Button>
                        </Modal.Footer>
                    </Modal>

                    {datasetsList.length > 0 ? (
                        <div className="mt-4 overflow-x-auto w-full border border-gray-200 rounded-lg">
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
                                        <Table.Row key={dataset.id} className="bg-white hover:bg-gray-50 cursor-pointer">
                                            <Table.Cell onClick={() => handleRowClick(dataset.id)} className="whitespace-nowrap font-medium text-gray-900">
                                                {dataset.id}
                                            </Table.Cell>
                                            <Table.Cell onClick={() => handleRowClick(dataset.id)} className="whitespace-nowrap font-medium text-gray-900">
                                                {dataset.datasetName}
                                            </Table.Cell>
                                            <Table.Cell onClick={() => handleRowClick(dataset.id)}>
                                                {dataset.createdAt ? new Date(dataset.createdAt).toLocaleDateString() : 'Date not available'}
                                            </Table.Cell>
                                            <Table.Cell className="flex justify-center items-center" onMouseLeave={handleMenuClose}>
                                                <a onMouseEnter={() => handleMenuOpen(dataset.id)} className="text-gray-900 hover:text-blue-500">
                                                    <MdMoreHoriz size={20} />
                                                </a>
                                                {openMenuId === dataset.id && (
                                                    <div className="dropdown-menu absolute z-10 mt-2 bg-white rounded-lg shadow-lg">
                                                        <ul className="py-1">
                                                            <li className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                onClick={() => handleTransform(dataset.id)}>Transform</li>
                                                            <li className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                onClick={() => handleDelete(dataset.id)}>Delete</li>
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
