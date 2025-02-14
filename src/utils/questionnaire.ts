import apiClientQuestionnaire from './apiClientQuestionnaire';
import {getAuthInitOverrides} from './authContext'

import { TemplatebackendQuestionnaire, TemplatebackendQuestionnaireVersion, TemplatebackendQuestionnaireReply } from '../internal/client/index';

/**
 * Create a questionnaire via the backend API's endpoint.
 * @param questionnaireName 
 */
export const createQuestionnaire = async (questionnaire: TemplatebackendQuestionnaire) => {
    try {
        const response = await apiClientQuestionnaire.questionnaireServiceCreateQuestionnaire({
            body: {
                questionnaire: questionnaire
            }
        }, getAuthInitOverrides())
        return response?.result?.id
    } catch (error) {
        console.log("Error creating questionnaire:" + error);
        throw error;
    }
}

export const createQuestionnaireVersion = async (questionnaireId:number, version: TemplatebackendQuestionnaireVersion) => {
    try {
        const response = await apiClientQuestionnaire.questionnaireServiceCreateQuestionnaireVersion({
            body: {
                id: questionnaireId, 
                version: version,
            }
        }, getAuthInitOverrides());
        return response?.result?.id;
    } catch (error) {
        console.log("Error creating questionnaire version:" + error);
        throw error;
    }
};

export const listQuestionnaires = async (offset: number = 0, limit: number|undefined = undefined) => {
    try {
        const response = await apiClientQuestionnaire.questionnaireServiceListQuestionnaire({offset, limit}, getAuthInitOverrides());
        return response?.result?.questionnaires;
    } catch (error) {
        console.log("Error creating questionnaire:" + error);
        throw error;
    }
};

export const listReplies = async (offset: number = 0, limit: number|undefined = undefined) => {
    try {
        const response = await apiClientQuestionnaire.questionnaireServiceListReplies({offset, limit}, getAuthInitOverrides());
        return response?.result?.replies;
    } catch (error) {
        console.log("Error listing replies:" + error);
        throw error;
    }
};

export const getReply = async (replyId: number) => {
    try {
        const response = await apiClientQuestionnaire.questionnaireServiceGetReply({id:replyId}, getAuthInitOverrides());
        return response?.result?.reply;
    } catch (error) {
        console.log("Error getting reply:" + error);
        throw error;
    }
};

export const createReply = async (reply: TemplatebackendQuestionnaireReply) => {
    try {
        const response = await apiClientQuestionnaire.questionnaireServiceCreateReply({
            body:{
                reply: reply,
            }
        }, getAuthInitOverrides());
        return response?.result?.id;
    } catch (error) {
        console.log("Error creating reply:" + error);
        throw error;
    }
};

export const getQuestionnaire = async (id: number = 0) => {
    try {
        const response = await apiClientQuestionnaire.questionnaireServiceGetQuestionnaire({id}, getAuthInitOverrides());
        return response?.result?.questionnaire;
    } catch (error) {
        console.log("Error creating questionnaire:" + error);
        throw error;
    }
};
