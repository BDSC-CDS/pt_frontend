import apiClientConfig from './apiClientConfig';
import { getAuthInitOverrides } from './authContext'

import { ConfigServiceCreateConfigRequest, TemplatebackendConfig, ConfigServiceDeleteConfigRequest } from '../internal/client/index';



export const getConfigs = async () => {
    try {
        const response = await apiClientConfig.configServiceGetConfigs(getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error getting configs:" + error);
    }
};

export const createConfig = async (config: TemplatebackendConfig) => {
    const request: ConfigServiceCreateConfigRequest = {
        body: config
    }
    try {
        const response = await apiClientConfig.configServiceCreateConfig(request, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error creating a config:" + error);
    }
};

export const deleteConfig = async (config_id: number) => {
    const request: ConfigServiceDeleteConfigRequest = {
        id: config_id
    }
    try {
        const response = await apiClientConfig.configServiceDeleteConfig(request, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error deleting a config:" + error);
    }
};
