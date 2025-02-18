import { Configuration, AuthenticationServiceApi } from '../internal/client/index';
import { apiURL } from './apiURL';
const apiConfig = new Configuration({ basePath: apiURL() });

const apiClientAuth = new AuthenticationServiceApi(apiConfig);

export default apiClientAuth;
