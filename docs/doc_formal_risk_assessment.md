# Formal Risk Assessment

You can use the Formal Risk Assessment to evaluate the re-identification risk of datasets and ensure compliance with data protection regulations.

## Steps and Process

### 1. **Dataset Selection**
- **Page View**: Displays a list of datasets with the following columns:
  - **Dataset ID**: A unique identifier for the dataset
  - **Dataset Name**: The name given to the dataset
  - **Created At**: Date when the dataset was created
- **Actions**: Click a row to select a dataset for risk assessment

### 2. **Quasi-Identifier Definition**
- **Requirement**: To proceed with the risk assessment, you must define **quasi-identifiers**.
- Quasi-identifiers are attributes that, when combined, could help identify individuals (e.g., "Age", "Location").
- If no quasi-identifiers are defined, you will receive a notification:  
  *"No quasi-identifiers have been defined for this dataset."*  
  The risk assessment cannot be performed without this step.
- You can define the quasi-identifiers either during the initial dataset upload or in the My Dataset tab. There, you can modify the data and save it as a new dataset. Once the dataset is updated, you can proceed with the formal risk assessment.

### 3. **Risk Assessment Output**
Once the quasi-identifiers are defined, the application generates a **risk assessment report** in JSON format. The key details in the JSON are:

- **Risk Metrics**:
  - **average_prosecutor_risk**: Shows the average risk that a random individual could re-identify a dataset entry. (0 = no risk, 1 = high risk)
  - **maximum_prosecutor_risk**: Displays the highest re-identification risk in the dataset.
  - **quasi_identifiers**: Lists the defined QIDs that are used in the assessment.
  
- **Example JSON Report:**

```json
{
  "result": {
    "riskAssessment": {
      "average_prosecutor_risk": 1,
      "maximum_prosecutor_risk": 1,
      "quasi_identifiers": "quasi identifiers: Fruit",
      "dataset_id": 196,
      "risk_assessment": {
        "resultsMetadata": {
          "126": {
            "attributeTypes": {
              "quasiIdentifying": ["Fruit"],
              "sensitive": []
            },
            "id": 126,
            "risks": {
              "initialAverageProsecutor": 1,
              "initialHighestProsecutor": 1,
              "initialMarketer": 1
            }
          }
        }
      }
    }
  }
}
