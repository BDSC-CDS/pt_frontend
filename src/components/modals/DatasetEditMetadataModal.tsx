import { Button, Modal, Table } from "flowbite-react"
import { useEffect, useState } from "react"
import { DateTime } from "luxon"
import { changeTypesDataset, getDatasetContent, getMetadata } from "~/utils/dataset"
import { showToast } from "~/utils/showToast"
import Spinner from "../ui/Spinner"
import { TemplatebackendMetadata } from "~/internal/client"
import { useRouter } from "next/router"

interface DatasetEditMetadataModalProps {
    show: boolean
    datasetId: number
    onClose: () => void
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
export default function DatasetEditMetadataModal({ show, datasetId, onClose }: DatasetEditMetadataModalProps
) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState<Array<TemplatebackendMetadata>>([]);
    const [sampleData, setSampleData] = useState<Array<(string | undefined)[]>>([]);
    const [modified, setModified] = useState(false);

    const getDatasetMetadata = async () => {
        setIsLoading(true);
        try {
            const response = await getMetadata(datasetId);
            if (response?.metadata?.metadata) {
                setMetadata(response.metadata.metadata);
            }
        } catch (error) {
            showToast("error", "Error getting dataset metadata: " + error);
        } finally {
            setIsLoading(false);
        }
    }

    const getDatasetSampleData = async () => {
        setIsLoading(true);
        try {
            const response = await getDatasetContent(datasetId, 0, 5);
            if (response?.result?.columns) {
                setSampleData(response.result.columns.map(col => col.value!));
            }
        } catch (error) {
            showToast("error", "Error getting dataset sample data: " + error);
        } finally {
            setIsLoading(false);
        }
    }

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

    const setIdColumn = (columnId: number) => {
        setModified(true);
        setMetadata(metadata.map((col) => {
            col.isId = col.columnId === columnId;
            return col;
        }));
    }

    const setColumnType = (columnId: number, type: string) => {
        if (sampleData[columnId] && !validateColumnType(type, sampleData[columnId] || [])) {
            showToast("error", `Invalid type selected. Please choose a compatible type.`);
            return;
        }

        setModified(true);
        setMetadata(metadata.map((col) => {
            if (col.columnId === columnId) {
                col.type = type;
            }
            return col;
        }));
    };

    const setColumnIdentifierType = (columnId: number , type: string) => {
        setModified(true);
        setMetadata(metadata.map((col) => {
            console.log(col)
            if(col.columnId === columnId){
                col.identifier = type;
            }
            return col;
        }))
    };
    
    const handleEditMetadata = async () => {
        if (!modified) {
            handleClose();
            return;
        }

        try {
            console.log(metadata);
            setIsLoading(true);

            const response = await changeTypesDataset(datasetId, metadata);
            if (!response || !response.id) {
                throw "No response received from the server."
            }

            showToast("success", "Metadata successfully updated.");
            handleClose();
            router.push(router.asPath.replace(/\/[^\/]*$/, `/${response.id}`));
        } catch (error) {
            showToast("error", "Error uploading the dataset:"+error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        setMetadata([]);
        setSampleData([]);
        setIsLoading(false);
        onClose();
    }

    useEffect(() => {
        if (show) {
            getDatasetMetadata();
            getDatasetSampleData();
        }
    }, [show]);
   
    return (
        <Modal show={show} onClose={onClose} size="7xl">
            <Modal.Header>
                Edit Metadata
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-5">
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
                            {metadata.map((meta, index) => (
                                <Table.Row key={index}>
                                    <Table.Cell className="py-2">
                                        <input
                                            type="radio"
                                            name="identifier-column"
                                            checked={meta.isId}
                                            onChange={() => setIdColumn(meta.columnId!)}
                                            className="radio radio-bordered cursor-pointer"
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="text-sm py-2">{meta.columnName}</Table.Cell>
                                    <Table.Cell className="py-2">
                                        <select
                                            value={meta.type}
                                            onChange={(e) => setColumnType(meta.columnId!, e.target.value)}
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
                                            value={meta.identifier}
                                            onChange={(e) => setColumnIdentifierType(meta.columnId!, e.target.value)}
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
            </Modal.Body>

            <Modal.Footer className="flex justify-center gap-3">
                <Button onClick={handleEditMetadata}>
                    {isLoading ? <Spinner/> : "Edit"}
                </Button>
                <Button color="gray" onClick={handleClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )   
}