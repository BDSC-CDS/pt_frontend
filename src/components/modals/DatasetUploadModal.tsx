import { Button, Modal } from "flowbite-react"
import { useRouter } from "next/router"
import Papa from "papaparse"
import { useState } from "react"
import { TemplatebackendDataset } from "~/internal/client"
import DataTable from "../DataTable"
import { DateTime } from "luxon"
import { storeDataset } from "~/utils/dataset"
import { showToast } from "~/utils/showToast"

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
    const router = useRouter()
    const [fileName, setFileName] = useState('');
    const [columnTypes, setColumnTypes] = useState<ColumnTypes>({});
    const [columnIdentifying, setColumnIdentifying] = useState<ColumnTypes>({});
    const [csvString, setCsvString] = useState('');
    const [csvPreview, setCsvPreview] = useState<string[][]>([]); // New state for CSV preview
    const [hasSelectedDataset, setHasSelectedDataset] = useState(false);
    const [idCol, setIdCol] = useState<string>();

    
    const getUniqueFileName = (baseFileName: string, datasetNames: string[]): string => {
        console.log(datasetNames)
        let uniqueFileName = baseFileName;
        let counter = 1;

        // Loop to find a unique name
        while (datasetNames.includes(uniqueFileName)) {
            uniqueFileName = `${baseFileName} (${counter})`;
            counter++;
        }

        return uniqueFileName;
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

        // Use the file name as the dataset name (remove extension)
        const baseFileName = file.name.replace(/\.[^/.]+$/, "");
        // Get a unique file name
        const uniqueFileName = getUniqueFileName(baseFileName, datasetNames);
        setFileName(uniqueFileName);

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
            showToast("error", "Please select an identifier column.");
            return;
        }

        try {
            const types = JSON.stringify(columnTypes);
            const identifiers = JSON.stringify(columnIdentifying);
            const response = await storeDataset(fileName, csvString, types, identifiers, idCol);
            if (!response || !response.result || !response.result.id) {
                throw "No response received from the server."
            }

            showToast("success", "Dataset uploaded successfully.");
            handleClose();
            onSuccess(response.result.id);
        } catch (error) {
            showToast("error", "Error uploading the dataset:"+error);
        }
    }

    const handleClose = () => {
        setCsvString('');
        setFileName('');
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
                <div className="flex justify-center">
                    <input type="file" accept=".csv" onChange={handleOpenFile} className="p-2"/>
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
                        <div className="flex justify-center ml-14">
                            <div className="flex flex-col items-center gap-1 w-5/6 ">
                                <div className="flex font-bold w-full mb-2">
                                    <span className="w-1/4">Column Name</span>
                                    <span className="w-1/4">Type</span>
                                    <span className="w-1/4">Identifier</span>
                                    <span className="w-1/6">Is Identifier?</span>
                                </div>
                                {Object.keys(columnTypes).map((column, index) => (
                                    <div key={index} className="flex items-center w-full">
                                        <span className="w-1/4">{column}</span>
                                        <div className="w-1/4 flex">
                                            <select
                                                value={columnTypes[column]}
                                                onChange={(e) => setColumnType(column, e.target.value)}
                                                className="select select-bordered w-11/12"
                                            >
                                                <option value="string">String</option>
                                                <option value="int">Integer</option>
                                                <option value="float">Float</option>
                                                <option value="date">Date</option>
                                            </select>
                                        </div>
                        
                                        <div className="w-1/4 flex">
                                            <select
                                                value={columnIdentifying[column]}
                                                onChange={(e) => setColumnIdentifying_(column, e.target.value)}
                                                className="select select-bordered w-11/12"
                                            >
                                                <option value="identifier">Identifier</option>
                                                <option value="quasi-identifier">Quasi-identifier</option>
                                                <option value="non-identifying">Non-identifying</option>
                                            </select>
                                        </div>
                                        {/* <select
                                            value={columnIdentifying[column]}
                                            onChange={(e) => setColumnIdentifying_(column, e.target.value)}
                                            className="select select-bordered w-1/4"
                                        >
                                            <option value="identifier">Identifier</option>
                                            <option value="quasi-identifier">Quasi-identifier</option>
                                            <option value="non-identifying">Non-identifying</option>
                                        </select> */}
                                        <div className="w-1/6 flex pl-10">
                                            <input
                                                type="radio"
                                                name="identifier-column"
                                                checked={idCol === column}
                                                onChange={() => setIdCol(column)}
                                                className="radio radio-bordered"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                        
                )}
            </Modal.Body>

            <Modal.Footer className="flex justify-center gap-3">

                <Button onClick={handleUpload}>
                    Upload
                </Button>
                <Button color="gray" onClick={handleClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )   
}