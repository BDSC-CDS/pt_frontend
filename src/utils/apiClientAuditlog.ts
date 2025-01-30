import { Configuration, AuditLogApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });

const apiClienDataset = new AuditLogApi(apiConfig);

export default apiClienDataset;
