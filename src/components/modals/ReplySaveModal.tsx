import { Button, Modal, TextInput } from "flowbite-react"
import { useRouter } from "next/router"
import { useState } from "react"
import { TemplatebackendQuestionnaireQuestionReply, TemplatebackendQuestionnaireReply } from "~/internal/client"
import { createReply } from "~/utils/questionnaire"
import { Question, Questions } from "~/utils/questions"
import { showToast } from "~/utils/showToast"

interface ReplySaveModalProps {
    show: boolean
    questions: Questions
    questionnaireVersionId: number | undefined
    onClose: () => void
}


/**
 * Save Reply modal.
 */
export default function ReplySaveModal({ show, questions, questionnaireVersionId, onClose }: ReplySaveModalProps) {
    const router = useRouter()
    const [saveName, setSaveName] = useState<string>("")

    const handleSave = async () => {
        let allQuestions: Question[] = [];
        Object.keys(questions).map((tab) => {
            const tabQuestions = questions[tab];
            if (!tabQuestions) return;
            allQuestions = allQuestions.concat(tabQuestions);
        })

        const allAnsweredQuestions = allQuestions.filter(q => q.answers?.find(a => a.selected));
        const replies: Array<TemplatebackendQuestionnaireQuestionReply> = allAnsweredQuestions.map(q => {
            const reply: TemplatebackendQuestionnaireQuestionReply = {
                questionnaireQuestionId: Number(q.questionId),
                answer: q.answers.find(a => a.selected)?.answerId
            };
            return reply;
        })

        const replyToSave: TemplatebackendQuestionnaireReply = {
            questionnaireVersionId: questionnaireVersionId,
            projectName: saveName,
            replies: replies,
        }

        try {
            const id = await createReply(replyToSave);
            if(!id) {
                throw "Error creating the new version."
            }
            showToast("success", "New reply successfully saved.")
            router.push("/risk_assessment")
        } catch (error) {
            showToast("error", String(error))
        }
    };

    return (
        <Modal show={show} onClose={onClose} size="md">
            <Modal.Header>Save reply</Modal.Header>
            <Modal.Body>
                <div className="flex flex-col mb-8">
                    <TextInput
                        placeholder="Project name"
                        required
                        onChange={(event) => { setSaveName(event.target.value) }}
                    />
                </div>
            </Modal.Body>

            <Modal.Footer className="flex justify-center gap-3">
                <Button onClick={handleSave}>
                    Save
                </Button>
                <Button color="gray" onClick={onClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )   
}