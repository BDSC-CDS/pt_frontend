"use client";

import { useEffect, useState } from 'react';
import Questionnaire from '../../../components/questionnaire/Questionnaire';
import { getQuestionnaire, getReply } from "../../../utils/questionnaire"
import { useRouter } from 'next/router';
import { TemplatebackendQuestionnaireReply, TemplatebackendQuestionnaireVersion } from '../../../internal/client/index';
import withAuth from '~/components/withAuth';
import { showToast } from '~/utils/showToast';
import Spinner from '~/components/ui/Spinner';


const QuestionnairePage = () => {
    let questionnaireId = 1;
    
    const router = useRouter();
    const { id } = router.query;

    const [questionnaireVersionId, setQuestionnaireVersionId] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [questionnaireVersion, setQuestionnaireVersion] = useState<TemplatebackendQuestionnaireVersion>();
    const [questionnaireReply, setQuestionnaireReply] = useState<TemplatebackendQuestionnaireReply>();

    const loadReply = async (replyId: number) => {
        const replyResult = await getReply(replyId);
        if (!replyResult) {
            throw new Error("Reply not found")
        }

        setQuestionnaireReply(replyResult);
        setQuestionnaireVersionId(replyResult.questionnaireVersionId);
    }

    const loadQuestionnaireVersion = async (questionnaireId: number, questionnaireVersionId: number | undefined) => {
        const result = await getQuestionnaire(questionnaireId);
        if (!result) {
            throw new Error("Questionnaire not found")
        }

        const v = (result.versions || []).find(v => {
            if (questionnaireVersionId) {
                return v.id == questionnaireVersionId;
            } else {
                return v.published;
            }
        });

        if (!v) {
            throw new Error("Questionnaire version not found")
        }

        setQuestionnaireVersion(v);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
    
                if (id && id !== "new") {
                    await loadReply(Number(id));
                } else if (id === "new") {
                    setQuestionnaireVersionId(undefined);
                }
            } catch (error) {
                showToast("error", `Error fetching project: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [id]);
    
    useEffect(() => {
        loadQuestionnaireVersion(questionnaireId, questionnaireVersionId);
        
    }, [questionnaireVersionId]);

    return (
        <>
            {!isLoading && questionnaireVersion ? (
                <Questionnaire questionnaireVersion={questionnaireVersion} questionnaireReply={questionnaireReply} />
            ) : (
                <Spinner/>
            )}

        </>
    );
};

export default withAuth(QuestionnairePage);
