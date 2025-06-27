import apiClientDataset from './apiClientDataset';
import { getAuthInitOverrides } from './authContext'

import { DatasetServiceStoreDatasetRequest, DatasetServiceTransformDatasetRequest, DatasetServiceDeleteDatasetRequest, TemplatebackendMetadata, DatasetServiceChangeTypesDatasetRequest, DatasetServiceGetDatasetInfoRequest, HTTPRequestInit, DatasetServiceUpdateDatasetOperationRequest } from '../internal/client/index';
import { DatasetServiceListDatasetsRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetMetadataRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetContentRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetJupyterhubRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetIdentifierRequest } from '../internal/client/index';
import { DatasetServiceRevertDatasetRequest } from '../internal/client/index';
import { apiURL } from './apiURL';

/**
 * Function to store a new dataset.
 *
 * @param dataset_name The new dataset name.
 * @param datasetContent The content of the dataset.
 * @param types The types of the columns in the dataset.
 * @param identifiers The identifier types of the columns in the dataset.
 * @param id_col The column that contains the unique identifier.
 * @param original_filename The original filename of the dataset.
 * @returns The response from the API or undefined in case of an error.
 */
export const storeDataset = async (dataset_name: string, datasetContent: string, types: string, identifiers: string, id_col: string, original_filename: string) => {
    const d: DatasetServiceStoreDatasetRequest = {
        body: {
            datasetName: dataset_name,
            dataset: datasetContent,
            types: types,
            identifiers: identifiers,
            isId: id_col,
            originalFilename: original_filename
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
        throw error;
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

export const getDatasetCsv = async (dataset_id: number) => {
    const initOverrides = await getAuthInitOverrides()({ 
        init: {} as HTTPRequestInit, 
        context: {} as any 
    });

    const url = apiURL() + `/api/v1/dataset/csv/${dataset_id}`;
    try {
        const response = await fetch(url, initOverrides);
        return response;
    } catch (error) {
        console.log("Error getting the dataset CSV file:" + error);
    }
}

export const getDatasetDataframe = async (dataset_id: number) => {
    const initOverrides = await getAuthInitOverrides()({ 
        init: {} as HTTPRequestInit, 
        context: {} as any 
    });

    const url = apiURL() + `/api/v1/dataset/dataframe/${dataset_id}`;
    try {
        const response = await fetch(url, initOverrides);
        return response;
    } catch (error) {
        console.log("Error getting the dataset Parquet file:" + error);
    }
}

export const updateDatasetName = async (dataset_id: number, dataset_name: string) => {
    const request: DatasetServiceUpdateDatasetOperationRequest = {
        id: dataset_id,
        body: {
            name: dataset_name
        }
    }

    try {
        const response = await apiClientDataset.datasetServiceUpdateDataset(request, getAuthInitOverrides());
        return response;
    } catch (error) {
        console.log("Error updating the dataset name:" + error);
    }
}