import {
    Configuration,
    RiskAssessmentApi,
  } from "../internal/client/index";
  import { apiURL } from './apiURL';

  const apiConfig = new Configuration({ basePath: apiURL });
  const apiClientRiskAssessmentArx = new RiskAssessmentApi(apiConfig);
  
  export default apiClientRiskAssessmentArx;