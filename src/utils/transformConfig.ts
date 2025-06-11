import apiClientTransformConfig from './apiClientTransformConfig';
import { getAuthInitOverrides } from './authContext'

import { TransformConfigServiceCreateTransformConfigRequest, TemplatebackendTransformConfig, TransformConfigServiceDeleteTransformConfigRequest, TransformConfigServiceExportTransformConfigRequest, TransformConfigServiceListTransformConfigsRequest } from '../internal/client/index';



export const listTransformConfigs = async (offset?: number, limit?: number) => {
    const request: TransformConfigServiceListTransformConfigsRequest = {}
    if (offset) {
        request.offset = offset;
    }
    if (limit) {
        request.limit = limit;
    }
    try {
        const response = await apiClientTransformConfig.transformConfigServiceListTransformConfigs(request, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error getting configs:" + error);
    }
};

export const createTransformConfig = async (config: TemplatebackendTransformConfig) => {
    const request: TransformConfigServiceCreateTransformConfigRequest = {
        body: {
            config: config
        }
    }
    try {
        const response = await apiClientTransformConfig.transformConfigServiceCreateTransformConfig(request, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error creating a config:" + error);
    }
};

export const deleteTransformConfig = async (config_id: number) => {
    const request: TransformConfigServiceDeleteTransformConfigRequest = {
        id: config_id
    }
    try {
        const response = await apiClientTransformConfig.transformConfigServiceDeleteTransformConfig(request, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error deleting a config:" + error);
    }
};

export const exportTransformConfig = async (config_id: number) => {
    const request: TransformConfigServiceExportTransformConfigRequest = {
        id: config_id
    }
    try {
        const response = await apiClientTransformConfig.transformConfigServiceExportTransformConfig(request, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error exporting a config:" + error);
    }
};
