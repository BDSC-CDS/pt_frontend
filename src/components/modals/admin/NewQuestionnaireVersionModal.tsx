import { Button, Modal, TextInput, ToggleSwitch } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { createQuestionnaireVersion } from "~/utils/questionnaire";
import { TemplatebackendQuestionnaireVersion } from "~/internal/client";
import { showToast } from "~/utils/showToast";

interface NewQuestionnaireVersionModalProps {
    show: boolean
    questionnaireId: number
    questionnaireVersion: TemplatebackendQuestionnaireVersion
    onSave: () => void
    onClose: () => void
}


export default function NewQuestionnaireVersionModal({show, questionnaireId, questionnaireVersion, onSave, onClose}: NewQuestionnaireVersionModalProps) {
    const router = useRouter()

    const [versionName, setVersionName] = useState("")
    const [isVersionPublished, setIsVersionPublished] = useState(false)

    const save = async () => {
        onSave()
        if( versionName != ""){
            try {
                const id = await createQuestionnaireVersion(questionnaireId, {
                    ...questionnaireVersion,
                    version: versionName,
                    published: isVersionPublished
                })
                if(id) {
                    router.push("/admin/questionnaire/" + questionnaireId)
                } else {
                    throw "No id returned."
                }
            } catch (error) {
                showToast("error", "Error creating the version:"+error)
            }
        } else {
            showToast("error", "The version name cannot be empty.")
        }
    }

    return (
        <>
            <Modal show={show} onClose={onClose} size="xl">
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
                    <Button onClick={save} disabled={!versionName.trim()}>
                        Save
                    </Button>
                    <Button color="gray" onClick={onClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
};
