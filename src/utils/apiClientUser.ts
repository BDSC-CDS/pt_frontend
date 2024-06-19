import { Configuration, UsersApi } from '../internal/client/index';
import { apiURL } from './apiurl';
// The base URL for the API. This should be the root URL where your API is hosted.
// const apiURL = "https://pt-backend.rdeid.unil.ch/"

// Creating a Configuration object for the API client.
const apiConfig = new Configuration({ basePath: apiURL });

// Instantiating the UsersApi class from the generated client with the created configuration.
const apiClientUser = new UsersApi(apiConfig);

// Exporting the instantiated UsersApi object for use in other parts of the application.
export default apiClientUser;
