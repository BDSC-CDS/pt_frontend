import { IndexServiceApi, Configuration } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });

const apiClientIndex = new IndexServiceApi(apiConfig);

export default apiClientIndex;
