import { Configuration, TransformConfigServiceApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });

const apiClientTransformConfig = new TransformConfigServiceApi(apiConfig);

export default apiClientTransformConfig;
