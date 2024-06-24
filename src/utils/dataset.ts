import apiClientDataset from './apiClientDataset';
import {getAuthInitOverrides} from './authContext'

import { DatasetServiceStoreDatasetRequest } from '../internal/client/index';
import { DatasetServiceListDatasetsRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetMetadataRequest } from '../internal/client/index';
import { DatasetServiceGetDatasetContentRequest } from '../internal/client/index';


/**
 * Function to store a new dataset.
 *
 * @param dataset_name The new dataset name.
 * @param dataset The content of the dataset.
 * @returns The response from the API or undefined in case of an error.
 */
export const storeDataset = async (dataset_name: string, dataset: string, types: string) => {
    const d: DatasetServiceStoreDatasetRequest = {
        body: {
            datasetName: dataset_name,
            dataset: dataset,
            types: types
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

export const getMetadata = async (id: number) => {
    const request: DatasetServiceGetDatasetMetadataRequest = {
        id: id
    };

    try {
        const response = await apiClientDataset.datasetServiceGetDatasetMetadata(request, getAuthInitOverrides());
        return response;
    } catch (error) {
        console.log("Error getting metadata:" + error);
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
