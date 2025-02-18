import {
    Configuration,
    RiskAssessmentServiceApi,
  } from "../internal/client/index";
  import { apiURL } from './apiURL';

  const apiConfig = new Configuration({ basePath: apiURL() });
  const apiClientRiskAssessmentArx = new RiskAssessmentServiceApi(apiConfig);
  
  export default apiClientRiskAssessmentArx;