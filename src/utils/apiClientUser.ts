import { Configuration, UsersApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL });


const apiClientUser = new UsersApi(apiConfig);

export default apiClientUser;
