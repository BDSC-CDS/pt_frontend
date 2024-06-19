import { Configuration, DatasetApi } from '../internal/client/index';
import { apiURL } from './apiurl';
// The base URL for the API. This should be the root URL where your API is hosted.
// const apiURL = "http://localhost:5000/" // TODO change to backend

let token: string | null = null;
if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('token');
}
const apikey = token ? token : undefined;
// Creating a Configuration object for the API client.
const apiConfig = new Configuration({ basePath: apiURL, apiKey: "Bearer " + apikey });

// Instantiating the UsersApi class from the generated client with the created configuration.
const apiClienDataset = new DatasetApi(apiConfig);

// Exporting the instantiated UsersApi object for use in other parts of the application.
export default apiClienDataset;
