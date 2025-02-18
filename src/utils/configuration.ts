import apiClientConfig from './apiClientConfig';
import { getAuthInitOverrides } from './authContext'

import { ConfigurationServiceCreateConfigRequest, TemplatebackendConfig, ConfigurationServiceDeleteConfigRequest, ConfigurationServiceExportConfigRequest } from '../internal/client/index';



export const getConfigs = async () => {
    try {
        const response = await apiClientConfig.configurationServiceGetConfigs(getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error getting configs:" + error);
    }
};

export const createConfig = async (config: TemplatebackendConfig) => {
    const request: ConfigurationServiceCreateConfigRequest = {
        body: config
    }
    try {
        const response = await apiClientConfig.configurationServiceCreateConfig(request, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error creating a config:" + error);
    }
};

export const deleteConfig = async (config_id: number) => {
    const request: ConfigurationServiceDeleteConfigRequest = {
        id: config_id
    }
    try {
        const response = await apiClientConfig.configurationServiceDeleteConfig(request, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error deleting a config:" + error);
    }
};

export const exportConfig = async (config_id: number) => {
    const request: ConfigurationServiceExportConfigRequest = {
        id: config_id
    }
    try {
        const response = await apiClientConfig.configurationServiceExportConfig(request, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error exporting a config:" + error);
    }
};
