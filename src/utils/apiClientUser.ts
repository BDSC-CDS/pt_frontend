import { Configuration, UsersServiceApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL() });


const apiClientUser = new UsersServiceApi(apiConfig);

export default apiClientUser;
