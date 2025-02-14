import { Configuration, ConfigurationServiceApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });

const apiClientConfig = new ConfigurationServiceApi(apiConfig);

export default apiClientConfig;
