import { Configuration, AuditLogServiceApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });

const apiClienDataset = new AuditLogServiceApi(apiConfig);

export default apiClienDataset;
