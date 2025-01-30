import { Configuration, ConfigurationApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });

const apiClientConfig = new ConfigurationApi(apiConfig);

export default apiClientConfig;
