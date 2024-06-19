import { Configuration, AuthenticationApi } from '../internal/client/index';
import { apiURL } from './apiurl';
// URL for the API
// const apiURL = "https://pt-backend.rdeid.unil.ch/";  // Replace "url" with the actual URL of your API

// Creating a new Configuration object for the API client
const apiConfig = new Configuration({ basePath: apiURL });

// Instantiating the AuthenticationApi class from the generated client
const apiClientAuth = new AuthenticationApi(apiConfig);

// Exporting the instantiated AuthenticationApi object for use in other parts of the application
export default apiClientAuth;
