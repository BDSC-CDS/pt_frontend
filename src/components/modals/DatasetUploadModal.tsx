import { Button, Modal, Table } from "flowbite-react"
import Papa from "papaparse"
import { useState } from "react"
import DataTable from "../DataTable"
import { DateTime } from "luxon"
import { storeDataset } from "~/utils/dataset"
import { showToast } from "~/utils/showToast"
import InputField from "../ui/InputField"
import Spinner from "../ui/Spinner"

interface DatasetUploadModalProps {
    show: boolean
    datasetNames: string[]
    onSuccess: (id: number) => void
    onClose: () => void
}

interface ColumnTypes {
    [key: string]: string;
}

const acceptedDateFormats = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'dd/MM/yyyy',
    'yyyy/MM/dd',
    'yyyy-MM-ddTHH:mm:ss',
    'dd-MM-yyyy',
    'M/d/yyyy',
];

/**
 * A modal to upload a dataset.
 */
export default function DatasetUploadModal({ show, datasetNames, onSuccess, onClose }: DatasetUploadModalProps) {
    const [originalFileName, setOriginalFileName] = useState('')
    const [datasetName, setDatasetName] = useState('');
    const [columnTypes, setColumnTypes] = useState<ColumnTypes>({});
    const [columnIdentifying, setColumnIdentifying] = useState<ColumnTypes>({});
    const [idCol, setIdCol] = useState<string>();
    const [csvString, setCsvString] = useState('');
    const [csvPreview, setCsvPreview] = useState<string[][]>([]);
    const [hasSelectedDataset, setHasSelectedDataset] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    
    const getUniqueDatasetName = (baseFileName: string, datasetNames: string[]): string => {
        let uniqueDatasetName = baseFileName;
        let counter = 1;

        // Loop to find a unique name
        while (datasetNames.includes(uniqueDatasetName)) {
            uniqueDatasetName = `${baseFileName} (${counter})`;
            counter++;
        }

        return uniqueDatasetName;
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
        if (!csvPreview || !csvPreview[0]) {
            showToast("error", "CSV data is not loaded yet.");
            return;
        }

        // Get index of the column
        const columnIndex = csvPreview[0].indexOf(column);
        if (columnIndex === -1) {
            showToast("error", `Column "${column}" not found in the CSV headers.`);
            return;
        }

        // Sample data from the column, filter out undefined values
        const sampleData: string[] = csvPreview
            .slice(1)
            .map((row) => row[columnIndex])
            .filter((value): value is string => value !== undefined); // Type guard to ensure only strings

        if (validateColumnType(type, sampleData)) {
            setColumnTypes((prev) => ({ ...prev, [column]: type }));
        } else {
            showToast("error", `Invalid type selected for column "${column}". Please choose a compatible type.`);
        }
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

    const validateColumnType = (type: string, sampleData: (string | undefined)[]): boolean => {
        for (let value of sampleData) {
            if (value === undefined) continue;
            if (type === "int" && !Number.isInteger(Number(value))) return false;
            if (type === "float" && isNaN(parseFloat(value))) return false;
            if (type === "date" && !isDate(value)) return false;
            if (type === "string" && typeof value !== "string") return false;
        }
        return true;
    };

    const setColumnIdentifying_ = (column: string, type: string) => {
        setColumnIdentifying(prev => ({ ...prev, [column]: type }));
    };
    

    const handleOpenFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        const file = event.target.files[0];
        if (!file || !file.name) return;
        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (fileType !== 'csv') {
            showToast("error", "Wrong file type. Please upload a CSV file.");
            event.target.value = '';
            return;
        }

        // Set the file name
        setOriginalFileName(file.name);
        // Use the file name as the dataset name (remove extension)
        const baseFileName = file.name.replace(/\.[^/.]+$/, "");
        // Get a unique file name
        const uniqueFileName = getUniqueDatasetName(baseFileName, datasetNames);
        setDatasetName(uniqueFileName);

        Papa.parse(file, {
            complete: (result) => {
                if (result.data.length === 0) {
                    showToast("error", "Provided CSV file is empty.");
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

        setHasSelectedDataset(true)
    };

    const handleUpload = async () => {
        if (!idCol) {
            showToast("error", "Please select an unique ID column.");
            return;
        }

        try {
            setIsLoading(true);
            const types = JSON.stringify(columnTypes);
            const identifiers = JSON.stringify(columnIdentifying);
            const response = await storeDataset(datasetName, csvString, types, identifiers, idCol, originalFileName);
            if (!response || !response.result || !response.result.id) {
                throw "No response received from the server."
            }

            showToast("success", "Dataset uploaded successfully.");
            handleClose();
            onSuccess(response.result.id);
        } catch (error) {
            showToast("error", "Error uploading the dataset:"+error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        setCsvString('');
        setDatasetName('');
        setOriginalFileName('');
        setColumnTypes({});
        setColumnIdentifying({});
        setIdCol('');
        setCsvPreview([]);
        setHasSelectedDataset(false)
        onClose();
    }
   
    return (
        <Modal show={show} onClose={onClose} size={hasSelectedDataset ? "7xl" : "lg"}>
            <Modal.Header>Upload Dataset</Modal.Header>

            <Modal.Body className="flex flex-col gap-5">
                {/* File selector */}
                <div className="flex flex-row justify-center items-end gap-5">
                    <input type="file" accept=".csv" onChange={handleOpenFile} className="mb-3 text-base border bg-gray-50 rounded cursor-pointer "/>

                    {hasSelectedDataset && (
                        <div className="w-2/3">
                            <h2 className="font-bold">Dataset Name</h2>
                            <InputField
                                label="Dataset Name"
                                name="dataset-name"
                                value={datasetName}
                                onChange={(e) => setDatasetName(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {hasSelectedDataset && (
                    <div className="flex flex-col gap-5">
                        <hr />

                        {/* Dataset Preview */}
                        <div className="">
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
                        </div>
                        

                        <hr />

                        {/* Type selection */}
                        <div className="rounded-lg border">
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell className="w-1/12">Unique ID</Table.HeadCell>
                                    <Table.HeadCell className="w-1/4">Column Name</Table.HeadCell>
                                    <Table.HeadCell className="w-1/4">Type</Table.HeadCell>
                                    <Table.HeadCell className="w-1/4">Identifier Type</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {Object.keys(columnTypes).map((column, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell className="py-2">
                                                <input
                                                    type="radio"
                                                    name="identifier-column"
                                                    checked={idCol === column}
                                                    onChange={() => setIdCol(column)}
                                                    className="radio radio-bordered cursor-pointer"
                                                />
                                            </Table.Cell>
                                            <Table.Cell className="text-sm py-2">{column}</Table.Cell>
                                            <Table.Cell className="py-2">
                                                <select
                                                    value={columnTypes[column]}
                                                    onChange={(e) => setColumnType(column, e.target.value)}
                                                    className="rounded w-5/6 py-1 cursor-pointer"
                                                >
                                                    <option value="string">String</option>
                                                    <option value="int">Integer</option>
                                                    <option value="float">Float</option>
                                                    <option value="date">Date</option>
                                                </select>
                                            </Table.Cell>
                                            <Table.Cell className="py-2">
                                                <select
                                                    value={columnIdentifying[column]}
                                                    onChange={(e) => setColumnIdentifying_(column, e.target.value)}
                                                    className="w-5/6 rounded py-1 cursor-pointer"
                                                >
                                                    <option value="identifier">Identifier</option>
                                                    <option value="quasi-identifier">Quasi-identifier</option>
                                                    <option value="non-identifying">Non-identifying</option>
                                                </select>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                        
                )}
            </Modal.Body>

            <Modal.Footer className="flex justify-center gap-3">

                <Button onClick={handleUpload}>
                    {isLoading ? <Spinner/> : "Upload"}
                </Button>
                <Button color="gray" onClick={handleClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )   
}