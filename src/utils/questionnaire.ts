import apiClientQuestionnaire from './apiClientQuestionnaire';
import {getAuthInitOverrides} from './authContext'

import { QuestionnaireServiceCreateQuestionnaireRequest, TemplatebackendCreateQuestionnaireReply } from '../internal/client/index';
import internal from 'stream';

export const listQuestionnaires = async (offset: number = 0, limit: number|undefined = undefined) => {
    try {
        const response = await apiClientQuestionnaire.questionnaireServiceListQuestionnaire({offset, limit}, getAuthInitOverrides());
        return response?.result?.questionnaires;
    } catch (error) {
        console.log("Error creating questionnaire:" + error);
    }
};

export const getQuestionnaire = async (id: number = 0) => {
    try {
        const response = await apiClientQuestionnaire.questionnaireServiceGetQuestionnaire({id}, getAuthInitOverrides());
        console.log("response", response);
        console.log("response", response?.result);
        console.log("response", response?.result?.questionnaire);
        return response?.result?.questionnaire;
    } catch (error) {
        console.log("Error creating questionnaire:" + error);
    }
};
