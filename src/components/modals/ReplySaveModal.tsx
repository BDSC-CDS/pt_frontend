import { Button, Modal, TextInput } from "flowbite-react"
import { useRouter } from "next/router"
import { useState } from "react"

interface ReplySaveModalProps {
    show: boolean
    onSave: (saveName: string) => void
    onClose: () => void
}


/**
 * Save Reply modal.
 */
export default function ReplySaveModal({ show, onSave, onClose }: ReplySaveModalProps) {
    const router = useRouter()
    const [saveName, setSaveName] = useState<string>("")

    return (
        <Modal show={show} onClose={onClose} size="md">
            <Modal.Header>Save reply</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col mb-8">
                    <TextInput
                        placeholder="Project name"
                        required
                        value={saveName}
                        onChange={(event) => { setSaveName(event.target.value) }}
                    />
                </div>
            </Modal.Body>

            <Modal.Footer className="flex justify-center gap-3">
                <Button onClick={() => onSave(saveName)}>
                    Save
                </Button>
                <Button color="gray" onClick={onClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )   
}