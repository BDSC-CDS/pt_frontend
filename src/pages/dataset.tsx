import Head from 'next/head';
import { useRouter } from 'next/router';
import { storeDataset, listDatasets, deleteDataset } from "../utils/dataset"
import { useEffect, useState } from 'react';
import { TemplatebackendDataset } from '~/internal/client';
import { Button, Modal } from 'flowbite-react';
import Papa from "papaparse";
import { useAuth } from '~/utils/authContext';
import { DateTime } from 'luxon';
import DatasetSelector from '~/components/DatasetSelector';
import DataTable from '../components/DataTable';
import withAuth from '~/components/withAuth';

interface ColumnTypes {
    [key: string]: string;
}

function Dataset() {

    // Authentication
    const isLoggedIn = useAuth();

    // Routing
    const router = useRouter();

    // States
    const [datasetsList, setDatasetsList] = useState<Array<TemplatebackendDataset>>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    const [csvString, setCsvString] = useState('');
    const [columnTypes, setColumnTypes] = useState<ColumnTypes>({});
    const [columnIdentifying, setColumnIdentifying] = useState<ColumnTypes>({});
    const [csvPreview, setCsvPreview] = useState<string[][]>([]); // New state for CSV preview
    const [idCol, setIdCol] = useState<string>();

    const acceptedDateFormats = [
        'yyyy-MM-dd',
        'MM/dd/yyyy',
        'dd/MM/yyyy',
        'yyyy/MM/dd',
        'yyyy-MM-ddTHH:mm:ss',
        'dd-MM-yyyy',
        'M/d/yyyy',
    ];

    const getUniqueFileName = (baseFileName: string, datasetsList: TemplatebackendDataset[]): string => {
        let uniqueFileName = baseFileName;
        let counter = 1;

        // Get all existing dataset names
        const allNames = datasetsList.map((dataset) => dataset.datasetName);

        // Loop to find a unique name
        while (allNames.includes(uniqueFileName)) {
            uniqueFileName = `${baseFileName} (${counter})`;
            counter++;
        }

        return uniqueFileName;
    };

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

        // Use the file name as the dataset name (remove extension)
        const baseFileName = file.name.replace(/\.[^/.]+$/, "");
        // Get a unique file name
        const uniqueFileName = getUniqueFileName(baseFileName, datasetsList);
        setFileName(uniqueFileName);

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

                //detect types
                const initialTypes = detectColumnTypes(result.data as Record<string, any>[]);
                setColumnTypes(initialTypes);

                // Initialize columnIdentifying with default values
                const initialIdentifying: ColumnTypes = {};
                Object.keys(initialTypes).forEach(key => {
                    initialIdentifying[key] = 'identifier';
                });
                setColumnIdentifying(initialIdentifying);
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
                // set variable
                setCsvString(csvString);
                // Set preview (first 4 rows)
                setCsvPreview([headers, ...result.data.slice(0, 4).map(row => headers.map(header => (row as Record<string, any>)[header] || ''))]);

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

    // Function to check if a value is a valid date
    const isDate = (value: string): boolean => {
        if (!isNaN(Number(value))) {
            // Avoid treating numbers like dates (e.g., "12345")
            return false;
        }

        // Attempt to parse with each format
        for (const format of acceptedDateFormats) {
            const date = DateTime.fromFormat(value, format);
            if (date.isValid) return true;
        }

        // Lastly, try a generic parse
        return DateTime.fromISO(value).isValid;
    };

    const validateColumnType = (column: string, type: string, sampleData: (string | undefined)[]): boolean => {
        for (let value of sampleData) {
            if (value === undefined) continue;
            if (type === "int" && !Number.isInteger(Number(value))) return false;
            if (type === "float" && isNaN(parseFloat(value))) return false;
            if (type === "date" && !isDate(value)) return false;
            if (type === "string" && typeof value !== "string") return false;
        }
        return true;
    };

    const setColumnType = (column: string, type: string) => {
        if (!csvPreview || !csvPreview[0]) {
            alert("CSV data is not loaded yet.");
            return;
        }

        // Get index of the column
        const columnIndex = csvPreview[0].indexOf(column);
        if (columnIndex === -1) {
            alert(`Column "${column}" not found in the CSV headers.`);
            return;
        }

        // Sample data from the column, filter out undefined values
        const sampleData: string[] = csvPreview
            .slice(1)
            .map((row) => row[columnIndex])
            .filter((value): value is string => value !== undefined); // Type guard to ensure only strings

        if (validateColumnType(column, type, sampleData)) {
            setColumnTypes((prev) => ({ ...prev, [column]: type }));
        } else {
            alert(`Invalid type selected for column "${column}". Please choose a compatible type.`);
        }
    };

    const setColumnIdentifying_ = (column: string, type: string) => {
        setColumnIdentifying(prev => ({ ...prev, [column]: type }));
    };

    const processCSV = async () => {
        if (csvString == '') {
            alert("You must upload a file.")
            return;
        }
        //open type detection window
        setIsTypeModalOpen(true);
    }

    const submitCSVToBackend = async () => {
        if (!idCol) {
            alert("You must select an identifier column.");
            return;
        }
        try {
            const types = JSON.stringify(columnTypes);
            const identifiers = JSON.stringify(columnIdentifying);
            const response = await storeDataset(fileName, csvString, types, identifiers, idCol);
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
        router.push("/dataset")// Needed to trigger a refresh for the dataset list
    };

    const handleTransform = async (id: number | undefined) => {
        if (id) {
            router.push(`/rule-based-deid/${id}`);
        }
    };

    const handleDelete = async (id: number | undefined) => {
        if (id) {
            try {
                const response = await deleteDataset(id);
                console.log("Dataset successfully deleted.")
                router.push("/dataset")// Needed to trigger a refresh for the dataset list
            } catch (error) {
                console.error("Error while trying to delete a dataset: ", error)
            }
        }
    };

    const handleOpenDeidentificationNotebook = async (id: number | undefined) => {
        if (id) {
            router.push(`/deidentification-notebook/${id}`);
        }
    };

    const handleAssessRisk = async (id: number | undefined) => {
        if (id) {
            router.push(`/risk_assessment_arx/${id}`);
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
                            className="text-white bg-[#306278] hover:bg-[#255362] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                        >
                            <svg className="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Import new dataset
                        </button>
                    </div>

                    <Modal show={isUploadModalOpen} onClose={() => closeUploadModals()}>
                        <Modal.Body>
                            <div className="space-y-6">
                                <h2 className="text-lg  mb-2">Upload CSV File</h2>
                                {/*<input
                                    type="text"
                                    placeholder="Enter filename"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="input input-bordered w-full max-w-xs"
                                />*/}
                                <input type="file" accept=".csv" onChange={handleFileUpload} />

                            </div>
                            <button className='mt-4 bg-gray-400 hover:bg-gray-300 p-2 pr-3 rounded cursor-pointer'
                                onClick={() => processCSV()}
                            >
                                Submit
                            </button>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => closeUploadModals()}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal size='7xl' show={isTypeModalOpen} onClose={() => setIsTypeModalOpen(false)}>
                        <Modal.Header>
                            Data information
                        </Modal.Header>
                        <Modal.Body>
                            <div className="space-y-4 flex flex-col justify-center">
                                {csvPreview[0] && csvPreview.length > 0 && (
                                    <DataTable
                                        data={csvPreview.slice(1).map((row, index) => {
                                            const rowData: { [key: string]: string } = {};
                                            row.forEach((cell, index) => {
                                                rowData[`column-${index}`] = cell; // Map each cell value to the corresponding column name
                                            });
                                            return rowData;
                                        })}
                                        columns={csvPreview[0].map((header, index) => ({
                                            name: `column-${index}`,
                                            header: header
                                        }))}
                                    />
                                )}
                                <div className="flex font-bold">
                                    <span className="w-1/4">Column Name</span>
                                    <div className="flex space-x-4 w-3/4">
                                        <span className="w-1/4">Type</span>
                                        <span className="w-1/4">Identifier</span>
                                        <span className="w-1/4">Is Identifier?</span>
                                    </div>
                                </div>
                                {Object.keys(columnTypes).map((column, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="w-1/4">{column}</span>
                                        <div className="flex items-center space-x-4 w-3/4">
                                            <select
                                                value={columnTypes[column]}
                                                onChange={(e) => setColumnType(column, e.target.value)}
                                                className="select select-bordered w-1/4"
                                            >
                                                <option value="string">String</option>
                                                <option value="int">Integer</option>
                                                <option value="float">Float</option>
                                                <option value="date">Date</option>
                                            </select>
                                            <select
                                                value={columnIdentifying[column]}
                                                onChange={(e) => setColumnIdentifying_(column, e.target.value)}
                                                className="select select-bordered w-1/4"
                                            >
                                                <option value="identifier">Identifier</option>
                                                <option value="quasi-identifier">Quasi-identifier</option>
                                                <option value="non-identifying">Non-identifying</option>
                                            </select>
                                            <div className="pl-10 justify-center">
                                                <input
                                                    type="radio"
                                                    name="identifier-column"
                                                    checked={idCol === column}
                                                    onChange={() => setIdCol(column)}
                                                    className="radio radio-bordered"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => submitCSVToBackend()}>Save</Button>
                        </Modal.Footer>
                    </Modal>

                    <DatasetSelector
                        // onRowClick={(id) => handleRowClick(id)}
                        actions={[
                            { name: "Rule-based DeID", callback: (id) => handleTransform(id) },
                            { name: "Formal DeID", callback: (id) => handleOpenDeidentificationNotebook(id) },
                            { name: "Assess risk", callback: (id) => handleAssessRisk(id) },
                            { name: "Delete", callback: (id) => handleDelete(id) },
                        ]}
                        preview
                    />
                </div>
            )}
        </>
    );
}

export default withAuth(Dataset)