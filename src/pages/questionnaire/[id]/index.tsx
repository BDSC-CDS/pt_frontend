"use client";

import { useEffect, useState } from 'react';
import TabsComponent from '../../../components/Tabs';
import { getQuestionnaire } from "../../../utils/questionnaire"
import { questionsFromApi, Questions } from "../../../utils/questions"


const QuestionnairePage = () => {
    const questionnaireId = 10;
    const versionId = 10;
    const [questions, setQuestions] = useState<Questions>();


    const loadQuestionnaire = async () => {
        const result = await getQuestionnaire(questionnaireId);

        if (!result) {
            return
        }

        const v = (result.versions || []).find(v => v.id == versionId);
        if (!v) {
            return
        }
        const q = questionsFromApi(v);
        setQuestions(q);
    }

    useEffect(() => {
        try {
            loadQuestionnaire();
        } catch (error) {
            alert("Error listing the datasets")
        }
    }, []);



    return (
        <>
            {questions ? (
                <TabsComponent questions={questions} />
            ) : (
                <div>
                    <p>Loading or project not found...</p>
                </div>
            )}

        </>
    );
};

export default QuestionnairePage;
