import { IndexApi, Configuration } from '../internal/client/index';

// The base URL for the API. This should be the root URL where your API is hosted.
const apiURL = "https://pt-backend.rdeid.unil.ch/";

// Creating a Configuration object for the API client.
const apiConfig = new Configuration({ basePath: apiURL });

// Instantiating the IndexApi class from the generated client with the created configuration.
const apiClientIndex = new IndexApi(apiConfig);

// Exporting the instantiated IndexApi object for use in other parts of the application.
export default apiClientIndex;
