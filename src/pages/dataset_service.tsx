
import { Table } from 'flowbite-react';
import Head from 'next/head';
import SideMenu from '~/components/SideMenu';
import { MdOutlineAdd, MdMoreHoriz } from "react-icons/md";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { store_dataset, list_datasets } from "../utils/dataset"
import { useEffect, useState } from 'react';
import { TemplatebackendDataset } from '~/internal/client';
import { Button, Modal } from 'flowbite-react';
import Papa from "papaparse";

export default function DatasetService() {
    const [listDatasets, setListDatasets] = useState<Array<TemplatebackendDataset>>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [csvString, setCsvString] = useState('');

    const getListDatasets = async (offset?: number, limit?: number) => {
        // Call API
        let response;
        if (!offset && !limit) {
            response = await list_datasets();
        } else if (offset && limit) {
            response = await list_datasets(
            );
        } else {
            console.log("ERROR You have to define both the offset and the limit") // TODO
            return;
        }
        const result = response?.result?.datasets
        if (result) {
            setListDatasets(result);
        }
    }
    useEffect(() => {
        try {
            getListDatasets();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, []);


    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const fileType = file.name.split('.').pop().toLowerCase();
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
                // setCsvData(result.data);
                console.log(result.data)
                // Get headers (column names)
                const headers = Object.keys(result.data[0]);
                console.log("headers: ", headers)
                const csvString = [
                    headers.join(",") // Header row
                ].concat(
                    result.data.map(row =>
                        headers.map(fieldName => `"${String(row[fieldName] || '').replace(/"/g, '""')}"`).join(',')
                    )
                ).join('\\n');
                console.log("CSV Format String: ", csvString);
                // set variable
                setCsvString(csvString);
            },
            header: true,
        });
    };
    const submitCSVToBackend = async () => {
        //send CSV to API
        if (fileName == '') {
            alert("You must input a name for the dataset.")
            return;
        }
        const all_names = listDatasets.map((dataset) => dataset.datasetName);
        console.log(all_names.indexOf(fileName) > -1)
        if (all_names.indexOf(fileName) > -1) {
            alert("There already is a dataset with this name.")
            return;
        }
        if (csvString == '') {
            alert("You must upload a file.")
            return;
        }

        try {
            const response = await store_dataset(fileName, csvString);
            if (!response) {
                alert('Failed to upload CSV');
            }
        } catch (error) {
            alert("Error uploading the CSV.");
        }
        setCsvString('');
        closeUploadModal();
    }
    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
        setFileName('');
        getListDatasets();
    };
    //const router = useRouter();
    // const handleRowClick = (id: number) => {
    //     router.push(`/questionnaire/${id}`);
    // };

    return (
        <>
            <Head>
                <title>Datasets</title>
            </Head>
            <div className="flex flex-col items-end p-5">
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer">
                    <MdOutlineAdd size={30} />
                    <p className='ml-2 text-sm'> Upload</p>
                </button>
                <Modal show={isUploadModalOpen} onClose={() => closeUploadModal()}>
                    <Modal.Body>
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold mb-2">Upload CSV File</h2>
                            <input
                                type="text"
                                placeholder="Enter filename"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                className="input input-bordered w-full max-w-xs"
                            />
                            <input type="file" accept=".csv" onChange={handleFileUpload} />

                        </div>
                        <button className='mt-4 bg-gray-200 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer'
                            onClick={() => submitCSVToBackend()}
                        >
                            Submit
                        </button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => {
                            closeUploadModal();
                            //router.push('/');
                        }}>
                            Close
                        </Button>
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
                            {listDatasets.map((dataset) => (
                                < Table.Row key={dataset.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 cursor-pointer"
                                // onClick={() => handleRowClick(project.id)}>
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
        </>
    );
}
