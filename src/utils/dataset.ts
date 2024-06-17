// Importing the API client instance configured for user-related API calls.
import apiClientDataset from './apiClientDataset';

// Importing the types for the request structure and response expected for the createUser endpoint.
import { DatasetServiceStoreDatasetRequest } from '../internal/client/index';
import { DatasetServiceListDatasetsRequest } from '../internal/client/index';
import internal from 'stream';

/**
 * Function to store a new dataset.
 *
 * @param dataset_name The new dataset name.
 * @param dataset The content of the dataset.
 * @returns The response from the API or undefined in case of an error.
 */
export const store_dataset = async (dataset_name: string, dataset: string) => {
    // Creating a request object conforming to the structure expected by the API.
    const d: DatasetServiceStoreDatasetRequest = {
        body: {
            datasetName: dataset_name,
            dataset: dataset
        }
    };

    try {
        // Making an API call to create the user and storing the response.
        const response = await apiClientDataset.datasetServiceStoreDataset(d);
        return response; // Returning the response from the API.
    } catch (error) {
        // Logging any errors that occur during the API call.
        console.log("Error storing dataset:" + error);
    }
};

export const list_datasets = async (offset?: number, limit?: number) => {
    // Creating a request object conforming to the structure expected by the API.
    const request: DatasetServiceListDatasetsRequest = {};
    // Add offset to the request if it's a valid number
    if (offset) {
        request.offset = offset;
    }
    // Add limit to the request if it's a valid number
    if (limit) {
        request.limit = limit;
    }
    try {
        // Making an API call to create the user and storing the response.
        const response = await apiClientDataset.datasetServiceListDatasets(request);
        return response; // Returning the response from the API.
    } catch (error) {
        // Logging any errors that occur during the API call.
        console.log("Error listing datasets:" + error);
    }
};
