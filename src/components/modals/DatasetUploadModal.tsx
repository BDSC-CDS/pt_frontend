import { Button, Modal, Table } from "flowbite-react"
import Papa from "papaparse"
import { useState } from "react"
import DataTable from "../DataTable"
import { DateTime } from "luxon"
import { storeDataset } from "~/utils/dataset"
import { showToast } from "~/utils/showToast"
import InputField from "../ui/InputField"
import Spinner from "../ui/Spinner"

const MIN_SAMPLE_SIZE = 10
const PREVIEW_SIZE = 5

interface DatasetUploadModalProps {
    show: boolean
    datasetNames: string[]
    onSuccess: (id: number) => void
    onClose: () => void
}

interface ColumnTypes {
    [key: string]: string
}

const acceptedDateFormats = [
    "yyyy-MM-dd",
    "MM/dd/yyyy",
    "dd/MM/yyyy",
    "yyyy/MM/dd",
    "yyyy-MM-ddTHH:mm:ss",
    "dd-MM-yyyy",
    "M/d/yyyy",
    "d/M/yyyy",
    "MM-dd-yyyy",
    "dd.MM.yyyy",
    "yyyy.MM.dd",
    "dd.MM.yy"
]

/**
 * A modal to upload a dataset.
 */
export default function DatasetUploadModal({ show, datasetNames, onSuccess, onClose }: DatasetUploadModalProps) {
    // File states
    const [originalFileName, setOriginalFileName] = useState("")
    const [datasetName, setDatasetName] = useState("")
    const [hasSelectedFile, setHasSelectedFile] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Data states
    const [previewData, setPreviewData] = useState<string[][]>([])
    const [parsedData, setParsedData] = useState<any[]>([])

    // Column types states
    const [columnTypes, setColumnTypes] = useState<ColumnTypes>({})
    const [columnIdentifying, setColumnIdentifying] = useState<ColumnTypes>({})
    const [idCol, setIdCol] = useState<string>()

    const isDate = (value: string): boolean => {
        if (!value || !isNaN(Number(value))) return false

        return acceptedDateFormats.some((fmt) => {
            const dt = DateTime.fromFormat(value, fmt)
            return dt.isValid
        }) || DateTime.fromISO(value).isValid || !isNaN(Date.parse(value))
    }

    const getUniqueDatasetName = (fileName: string, existingDatasetNames: string[]): string => {
        let uniqueDatasetName = fileName
        let counter = 1

        while (existingDatasetNames.includes(uniqueDatasetName)) {
            uniqueDatasetName = `${fileName} (${counter})`
            counter++
        }

        return uniqueDatasetName
    }
    
    // const detectColumnTypes = (data: Record<string, any>[]): ColumnTypes => {
    //     const types: ColumnTypes = {}
    //     const sampleData = data[0]
    //     for (const key in sampleData) {
    //         const value = sampleData[key]
    //         types[key] = typeof value
    //         if (!isNaN(Date.parse(value)) && value.includes("-")) {
    //             types[key] = "date"
    //         } else if (!isNaN(parseFloat(value))) {
    //             types[key] = Number.isInteger(parseFloat(value)) ? "int" : "float"
    //         }
    //     }
    //     return types
    // }

    const detectColumnTypes = (rows: Record<string, any>[]): ColumnTypes => {
        const types: ColumnTypes = {}
        const sampleCount = Math.min(rows.length, MIN_SAMPLE_SIZE)

        const counters: Record<string, Record<string, number>> = {}

        rows.slice(0, sampleCount).forEach(row => {
            for (const key in row) {
            const value = row[key]
            const trimmed = value?.toString().trim()
            if (!counters[key]) counters[key] = { int: 0, float: 0, date: 0, string: 0 }

            if (!trimmed) continue

            if (isDate(trimmed)) counters[key].date!++
                else if (!isNaN(trimmed) && Number.isInteger(+trimmed)) counters[key].int!++
                else if (!isNaN(+trimmed)) counters[key].float!++
                else counters[key].string!++
            }
        })

        for (const key in counters) {
            const t = counters[key]
            const bestType = Object.entries(t!).sort((a, b) => b[1] - a[1])[0]![0]
            types[key] = bestType
        }

        return types
    }

    const setColumnType = (column: string, type: string) => {
        if (!previewData || !previewData[0]) {
            showToast("error", "CSV data is not loaded yet.")
            return
        }

        // Get index of the column
        const columnIndex = previewData[0].indexOf(column)
        if (columnIndex === -1) {
            showToast("error", `Column "${column}" not found in the CSV headers.`)
            return
        }

        // Sample data from the column, filter out undefined values
        const sampleData: string[] = previewData
            .slice(1)
            .map((row) => row[columnIndex])
            .filter((value): value is string => value !== undefined) // Type guard to ensure only strings
        if (validateColumnType(type, sampleData)) {
            setColumnTypes((prev) => ({ ...prev, [column]: type }))
        } else {
            showToast("error", `Invalid type selected for column "${column}". Please choose a compatible type.`)
        }
    }

    const validateColumnType = (type: string, sampleData: (string | undefined)[]): boolean => {
        for (let value of sampleData) {
            if (value === undefined) continue
            if (type === "int" && !Number.isInteger(Number(value))) return false
            if (type === "float" && isNaN(parseFloat(value))) return false
            if (type === "date" && !isDate(value)) return false
            if (type === "string" && typeof value !== "string") return false
        }
        return true
    }

    const setColumnIdentifying_ = (column: string, type: string) => {
        setColumnIdentifying(prev => ({ ...prev, [column]: type }))
    }

    const handleOpenFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return
        
        const file = event.target.files[0]
        if (!file || !file.name) return

        const fileType = file.name.split(".").pop()?.toLowerCase()
        if (fileType !== "csv") {
            showToast("error", "Wrong file type. Please upload a CSV file.")
            event.target.value = ""
            return
        }

        setOriginalFileName(file.name)
        const baseFileName = file.name.replace(/\.[^/.]+$/, "")
        const uniqueFileName = getUniqueDatasetName(baseFileName, datasetNames)
        setDatasetName(uniqueFileName)
        setHasSelectedFile(true)

        // Parse preview data and detect column types
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            preview: MIN_SAMPLE_SIZE,
            complete: (result) => {
                const rows = result.data as Record<string, any>[]
                if (rows.length === 0) {
                    showToast("error", "Provided CSV file is empty.")
                    event.target.value = ""
                    return
                }

                const headers = Object.keys(rows[0] || {})
                const preview = [headers, ...rows.slice(0, PREVIEW_SIZE + 1).map(row => headers.map(h => row[h] || ""))]
                setPreviewData(preview)

                // Detect column types from preview sample
                const types = detectColumnTypes(rows)
                setColumnTypes(types)

                const initialIdentifying: ColumnTypes = {}
                Object.keys(types).forEach(key => {
                    initialIdentifying[key] = "identifier"
                })
                setColumnIdentifying(initialIdentifying)
            }
        })

        // Parse the entire CSV file to get all data
        Papa.parse(file, {
            header: true,
            worker: true,
            skipEmptyLines: true,
            complete: (result) => {
                const fullData = result.data as Record<string, any>[]
                setParsedData(fullData)
            },
        })
    }

    const handleUpload = async () => {
        if (!idCol) {
            showToast("error", "Please select an unique ID column.")
            return
        }

        try {
            setIsLoading(true)
            const types = JSON.stringify(columnTypes)
            const identifiers = JSON.stringify(columnIdentifying)
            const csvString = Papa.unparse(parsedData)
            const response = await storeDataset(datasetName, csvString, types, identifiers, idCol, originalFileName)
            if (!response || !response.result || !response.result.id) {
                throw "No response received from the server."
            }

            showToast("success", "Dataset uploaded successfully.")
            handleClose()
            onSuccess(response.result.id)
        } catch (error) {
            showToast("error", "Error uploading the dataset:"+error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setDatasetName("")
        setOriginalFileName("")
        setColumnTypes({})
        setColumnIdentifying({})
        setIdCol("")
        setPreviewData([])
        setHasSelectedFile(false)
        onClose()
    }
   
    return (
        <Modal show={show} onClose={onClose} size={hasSelectedFile ? "7xl" : "lg"}>
            <Modal.Header>Upload Dataset</Modal.Header>

            <Modal.Body className="flex flex-col gap-5">
                {/* File selector */}
                <div className="flex flex-row justify-center items-end gap-5">
                    <input type="file" accept=".csv" onChange={handleOpenFile} className="mb-3 text-base border bg-gray-50 rounded cursor-pointer "/>

                    {hasSelectedFile && (
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

                {hasSelectedFile && (
                    <div className="flex flex-col gap-5">
                        <hr />

                        {/* Dataset Preview */}
                        <div className="">
                            {previewData[0] && previewData.length > 0 && (
                                <DataTable
                                    data={previewData.slice(1).map((row, index) => {
                                        const rowData: { [key: string]: string } = {}
                                        row.forEach((cell, index) => {
                                            rowData[`column-${index}`] = cell // Map each cell value to the corresponding column name
                                        })
                                        return rowData
                                    })}
                                    columns={previewData[0].map((header, index) => ({
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

                <Button onClick={handleUpload} disabled={isLoading || !idCol}>
                    {isLoading ? <Spinner/> : "Upload"}
                </Button>
                <Button color="gray" onClick={handleClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )   
}