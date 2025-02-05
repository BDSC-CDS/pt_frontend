import { Button, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { createQuestionnaire, createQuestionnaireVersion } from "~/utils/questionnaire";

interface NewQuestionnaireVersionModalProps {
    show: boolean
    questionnaireId: number
    onClose: () => void
}


export default function NewQuestionnaireVersionModal({show, questionnaireId, onClose}: NewQuestionnaireVersionModalProps) {
    const router = useRouter()

    const [versionName, setVersionName] = useState("")
    const [isVersionPublished, setIsVersionPublished] = useState(false)

    // Handlers
    const handleCloseModal = () => {
        onClose()
    }

    const save = async () => {
        if( versionName != ""){
            try {
                const id = await createQuestionnaireVersion(questionnaireId, {
                    version: versionName,
                    published: isVersionPublished
                })
                console.log(id)
                if(id) {
                    router.push("/admin/questionnaire/" + id)
                } else {
                    alert("Error creating the questionnaire.")
                }
            } catch (error) {
                alert("Error creating the questionnaire: " + error)
            }
        } else {
            alert("The questionnaire name cannot be empty.")
        }
        
    }

    return (
        <>
            <Modal show={show} onClose={handleCloseModal} size="xl">
                <Modal.Header>
                    <p>Create New Questionnaire Version</p>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col gap-8">
                        <TextInput
                            placeholder="Name"
                            required
                            onChange={(event) => setVersionName(event.target.value)}
                        />

                        <hr />
                        
                        <div className="flex flex-col">
                            <ToggleSwitch checked={isVersionPublished} label="Publish version" onChange={setIsVersionPublished} />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="flex justify-center gap-3">
                    <Button color="success" onClick={() => save()}>
                        Save
                    </Button>
                    <Button color="gray" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};
