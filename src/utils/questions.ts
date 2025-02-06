import { TemplatebackendQuestionnaireVersion } from '~/internal/client';

interface RulePrefill {
  answerId: string,
  questionId: string,
  answerText: string,
}

interface Answer {
  answerId: string;
  answerDescription: string;
  ethicsApproval: boolean;
  highRisk: boolean;
  riskLevel: number;
  selected?: boolean;
  rulePrefills?: RulePrefill[],
}

export interface Question {
  questionId: string;
  questionDescription: string;
  tooltip: string;
  riskWeight: number;
  highRiskAnswerSelected: boolean;
  answers: Answer[];
}

export interface Questions {
  [key: string]: Question[];
}

export const questionsFromApi = (q: TemplatebackendQuestionnaireVersion): Questions => {

  const questions: Questions = {};

  q.questions?.forEach(question => {
    if (!question.tab) return;

    if (!questions[question.tab]) {
      questions[question.tab] = [];
    }

    (questions[question.tab] || []).push({
      questionId: question.id?.toString() || "",
      questionDescription: question.question || "",
      tooltip: question.tooltip || "",
      riskWeight: question.riskWeight || 0,
      highRiskAnswerSelected: false,
      answers: question.answers?.map(answer => ({
        answerId: answer.id?.toString() || "",
        answerDescription: answer.text || "",
        ethicsApproval: false,
        highRisk: answer.highRisk || false,
        riskLevel: answer.riskLevel || 0,
        selected: false,
        rulePrefills: answer.rulePrefills?.map(rulePrefill => ({
          answerId: rulePrefill.answerId?.toString() || "",
          questionId: rulePrefill.questionId?.toString() || "",
          answerText: rulePrefill.answerText || "",
        }))
      })) || [],
    })
  });

  return questions;
}


// export const referenceQuestions: Questions = {
//   "Structured data": [
//     {
//       "questionId": "D-01",
//       "questionDescription": "Direct identifiers (e.g., name, phone number social security number, email address, medical record number, license number)",
//       "riskWeight": 10,
//       "answers": [
//         {
//           "answerId": "D-01-01",
//           "answerDescription": "Identifiers are not used in the project (default)",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-01-02",
//           "answerDescription": "Identifiers are replaced by pseudonym ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-01-03",
//           "answerDescription": "Original values of one or more direct identifiers are kept (*if this rules is selected the data set is not considered de-identified)",
//           "ethicsApproval": false,
//           "highRisk": true,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "D-02",
//       "questionDescription": "Patient ID",
//       "riskWeight": 10,
//       "answers": [
//         {
//           "answerId": "D-02-01",
//           "answerDescription": "Identifiers are replaced by pseudonym (project specific patient identifier) (default) ",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-02-02",
//           "answerDescription": "No patient ID used, no project specific patient identifier created",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-02-03",
//           "answerDescription": "Original values are kept (hospital internal patient identifier) (*if this rules is selected the data set is not considered de-identified)",
//           "ethicsApproval": false,
//           "highRisk": true,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-03-01",
//           "answerDescription": "Sample ID is not use in the project",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "D-03",
//       "questionDescription": "Sample ID",
//       "riskWeight": 7,
//       "answers": [
//         {
//           "answerId": "D-03-02",
//           "answerDescription": "Identifiers are replaced by pseudonym (project specific sample identifier) (default)  ",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-03-03",
//           "answerDescription": "Original values are kept (hospital internal sample identifier)",
//           "ethicsApproval": false,
//           "highRisk": true,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "D-04",
//       "questionDescription": "Administrative case ID",
//       "riskWeight": 0,
//       "answers": [
//         {
//           "answerId": "D-04-01",
//           "answerDescription": "Administrative case ID is not use in the project (default)  ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-04-02",
//           "answerDescription": "Identifiers are replaced by pseudonym (project specific identifier) ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-04-03",
//           "answerDescription": "Original values are kept (hospital internal sample identifier)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "D-05",
//       "questionDescription": "Lab report ID",
//       "riskWeight": 0,
//       "answers": [
//         {
//           "answerId": "D-05-01",
//           "answerDescription": "Lab report ID and Lab order ID is not use in the project (default)  ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-05-02",
//           "answerDescription": "Identifiers are replaced by pseudonym (project specific identifier) ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-05-03",
//           "answerDescription": "Original values are kept (hospital internal sample identifier)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "D-06",
//       "questionDescription": "Dates in the patient record (dates of birth and death excluded)",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "D-06-01",
//           "answerDescription": "Dates are suppressed or replaced with a surrogate date or not used in the project",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -2
//         },
//         {
//           "answerId": "D-06-02",
//           "answerDescription": "Dates are shifted by a random number of days within +/- 365 days",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "D-06-03",
//           "answerDescription": "Dates are shifted by a random number of days within +/- 90 days (default,one quarter offset to preserve seasonality)",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-06-04",
//           "answerDescription": "Dates are shifted by a random number of days within +/- 30 days (one month offset to preserve seasonality) ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "D-06-05",
//           "answerDescription": "Dates are shifted by a random number of days within +/- 7 days (one week offset) ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 2
//         },
//         {
//           "answerId": "D-06-06",
//           "answerDescription": "Dates in the patient record are not used in the project",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-06-07",
//           "answerDescription": "Original dates are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 3
//         }
//       ]
//     },
//     {
//       "questionId": "D-07",
//       "questionDescription": "Date of birth",
//       "riskWeight": 6,
//       "answers": [
//         {
//           "answerId": "D-07-01",
//           "answerDescription": "Date of birth concept is not used in the project ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "D-07-02",
//           "answerDescription": "Date of birth is shifted with the same random numbers as the other dates in rule D-04 (default)",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-07-03",
//           "answerDescription": "Only the year of the original birth date is kept ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "D-07-04",
//           "answerDescription": "Only the year and month of the original birth date are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 2
//         },
//         {
//           "answerId": "D-07-05",
//           "answerDescription": "Full original date of birth is kept (dd/mm/yyyy)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "D-08",
//       "questionDescription": "Date of death",
//       "riskWeight": 6,
//       "answers": [
//         {
//           "answerId": "D-08-01",
//           "answerDescription": "Date of death concept is not used in the project",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "D-08-02",
//           "answerDescription": "Date of death is shifted with the same random numbers as the other dates in rule D-04 (default)",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-08-03",
//           "answerDescription": "Only the year of the original death date is kept ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "D-08-04",
//           "answerDescription": "Only the year and month of the original death date are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 2
//         },
//         {
//           "answerId": "D-08-05",
//           "answerDescription": "Full original date of death is kept (dd/mm/yyyy)",
//           "ethicsApproval": false,
//           "highRisk": true,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "D-09 ",
//       "questionDescription": "Age",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "D-09-01",
//           "answerDescription": "Age is suppressed (e.g. default for reports) ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -2
//         },
//         {
//           "answerId": "D-09-02",
//           "answerDescription": "The age concept is not used in the project",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-09-03",
//           "answerDescription": "Age in generalized in groups of 5 or more years",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "D-09-04",
//           "answerDescription": "Original age is kept except for people with more than 89y old who are put in the age class \"90y+\" (default)",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-09-05",
//           "answerDescription": "Original age is kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     },
//     {
//       "questionId": "D-10",
//       "questionDescription": "Professions",
//       "riskWeight": 2,
//       "answers": [
//         {
//           "answerId": "D-10-01",
//           "answerDescription": "Profession is not used in the project (default)",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-10-02",
//           "answerDescription": "Original profession is kept, but replaced by a random profession for identifying ones",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     },
//     {
//       "questionId": "D-11 ",
//       "questionDescription": "Residential address  (street, zip code, city, region, country)",
//       "riskWeight": 7,
//       "answers": [
//         {
//           "answerId": "D-11-01",
//           "answerDescription": "Locations are not used in the project (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -2
//         },
//         {
//           "answerId": "D-11-02",
//           "answerDescription": "Locations are generalized",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-11-03",
//           "answerDescription": "Only countries are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "D-11-04",
//           "answerDescription": "Only regions are kept",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-11-05",
//           "answerDescription": "Only cities are kept. If cities have less than 20.000 inhabitants, cities are replaced by region",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "D-11-06",
//           "answerDescription": "Only the zip codes are kept. If zip codes refer to regions with less than 20.000 inhabitants, the last 2 numbers of the zip codes are suppressed",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 2
//         },
//         {
//           "answerId": "D-11-07",
//           "answerDescription": "The original locations are kept",
//           "ethicsApproval": false,
//           "highRisk": true,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "D-12",
//       "questionDescription": "Organizations (data provider organization excluded)",
//       "riskWeight": 1,
//       "answers": [
//         {
//           "answerId": "D-12-01",
//           "answerDescription": "Organization name is not used in the project  (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-12-02",
//           "answerDescription": "Organization type is kept (e.g., hospital, clinic, etc.) ",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "D-12-03",
//           "answerDescription": "Organization name is kept (e.g., University Hospital Basel) ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 2
//         }
//       ]
//     },
//     {
//       "questionId": "D-13",
//       "questionDescription": "Organizational Units (data provider organizational unit excluded)",
//       "riskWeight": 2,
//       "answers": [
//         {
//           "answerId": "D-13-01",
//           "answerDescription": "Organizational unit is not used in the project (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "D-13-02",
//           "answerDescription": "Organizational unit is generalized (e.g., Neurology, Radiology, Urology, etc.) ",
//           "ethicsApproval": true,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "D-13-03",
//           "answerDescription": "Organizational unit is kept (e.g.,328 Kardiologie ME) ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 2
//         }
//       ]
//     }
//   ],
//   "Multimedia variables": [
//     {
//       "questionId": "M-01",
//       "questionDescription": "Audio Data",
//       "riskWeight": 5,
//       "answers": [
//         {
//           "answerId": "M-01-01",
//           "answerDescription": "No audio data is used in the project",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "M-01-02",
//           "answerDescription": "Patient voice is kept in audio files",
//           "ethicsApproval": false,
//           "highRisk": true,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "M-01-03",
//           "answerDescription": "Patient voice blurring/noise algorithm (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "M-02",
//       "questionDescription": "Images (including photos) & Videos with patient face or identifying body parts (e.g., tatoos, malformations)",
//       "riskWeight": 5,
//       "answers": [
//         {
//           "answerId": "M-02-01",
//           "answerDescription": "No images are used in the project",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "M-02-02",
//           "answerDescription": "Original image or video files are kept",
//           "ethicsApproval": false,
//           "highRisk": true,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "M-02-03",
//           "answerDescription": "Blurring of identifying parts (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "M-02-04",
//           "answerDescription": "Removing of identifying face or identifying patient body parts (e.g., by defacing algorithms)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         }
//       ]
//     }
//   ],
//   "DICOM attributes (DICOM attributes listed in the confidentiality list (http://dicom.nema.org/medical/dicom/current/output/chtml/part15/chapter_E.html) will be removed unless they are listed under DCM-06": [
//     {
//       "questionId": "DCM-01",
//       "questionDescription": "Hardware Identifying Attributes",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "DCM-01-01",
//           "answerDescription": "Original value is suppressed",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "DCM-01-02",
//           "answerDescription": "Original value is replaced by pseudonym (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "DCM-01-03",
//           "answerDescription": "Original values are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     },
//     {
//       "questionId": "DCM-02",
//       "questionDescription": "Study Description",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "DCM-02-01",
//           "answerDescription": "Original value is suppressed",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "DCM-02-02",
//           "answerDescription": "Original value is replaced by pseudonym (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "DCM-02-03",
//           "answerDescription": "Original values are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     },
//     {
//       "questionId": "DCM-03",
//       "questionDescription": "Series Description",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "DCM-03-01",
//           "answerDescription": "Original value is suppressed",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "DCM-03-02",
//           "answerDescription": "Original value is replaced by pseudonym (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "DCM-03-03",
//           "answerDescription": "Original values are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     },
//     {
//       "questionId": "DCM-04",
//       "questionDescription": "Derivation Description",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "DCM-04-01",
//           "answerDescription": "Original value is suppressed",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "DCM-04-02",
//           "answerDescription": "Original value is replaced by pseudonym (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "DCM-04-03",
//           "answerDescription": "Original values are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     },
//     {
//       "questionId": "DCM-05",
//       "questionDescription": "Contrast Bolus Agent",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "DCM-05-01",
//           "answerDescription": "Original value is suppressed",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "DCM-05-02",
//           "answerDescription": "Original value is replaced by pseudonym (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "DCM-05-03",
//           "answerDescription": "Original values are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     },
//     {
//       "questionId": "DCM-06",
//       "questionDescription": "Retain original values of other DICOM attributes that would be removed by default according to the recommendations of nema.org",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "DCM-06-01",
//           "answerDescription": "Original value is suppressed",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "DCM-06-02",
//           "answerDescription": "Original value is replaced by pseudonym (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "DCM-06-03",
//           "answerDescription": "Original values are kept",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     }
//   ],
//   "Genomic variables": [
//     {
//       "questionId": "G-01",
//       "questionDescription": "Germline genomic sequences",
//       "riskWeight": 7,
//       "answers": [
//         {
//           "answerId": "G-01-01",
//           "answerDescription": "No germline genomic sequences are used in the project ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "G-01-02",
//           "answerDescription": "Only blurred summary statistics (e.g., MAF, p-values, ORs) are released (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "G-01-02",
//           "answerDescription": "Only exact summary statistics (e.g., MAF, p-values, ORs) are released ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "G-01-05",
//           "answerDescription": "Original individual-level values are released",
//           "ethicsApproval": false,
//           "highRisk": true,
//           "riskLevel": 0
//         }
//       ]
//     }
//   ],
//   "Other variables": [
//     {
//       "questionId": "O-01",
//       "questionDescription": "Additional project specific quasi-identifiers that can be used for linkage by the data recipient (e.g., clinical variables) ",
//       "riskWeight": 5,
//       "answers": [
//         {
//           "answerId": "O-01-01",
//           "answerDescription": " no other quasi-identifiers used in the project ",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "O-01-02",
//           "answerDescription": "Quasi-identifiers have been modified to reduce risks (e.g. generalization) (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "O-01-03",
//           "answerDescription": "Original values are kept",
//           "ethicsApproval": false,
//           "highRisk": true,
//           "riskLevel": 0
//         }
//       ]
//     }
//   ],
//   "Jurisdiction": [
//     {
//       "questionId": "C-01",
//       "questionDescription": "In which jurisdiction the project data is planned to be stored and processed?\n",
//       "riskWeight": 2,
//       "answers": [
//         {
//           "answerId": "C-01-01",
//           "answerDescription": "In Switzerland (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-01-02",
//           "answerDescription": "In EU or another country providing an adequate level of protection, recognized as such by the Federal Council",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "C-01-03",
//           "answerDescription": "In a country that does not provide an adequate level of protection, but with adequate safeguards according to Swiss law",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 2
//         },
//         {
//           "answerId": "C-01-04",
//           "answerDescription": "In a country that does not provide an adequate level of protection and without adequate safeguards according to Swiss law",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     }
//   ],
//   "Contracts and policies": [
//     {
//       "questionId": "C-02",
//       "questionDescription": "Is there a legal agreement between the data provider(s) and the data recipient(s) (e.g., a data transfer and use agreement) that regulates  the conditions under which data are disclosed to the data recipient(s)?",
//       "riskWeight": 4,
//       "answers": [
//         {
//           "answerId": "C-02-01",
//           "answerDescription": "Yes (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-02-02",
//           "answerDescription": "No",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "C-03",
//       "questionDescription": "Does the legal agreement between the data provider(s) and the data recipient(s) forbid the recipient(s) from disclosing the data to third parties or only with measures equivalent to those contractually agreed between the data provider and the data recipient?",
//       "riskWeight": 4,
//       "answers": [
//         {
//           "answerId": "C-03-01",
//           "answerDescription": "Yes (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "",
//       "questionDescription": "",
//       "riskWeight": 0,
//       "answers": [
//         {
//           "answerId": "C-03-02",
//           "answerDescription": "No",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "C-04-02",
//           "answerDescription": "No (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-05-02",
//           "answerDescription": "No (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-06-02",
//           "answerDescription": "No (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "C-04",
//       "questionDescription": "Does the legal agreement between the data provider(s) and the data recipient(s) stipulate that external audits of the data management practices of the data recipient may be performed?",
//       "riskWeight": 4,
//       "answers": [
//         {
//           "answerId": "C-04-01",
//           "answerDescription": "Yes",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         }
//       ]
//     },
//     {
//       "questionId": "C-05",
//       "questionDescription": "Does the legal agreement between the data provider(s) and the data recipient(s) stipulate that regular external audits of privacy and security practices of the data recipient may be performed?",
//       "riskWeight": 4,
//       "answers": [
//         {
//           "answerId": "C-05-01",
//           "answerDescription": "Yes",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         }
//       ]
//     },
//     {
//       "questionId": "C-06",
//       "questionDescription": "Does the legal agreement between the data provider(s) and the data recipient(s) associate penalties in case of health-related data misuse by the recipient?",
//       "riskWeight": 4,
//       "answers": [
//         {
//           "answerId": "C-06-01",
//           "answerDescription": "Yes",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         }
//       ]
//     },
//     {
//       "questionId": "C-07",
//       "questionDescription": "Are the recipient's staff members personally bound by a duty of confidentiality (e.g. confidential agreement, access policy imposing a duty of confidentiality, personal legal obligation of confidentiality)? ",
//       "riskWeight": 6,
//       "answers": [
//         {
//           "answerId": "C-07-01",
//           "answerDescription": "Yes (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-07-02",
//           "answerDescription": "No",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     },
//     {
//       "questionId": "C-08",
//       "questionDescription": "Are there IT security and privacy policies in effect at the data recipient site?",
//       "riskWeight": 5,
//       "answers": [
//         {
//           "answerId": "C-08-01",
//           "answerDescription": "Yes (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-08-02",
//           "answerDescription": "No",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     }
//   ],
//   "Cohort characteristics": [
//     {
//       "questionId": "C-11",
//       "questionDescription": "Is the project collecting health-related data on rare disease patients?",
//       "riskWeight": 5,
//       "answers": [
//         {
//           "answerId": "C-11-01",
//           "answerDescription": "No health-related data on rare diseases are included (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "C-11-02",
//           "answerDescription": "The disease occurs less than one in 80.000 (i.e., max. 100 cases in Switzerland)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "C-11-03",
//           "answerDescription": "The disease occurs less than one in 2.000 (i.e., max. 4.000 cases in Switzerland)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "C-12",
//       "questionDescription": "Is one or more of the following sensitive/stigmatizing information included in the dataset?\n\n- religious, ideological, political or trade union-related views or activities\n- disease associated with stigma (e.g. HIV status, psycological conditions), the intimate sphere or the racial origin\n- social security measures\n- administrative or criminal proceedings and sanctions",
//       "riskWeight": 5,
//       "answers": [
//         {
//           "answerId": "C-12-01",
//           "answerDescription": "No (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-12-02",
//           "answerDescription": "Yes",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     },
//     {
//       "questionId": "C-13",
//       "questionDescription": "Does anyone in the data recipient's project team has access to mapping table for patient re-identification (i.e., data subjects)?",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "C-13-01",
//           "answerDescription": "No (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-13-02",
//           "answerDescription": "Yes",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     }
//   ],
//   "Data users": [
//     {
//       "questionId": "C-14",
//       "questionDescription": "Who will have access to health-related data shared during the project?\nMultiple selections possible.",
//       "riskWeight": 3,
//       "answers": [
//         {
//           "answerId": "C-14-01",
//           "answerDescription": "Internal users of the hospital (i.e., the provider) from where the data is coming from, but who do not have access to the Electronic Health Records (EHC) of the hospital (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-14-02",
//           "answerDescription": "Internal users of the hospital (i.e., the provider) from where the data is coming from and who have access to the Electronic Health Records (EHC) of the hospital (this excludes internal Clinical Data Warehouse (CDW) employees)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "C-14-03",
//           "answerDescription": "External users from Switzerland or EU",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 2
//         },
//         {
//           "answerId": "C-14-04",
//           "answerDescription": "External users outside of Switzerland or EU",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     }
//   ],
//   "IT Infrastructure and security": [
//     {
//       "questionId": "C-12",
//       "questionDescription": "Where does the project data will be stored and processed (select the worst answer that applies)?",
//       "riskWeight": 10,
//       "answers": [
//         {
//           "answerId": "C-12-01",
//           "answerDescription": "On the hospital IT infrastructure of the data recipient (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-12-02",
//           "answerDescription": "On  computer(s) controlled by the hospital IT department of the data recipient",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         },
//         {
//           "answerId": "C-12-03",
//           "answerDescription": "On an external third party's IT infrastructure (e.e., cloud provider, HPC provider) such as the BioMedIT network",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 2
//         },
//         {
//           "answerId": "C-12-04",
//           "answerDescription": "On PRIVATE computer (e.g., desktop, laptop, etc.)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "C-13",
//       "questionDescription": "If the project data is stored or processed on the IT infrastructure of an external provider, does such provider comply with the BioMedIT Information Security Policy?",
//       "riskWeight": 10,
//       "answers": [
//         {
//           "answerId": "C-13-01",
//           "answerDescription": "Yes (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -2
//         },
//         {
//           "answerId": "C-13-02",
//           "answerDescription": "No",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "C-14",
//       "questionDescription": "If the project data is stored or processed on the IT infrastructure of an external provider, does the Management System of the provider's Information Security has been also audited and certified from an Information Security perspective (e.g., ISO 27001) and from a data protection perspective (GDPR,...)",
//       "riskWeight": 10,
//       "answers": [
//         {
//           "answerId": "C-14-01",
//           "answerDescription": "Yes",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": -1
//         },
//         {
//           "answerId": "C-14-02",
//           "answerDescription": "No (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         }
//       ]
//     },
//     {
//       "questionId": "C-15",
//       "questionDescription": "If the project data is stored or processed on the IT infrastructure of an external provider, is there a legal processing agreement with the external provider of the infrastructure such as the BioMedIT Network (e.g., data processor agreement)?",
//       "riskWeight": 10,
//       "answers": [
//         {
//           "answerId": "C-15-01",
//           "answerDescription": "Yes (default)",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 0
//         },
//         {
//           "answerId": "C-15-02",
//           "answerDescription": "No",
//           "ethicsApproval": false,
//           "highRisk": false,
//           "riskLevel": 1
//         }
//       ]
//     }
//   ]
// }
