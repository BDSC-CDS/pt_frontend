import { IndexApi, Configuration } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });

const apiClientIndex = new IndexApi(apiConfig);

export default apiClientIndex;
