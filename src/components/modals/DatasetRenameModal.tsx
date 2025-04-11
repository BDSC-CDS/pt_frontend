import { on } from "events"
import { Button, Modal, TextInput } from "flowbite-react"
import { useRouter } from "next/router"
import { use, useEffect, useState } from "react"
import { updateDatasetName } from "~/utils/dataset"
import { showToast } from "~/utils/showToast"

interface DatasetRenameModalProps {
    show: boolean
    datasetId: number
    datasetName: string
    onClose: () => void
}


/**
 * Confirmation modal to log out.
 */
export default function DatasetRenameModal({ show, datasetId, datasetName, onClose }: DatasetRenameModalProps) {
    const router = useRouter()
    const [editedDatasetName, setEditedDatasetName] = useState<string>(datasetName)

    const handleEdit = async () => {
        if(editedDatasetName === datasetName) {
            onClose()
            return
        }

        try {
            const response = await updateDatasetName(datasetId, editedDatasetName)
            if (!response || !response.result || !response.result.success) {
                throw new Error("No response from server.")
            }

            onClose()
            router.push("/dataset/" + datasetId)
            showToast("success", "Dataset name successfully modified.")
        } catch (error) {
            showToast("error", "Error renaming dataset: " + error)
        }
    };

    useEffect(() => {
        if (show) {
            setEditedDatasetName(datasetName)
        }
    }, [show])

    return (
        <Modal show={show} size="xl" onClose={onClose} popup>
            <Modal.Header>
                <p>Rename dataset</p>
            </Modal.Header>
            <Modal.Body className="flex flex-col py-5 px-10">
                <TextInput
                    value={editedDatasetName}
                    placeholder="Name"
                    required
                    onChange={(event) => setEditedDatasetName(event.target.value)}
                />
            </Modal.Body>
            <Modal.Footer className="p-2 flex justify-center gap-4">
                <Button onClick={() => handleEdit()}>
                    Edit
                </Button>
                <Button color="gray" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )   
}

            