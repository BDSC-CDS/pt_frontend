import { Button, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { createQuestionnaire } from "~/utils/questionnaire";

interface NewQuestionnaireModalProps {
    show: boolean
    onClose: () => void,
}

interface QuestionnaireInfo {
    name: string
}

export default function NewQuestionnaireModal({show, onClose}: NewQuestionnaireModalProps) {
    const router = useRouter()

    const [questionnaireInfo, setQuestionnaireInfo] = useState<QuestionnaireInfo>({name: ""})

    // Handlers
    const handleCloseModal = () => {
        onClose()
    }

    const save = async () => {
        console.log(questionnaireInfo.name)
        if(questionnaireInfo.name != ""){
            try {
                const id = await createQuestionnaire(questionnaireInfo)
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
                    <p>Create New Questionnaire</p>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col">
                        <TextInput
                            placeholder="Name"
                            required
                            onChange={(event) => { setQuestionnaireInfo({name: event.target.value}) }}
                        />
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
