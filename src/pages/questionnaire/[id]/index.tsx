"use client";

import { useEffect, useState } from 'react';
import Questionnaire from '../../../components/questionnaire/Questionnaire';
import { getQuestionnaire, getReply } from "../../../utils/questionnaire"
import { useRouter } from 'next/router';
import { TemplatebackendQuestionnaireReply } from '../../../internal/client/index';
import { questionsFromApi, Questions } from "../../../utils/questions"
import withAuth from '~/components/withAuth';
import { showToast } from '~/utils/showToast';
import Spinner from '~/components/ui/Spinner';


const QuestionnairePage = () => {
    let questionnaireId = 1;
    
    const router = useRouter();
    const { id } = router.query;

    const [questionnaireVersionId, setQuestionnaireVersionId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [questions, setQuestions] = useState<Questions>();
    const [reply, setReply] = useState<TemplatebackendQuestionnaireReply>();


    const load = async () => {
        setIsLoading(true)
        let replyId;
        if (id && id != "new") {
            replyId = Number(id);

            const replyResult = await getReply(replyId);

            if (replyResult) {
                setReply(replyResult);
            }

            if (replyResult?.questionnaireVersionId)  {
                setQuestionnaireVersionId(replyResult?.questionnaireVersionId);
            }
        }

        const result = await getQuestionnaire(questionnaireId);
        console.log("result", result)
        if (!result) {
            return
        }

        const v = (result.versions || []).find(v => {
            if (questionnaireVersionId) {
                return v.id == questionnaireVersionId;
            } else {
                return v.published;
            }
        });
        setQuestionnaireVersionId(v?.id);
        if (!v) {
            return
        }
        const q = questionsFromApi(v);
        setQuestions(q);
        setIsLoading(false)
    }

    useEffect(() => {
        try {
            load();
        } catch (error) {
            showToast("error", `Error listing the replies: ${error}`)
        }
    }, []);

    return (
        <>
            {!isLoading && questions ? (
                <Questionnaire questions={questions} questionnaireVersionId={questionnaireVersionId} reply={reply} />
            ) : (
                <Spinner/>
            )}

        </>
    );
};

export default withAuth(QuestionnairePage);
