"use client";

import { useEffect, useState } from 'react';
import TabsComponent from '../../../components/Tabs';
import { getQuestionnaire, getReply } from "../../../utils/questionnaire"
import { useRouter } from 'next/router';
import { TemplatebackendQuestionnaireReply } from '../../../internal/client/index';
import { questionsFromApi, Questions } from "../../../utils/questions"


const QuestionnairePage = () => {
    let questionnaireId = 1;

    const router = useRouter();
    const { id } = router.query;


    const [questions, setQuestions] = useState<Questions>();
    const [reply, setReply] = useState<TemplatebackendQuestionnaireReply>();


    const load = async () => {
        let replyId;
        if (id && id != "new") {
            replyId = Number(id);

            const replyResult = await getReply(replyId);

            if (replyResult) {
                setReply(replyResult);
            }

            if (replyResult?.questionnaireVersionId)  {
                questionnaireId = replyResult?.questionnaireVersionId
            }
        }

        const result = await getQuestionnaire(questionnaireId);

        if (!result) {
            return
        }

        const v = (result.versions || []).find(v => v.published);
        if (!v) {
            return
        }
        const q = questionsFromApi(v);
        setQuestions(q);
    }

    useEffect(() => {
        try {
            load();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, []);



    return (
        <>
            {questions ? (
                <TabsComponent questions={questions} questionnaireVersionId={questionnaireId} reply={reply} />
            ) : (
                <div>
                    <p>Loading or project not found...</p>
                </div>
            )}

        </>
    );
};

export default QuestionnairePage;
