import { Configuration, DatasetApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });

const apiClienDataset = new DatasetApi(apiConfig);

export default apiClienDataset;
