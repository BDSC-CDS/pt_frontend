import { Configuration, QuestionnaireApi } from '../internal/client/index';
import { apiURL } from './apiURL';

const apiConfig = new Configuration({ basePath: apiURL });


const apiClientQuestionnaire = new QuestionnaireApi(apiConfig);

export default apiClientQuestionnaire;
