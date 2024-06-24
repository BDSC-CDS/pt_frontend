import { Configuration, AuthenticationApi } from '../internal/client/index';
import { apiURL } from './apiURL';
const apiConfig = new Configuration({ basePath: apiURL });

const apiClientAuth = new AuthenticationApi(apiConfig);

export default apiClientAuth;
