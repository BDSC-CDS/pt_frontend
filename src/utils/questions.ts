export const questions = {
    "Structured data": [
      {
        "question_id": "D-01",
        "question_description": "Direct identifiers (e.g., name, phone number social security number, email address, medical record number, license number)",
        "risk_weight": 10,
        "answers": [
          {
            "answer_id": "D-01-01",
            "answer_description": "Identifiers are not used in the project (default)",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-01-02",
            "answer_description": "Identifiers are replaced by pseudonym ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-01-03",
            "answer_description": "Original values of one or more direct identifiers are kept (*if this rules is selected the data set is not considered de-identified)",
            "ethics_approval": false,
            "high_risk": true,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "D-02",
        "question_description": "Patient ID",
        "risk_weight": 10,
        "answers": [
          {
            "answer_id": "D-02-01",
            "answer_description": "Identifiers are replaced by pseudonym (project specific patient identifier) (default) ",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-02-02",
            "answer_description": "No patient ID used, no project specific patient identifier created",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-02-03",
            "answer_description": "Original values are kept (hospital internal patient identifier) (*if this rules is selected the data set is not considered de-identified)",
            "ethics_approval": false,
            "high_risk": true,
            "risk_level": 0
          },
          {
            "answer_id": "D-03-01",
            "answer_description": "Sample ID is not use in the project",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "D-03",
        "question_description": "Sample ID",
        "risk_weight": 7,
        "answers": [
          {
            "answer_id": "D-03-02",
            "answer_description": "Identifiers are replaced by pseudonym (project specific sample identifier) (default)  ",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-03-03",
            "answer_description": "Original values are kept (hospital internal sample identifier)",
            "ethics_approval": false,
            "high_risk": true,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "D-04",
        "question_description": "Administrative case ID",
        "risk_weight": null,
        "answers": [
          {
            "answer_id": "D-04-01",
            "answer_description": "Administrative case ID is not use in the project (default)  ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-04-02",
            "answer_description": "Identifiers are replaced by pseudonym (project specific identifier) ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-04-03",
            "answer_description": "Original values are kept (hospital internal sample identifier)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "D-05",
        "question_description": "Lab report ID",
        "risk_weight": null,
        "answers": [
          {
            "answer_id": "D-05-01",
            "answer_description": "Lab report ID and Lab order ID is not use in the project (default)  ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-05-02",
            "answer_description": "Identifiers are replaced by pseudonym (project specific identifier) ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-05-03",
            "answer_description": "Original values are kept (hospital internal sample identifier)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "D-06",
        "question_description": "Dates in the patient record (dates of birth and death excluded)",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "D-06-01",
            "answer_description": "Dates are suppressed or replaced with a surrogate date or not used in the project",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -2
          },
          {
            "answer_id": "D-06-02",
            "answer_description": "Dates are shifted by a random number of days within +/- 365 days",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "D-06-03",
            "answer_description": "Dates are shifted by a random number of days within +/- 90 days (default,one quarter offset to preserve seasonality)",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-06-04",
            "answer_description": "Dates are shifted by a random number of days within +/- 30 days (one month offset to preserve seasonality) ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "D-06-05",
            "answer_description": "Dates are shifted by a random number of days within +/- 7 days (one week offset) ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 2
          },
          {
            "answer_id": "D-06-06",
            "answer_description": "Dates in the patient record are not used in the project",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-06-07",
            "answer_description": "Original dates are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 3
          }
        ]
      },
      {
        "question_id": "D-07",
        "question_description": "Date of birth",
        "risk_weight": 6,
        "answers": [
          {
            "answer_id": "D-07-01",
            "answer_description": "Date of birth concept is not used in the project ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "D-07-02",
            "answer_description": "Date of birth is shifted with the same random numbers as the other dates in rule D-04 (default)",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-07-03",
            "answer_description": "Only the year of the original birth date is kept ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "D-07-04",
            "answer_description": "Only the year and month of the original birth date are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 2
          },
          {
            "answer_id": "D-07-05",
            "answer_description": "Full original date of birth is kept (dd/mm/yyyy)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "D-08",
        "question_description": "Date of death",
        "risk_weight": 6,
        "answers": [
          {
            "answer_id": "D-08-01",
            "answer_description": "Date of death concept is not used in the project",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "D-08-02",
            "answer_description": "Date of death is shifted with the same random numbers as the other dates in rule D-04 (default)",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-08-03",
            "answer_description": "Only the year of the original death date is kept ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "D-08-04",
            "answer_description": "Only the year and month of the original death date are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 2
          },
          {
            "answer_id": "D-08-05",
            "answer_description": "Full original date of death is kept (dd/mm/yyyy)",
            "ethics_approval": false,
            "high_risk": true,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "D-09 ",
        "question_description": "Age",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "D-09-01",
            "answer_description": "Age is suppressed (e.g. default for reports) ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -2
          },
          {
            "answer_id": "D-09-02",
            "answer_description": "The age concept is not used in the project",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-09-03",
            "answer_description": "Age in generalized in groups of 5 or more years",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "D-09-04",
            "answer_description": "Original age is kept except for people with more than 89y old who are put in the age class \"90y+\" (default)",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-09-05",
            "answer_description": "Original age is kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      },
      {
        "question_id": "D-10",
        "question_description": "Professions",
        "risk_weight": 2,
        "answers": [
          {
            "answer_id": "D-10-01",
            "answer_description": "Profession is not used in the project (default)",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-10-02",
            "answer_description": "Original profession is kept, but replaced by a random profession for identifying ones",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      },
      {
        "question_id": "D-11 ",
        "question_description": "Residential address  (street, zip code, city, region, country)",
        "risk_weight": 7,
        "answers": [
          {
            "answer_id": "D-11-01",
            "answer_description": "Locations are not used in the project (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -2
          },
          {
            "answer_id": "D-11-02",
            "answer_description": "Locations are generalized",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-11-03",
            "answer_description": "Only countries are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "D-11-04",
            "answer_description": "Only regions are kept",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-11-05",
            "answer_description": "Only cities are kept. If cities have less than 20.000 inhabitants, cities are replaced by region",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "D-11-06",
            "answer_description": "Only the zip codes are kept. If zip codes refer to regions with less than 20.000 inhabitants, the last 2 numbers of the zip codes are suppressed",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 2
          },
          {
            "answer_id": "D-11-07",
            "answer_description": "The original locations are kept",
            "ethics_approval": false,
            "high_risk": true,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "D-12",
        "question_description": "Organizations (data provider organization excluded)",
        "risk_weight": 1,
        "answers": [
          {
            "answer_id": "D-12-01",
            "answer_description": "Organization name is not used in the project  (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-12-02",
            "answer_description": "Organization type is kept (e.g., hospital, clinic, etc.) ",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "D-12-03",
            "answer_description": "Organization name is kept (e.g., University Hospital Basel) ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 2
          }
        ]
      },
      {
        "question_id": "D-13",
        "question_description": "Organizational Units (data provider organizational unit excluded)",
        "risk_weight": 2,
        "answers": [
          {
            "answer_id": "D-13-01",
            "answer_description": "Organizational unit is not used in the project (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "D-13-02",
            "answer_description": "Organizational unit is generalized (e.g., Neurology, Radiology, Urology, etc.) ",
            "ethics_approval": true,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "D-13-03",
            "answer_description": "Organizational unit is kept (e.g.,328 Kardiologie ME) ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 2
          }
        ]
      }
    ],
    "Multimedia variables": [
      {
        "question_id": "M-01",
        "question_description": "Audio Data",
        "risk_weight": 5,
        "answers": [
          {
            "answer_id": "M-01-01",
            "answer_description": "No audio data is used in the project",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "M-01-02",
            "answer_description": "Patient voice is kept in audio files",
            "ethics_approval": false,
            "high_risk": true,
            "risk_level": 0
          },
          {
            "answer_id": "M-01-03",
            "answer_description": "Patient voice blurring/noise algorithm (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "M-02",
        "question_description": "Images (including photos) & Videos with patient face or identifying body parts (e.g., tatoos, malformations)",
        "risk_weight": 5,
        "answers": [
          {
            "answer_id": "M-02-01",
            "answer_description": "No images are used in the project",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "M-02-02",
            "answer_description": "Original image or video files are kept",
            "ethics_approval": false,
            "high_risk": true,
            "risk_level": 0
          },
          {
            "answer_id": "M-02-03",
            "answer_description": "Blurring of identifying parts (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "M-02-04",
            "answer_description": "Removing of identifying face or identifying patient body parts (e.g., by defacing algorithms)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          }
        ]
      }
    ],
    "DICOM attributes (DICOM attributes listed in the confidentiality list (http://dicom.nema.org/medical/dicom/current/output/chtml/part15/chapter_E.html) will be removed unless they are listed under DCM-06": [
      {
        "question_id": "DCM-01",
        "question_description": "Hardware Identifying Attributes",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "DCM-01-01",
            "answer_description": "Original value is suppressed",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "DCM-01-02",
            "answer_description": "Original value is replaced by pseudonym (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "DCM-01-03",
            "answer_description": "Original values are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      },
      {
        "question_id": "DCM-02",
        "question_description": "Study Description",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "DCM-02-01",
            "answer_description": "Original value is suppressed",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "DCM-02-02",
            "answer_description": "Original value is replaced by pseudonym (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "DCM-02-03",
            "answer_description": "Original values are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      },
      {
        "question_id": "DCM-03",
        "question_description": "Series Description",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "DCM-03-01",
            "answer_description": "Original value is suppressed",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "DCM-03-02",
            "answer_description": "Original value is replaced by pseudonym (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "DCM-03-03",
            "answer_description": "Original values are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      },
      {
        "question_id": "DCM-04",
        "question_description": "Derivation Description",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "DCM-04-01",
            "answer_description": "Original value is suppressed",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "DCM-04-02",
            "answer_description": "Original value is replaced by pseudonym (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "DCM-04-03",
            "answer_description": "Original values are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      },
      {
        "question_id": "DCM-05",
        "question_description": "Contrast Bolus Agent",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "DCM-05-01",
            "answer_description": "Original value is suppressed",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "DCM-05-02",
            "answer_description": "Original value is replaced by pseudonym (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "DCM-05-03",
            "answer_description": "Original values are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      },
      {
        "question_id": "DCM-06",
        "question_description": "Retain original values of other DICOM attributes that would be removed by default according to the recommendations of nema.org",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "DCM-06-01",
            "answer_description": "Original value is suppressed",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "DCM-06-02",
            "answer_description": "Original value is replaced by pseudonym (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "DCM-06-03",
            "answer_description": "Original values are kept",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      }
    ],
    "Genomic variables": [
      {
        "question_id": "G-01",
        "question_description": "Germline genomic sequences",
        "risk_weight": 7,
        "answers": [
          {
            "answer_id": "G-01-01",
            "answer_description": "No germline genomic sequences are used in the project ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "G-01-02",
            "answer_description": "Only blurred summary statistics (e.g., MAF, p-values, ORs) are released (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "G-01-02",
            "answer_description": "Only exact summary statistics (e.g., MAF, p-values, ORs) are released ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "G-01-05",
            "answer_description": "Original individual-level values are released",
            "ethics_approval": false,
            "high_risk": true,
            "risk_level": 0
          }
        ]
      }
    ],
    "Other variables": [
      {
        "question_id": "O-01",
        "question_description": "Additional project specific quasi-identifiers that can be used for linkage by the data recipient (e.g., clinical variables) ",
        "risk_weight": 5,
        "answers": [
          {
            "answer_id": "O-01-01",
            "answer_description": " no other quasi-identifiers used in the project ",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "O-01-02",
            "answer_description": "Quasi-identifiers have been modified to reduce risks (e.g. generalization) (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "O-01-03",
            "answer_description": "Original values are kept",
            "ethics_approval": false,
            "high_risk": true,
            "risk_level": 0
          }
        ]
      }
    ],
    "Jurisdiction": [
      {
        "question_id": "C-01",
        "question_description": "In which jurisdiction the project data is planned to be stored and processed?\n",
        "risk_weight": 2,
        "answers": [
          {
            "answer_id": "C-01-01",
            "answer_description": "In Switzerland (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-01-02",
            "answer_description": "In EU or another country providing an adequate level of protection, recognized as such by the Federal Council",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "C-01-03",
            "answer_description": "In a country that does not provide an adequate level of protection, but with adequate safeguards according to Swiss law",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 2
          },
          {
            "answer_id": "C-01-04",
            "answer_description": "In a country that does not provide an adequate level of protection and without adequate safeguards according to Swiss law",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      }
    ],
    "Contracts and policies": [
      {
        "question_id": "C-02",
        "question_description": "Is there a legal agreement between the data provider(s) and the data recipient(s) (e.g., a data transfer and use agreement) that regulates  the conditions under which data are disclosed to the data recipient(s)?",
        "risk_weight": 4,
        "answers": [
          {
            "answer_id": "C-02-01",
            "answer_description": "Yes (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-02-02",
            "answer_description": "No",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "C-03",
        "question_description": "Does the legal agreement between the data provider(s) and the data recipient(s) forbid the recipient(s) from disclosing the data to third parties or only with measures equivalent to those contractually agreed between the data provider and the data recipient?",
        "risk_weight": 4,
        "answers": [
          {
            "answer_id": "C-03-01",
            "answer_description": "Yes (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "",
        "question_description": "",
        "risk_weight": null,
        "answers": [
          {
            "answer_id": "C-03-02",
            "answer_description": "No",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "C-04-02",
            "answer_description": "No (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-05-02",
            "answer_description": "No (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-06-02",
            "answer_description": "No (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "C-04",
        "question_description": "Does the legal agreement between the data provider(s) and the data recipient(s) stipulate that external audits of the data management practices of the data recipient may be performed?",
        "risk_weight": 4,
        "answers": [
          {
            "answer_id": "C-04-01",
            "answer_description": "Yes",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          }
        ]
      },
      {
        "question_id": "C-05",
        "question_description": "Does the legal agreement between the data provider(s) and the data recipient(s) stipulate that regular external audits of privacy and security practices of the data recipient may be performed?",
        "risk_weight": 4,
        "answers": [
          {
            "answer_id": "C-05-01",
            "answer_description": "Yes",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          }
        ]
      },
      {
        "question_id": "C-06",
        "question_description": "Does the legal agreement between the data provider(s) and the data recipient(s) associate penalties in case of health-related data misuse by the recipient?",
        "risk_weight": 4,
        "answers": [
          {
            "answer_id": "C-06-01",
            "answer_description": "Yes",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          }
        ]
      },
      {
        "question_id": "C-07",
        "question_description": "Are the recipient's staff members personally bound by a duty of confidentiality (e.g. confidential agreement, access policy imposing a duty of confidentiality, personal legal obligation of confidentiality)? ",
        "risk_weight": 6,
        "answers": [
          {
            "answer_id": "C-07-01",
            "answer_description": "Yes (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-07-02",
            "answer_description": "No",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      },
      {
        "question_id": "C-08",
        "question_description": "Are there IT security and privacy policies in effect at the data recipient site?",
        "risk_weight": 5,
        "answers": [
          {
            "answer_id": "C-08-01",
            "answer_description": "Yes (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-08-02",
            "answer_description": "No",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      }
    ],
    "Cohort characteristics": [
      {
        "question_id": "C-11",
        "question_description": "Is the project collecting health-related data on rare disease patients?",
        "risk_weight": 5,
        "answers": [
          {
            "answer_id": "C-11-01",
            "answer_description": "No health-related data on rare diseases are included (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "C-11-02",
            "answer_description": "The disease occurs less than one in 80.000 (i.e., max. 100 cases in Switzerland)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "C-11-03",
            "answer_description": "The disease occurs less than one in 2.000 (i.e., max. 4.000 cases in Switzerland)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "C-12",
        "question_description": "Is one or more of the following sensitive/stigmatizing information included in the dataset?\n\n- religious, ideological, political or trade union-related views or activities\n- disease associated with stigma (e.g. HIV status, psycological conditions), the intimate sphere or the racial origin\n- social security measures\n- administrative or criminal proceedings and sanctions",
        "risk_weight": 5,
        "answers": [
          {
            "answer_id": "C-12-01",
            "answer_description": "No (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-12-02",
            "answer_description": "Yes",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      },
      {
        "question_id": "C-13",
        "question_description": "Does anyone in the data recipient's project team has access to mapping table for patient re-identification (i.e., data subjects)?",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "C-13-01",
            "answer_description": "No (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-13-02",
            "answer_description": "Yes",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      }
    ],
    "Data users": [
      {
        "question_id": "C-14",
        "question_description": "Who will have access to health-related data shared during the project?\nMultiple selections possible.",
        "risk_weight": 3,
        "answers": [
          {
            "answer_id": "C-14-01",
            "answer_description": "Internal users of the hospital (i.e., the provider) from where the data is coming from, but who do not have access to the Electronic Health Records (EHC) of the hospital (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-14-02",
            "answer_description": "Internal users of the hospital (i.e., the provider) from where the data is coming from and who have access to the Electronic Health Records (EHC) of the hospital (this excludes internal Clinical Data Warehouse (CDW) employees)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "C-14-03",
            "answer_description": "External users from Switzerland or EU",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 2
          },
          {
            "answer_id": "C-14-04",
            "answer_description": "External users outside of Switzerland or EU",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      }
    ],
    "IT Infrastructure and security": [
      {
        "question_id": "C-12",
        "question_description": "Where does the project data will be stored and processed (select the worst answer that applies)?",
        "risk_weight": 10,
        "answers": [
          {
            "answer_id": "C-12-01",
            "answer_description": "On the hospital IT infrastructure of the data recipient (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-12-02",
            "answer_description": "On  computer(s) controlled by the hospital IT department of the data recipient",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          },
          {
            "answer_id": "C-12-03",
            "answer_description": "On an external third party's IT infrastructure (e.e., cloud provider, HPC provider) such as the BioMedIT network",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 2
          },
          {
            "answer_id": "C-12-04",
            "answer_description": "On PRIVATE computer (e.g., desktop, laptop, etc.)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "C-13",
        "question_description": "If the project data is stored or processed on the IT infrastructure of an external provider, does such provider comply with the BioMedIT Information Security Policy?",
        "risk_weight": 10,
        "answers": [
          {
            "answer_id": "C-13-01",
            "answer_description": "Yes (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -2
          },
          {
            "answer_id": "C-13-02",
            "answer_description": "No",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "C-14",
        "question_description": "If the project data is stored or processed on the IT infrastructure of an external provider, does the Management System of the provider's Information Security has been also audited and certified from an Information Security perspective (e.g., ISO 27001) and from a data protection perspective (GDPR,...)",
        "risk_weight": 10,
        "answers": [
          {
            "answer_id": "C-14-01",
            "answer_description": "Yes",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": -1
          },
          {
            "answer_id": "C-14-02",
            "answer_description": "No (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          }
        ]
      },
      {
        "question_id": "C-15",
        "question_description": "If the project data is stored or processed on the IT infrastructure of an external provider, is there a legal processing agreement with the external provider of the infrastructure such as the BioMedIT Network (e.g., data processor agreement)?",
        "risk_weight": 10,
        "answers": [
          {
            "answer_id": "C-15-01",
            "answer_description": "Yes (default)",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 0
          },
          {
            "answer_id": "C-15-02",
            "answer_description": "No",
            "ethics_approval": false,
            "high_risk": false,
            "risk_level": 1
          }
        ]
      }
    ]
  }