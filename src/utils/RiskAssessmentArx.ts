import apiClientDataset from './apiClientDataset';
import apiClientRiskAssessmentArx from './apiClientRiskAssessmentArx';

import { getAuthInitOverrides } from './authContext'

import { RiskAssessmentServiceGetRiskAssessmentRequest } from '../internal/client/index';





export const getRiskAssessment = async (id: number) => {
    const request: RiskAssessmentServiceGetRiskAssessmentRequest = {
        datasetid: id
    }

    try {
        const response = await apiClientRiskAssessmentArx.riskAssessmentServiceGetRiskAssessment(request, getAuthInitOverrides());
        return response;
    } catch (error) {
        console.log("Error getting request content: " + error);
    }
}
