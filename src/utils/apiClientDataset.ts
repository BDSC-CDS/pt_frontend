import { Configuration, DatasetServiceApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });

const apiClienDataset = new DatasetServiceApi(apiConfig);

export default apiClienDataset;
