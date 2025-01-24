import apiClientDataset from './apiClientDataset';
import { getAuthInitOverrides } from './authContext'

import { DatasetServiceStoreDatasetRequest, DatasetServiceTransformDatasetRequest, DatasetServiceDeleteDatasetRequest, TemplatebackendMetadata, TemplatebackendChangeTypesDatasetRequest, DatasetServiceChangeTypesDatasetRequest, DatasetServiceGetDatasetInfoRequest } from '../internal/client/index';
import { DatasetServiceListDatasetsRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetMetadataRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetContentRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetJupyterhubRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetIdentifierRequest } from '../internal/client/index';
import { DatasetServiceRevertDatasetRequest } from '../internal/client/index';

/**
 * Function to store a new dataset.
 *
 * @param dataset_name The new dataset name.
 * @param dataset The content of the dataset.
 * @returns The response from the API or undefined in case of an error.
 */
export const storeDataset = async (dataset_name: string, dataset: string, types: string, identifiers: string, id_col: string) => {
    const d: DatasetServiceStoreDatasetRequest = {
        body: {
            datasetName: dataset_name,
            dataset: dataset,
            types: types,
            identifiers: identifiers,
            isId: id_col,
        }
    };

    try {
        const response = await apiClientDataset.datasetServiceStoreDataset(d, getAuthInitOverrides());
        return response; // Returning the response from the API.
    } catch (error) {
        console.log("Error storing dataset:" + error);
    }
};

export const listDatasets = async (offset?: number, limit?: number) => {
    const request: DatasetServiceListDatasetsRequest = {};
    if (offset) {
        request.offset = offset;
    }
    if (limit) {
        request.limit = limit;
    }
    try {
        const response = await apiClientDataset.datasetServiceListDatasets(request, getAuthInitOverrides());
        return response;
    } catch (error) {
        console.log("Error listing datasets:" + error);
    }
};

export const getInfo = async (id: number) => {
    const request: DatasetServiceGetDatasetInfoRequest = {
        id: id
    }

    try {
        const response = await apiClientDataset.datasetServiceGetDatasetInfo(request, getAuthInitOverrides());
        return response;
    } catch (error) {
        console.log("Error getting info: " + error);
    }
}

export const getMetadata = async (id: number) => {
    const request: DatasetServiceGetDatasetMetadataRequest = {
        id: id
    };

    try {
        const response = await apiClientDataset.datasetServiceGetDatasetMetadata(request, getAuthInitOverrides());
        return response;
    } catch (error) {
        console.log("Error getting metadata: " + error);
    }
};

export const getDeidentificationNotebookURL = async (id: number) => {
    const request: DatasetServiceGetDatasetJupyterhubRequest = {
        id: id
    };

    try {
        const response = await apiClientDataset.datasetServiceGetDatasetJupyterhub(request, getAuthInitOverrides());
        return response?.result?.url;
    } catch (error) {
        console.log("Error getting Dataset JupyterHub: " + error);
    }
};

export const getDatasetContent = async (id: number, offset?: number, limit?: number) => {
    const request: DatasetServiceGetDatasetContentRequest = {
        id: id
    };
    if (offset) {
        request.offset = offset;
    }
    if (limit) {
        request.limit = limit;
    }
    try {
        const response = await apiClientDataset.datasetServiceGetDatasetContent(request, getAuthInitOverrides());
        return response;
    } catch (error) {
        console.log("Error getting the dataset content:" + error);
    }
};

export const getDatasetIdentifier = async (id: number, offset?: number, limit?: number) => {
    const request: DatasetServiceGetDatasetIdentifierRequest = {
        id: id
    };
    if (offset) {
        request.offset = offset;
    }
    if (limit) {
        request.limit = limit;
    }
    try {
        const response = await apiClientDataset.datasetServiceGetDatasetIdentifier(request, getAuthInitOverrides());
        return response;
    } catch (error) {
        console.log("Error getting the dataset identifying content:" + error);
    }
};

export const transformDataset = async (dataset_id: number, config_id: number) => {
    const request: DatasetServiceTransformDatasetRequest = {
        body: {
            datasetId: dataset_id,
            configId: config_id
        }
    }
    const response = await apiClientDataset.datasetServiceTransformDataset(request, getAuthInitOverrides())
    return response;
}

export const deleteDataset = async (dataset_id: number) => {
    const request: DatasetServiceDeleteDatasetRequest = {
        id: dataset_id
    }
    try {
        const response = await apiClientDataset.datasetServiceDeleteDataset(request, getAuthInitOverrides())
        return response;
    } catch (error) {
        console.log("Error deleting the dataset:" + error);
    }
}


export const revertDataset = async (dataset_id: number) => {
    const request: DatasetServiceRevertDatasetRequest = {
        body: {
            id: dataset_id
        }
    }
    try {
        const response = await apiClientDataset.datasetServiceRevertDataset(request, getAuthInitOverrides())
        return response;
    } catch (error) {
        console.log("Error reverting the dataset:" + error);
    }
}

export const changeTypesDataset = async (dataset_id: number, metadata: Array<TemplatebackendMetadata>) => {
    const request: DatasetServiceChangeTypesDatasetRequest = {
        body: {
            datasetId: dataset_id,
            metadata: metadata
        }
    }
    try {
        const response = await apiClientDataset.datasetServiceChangeTypesDataset(request, getAuthInitOverrides())
        return response;
    } catch (error) {
        console.log("Error changing the types of the dataset:" + error);
    }
}
