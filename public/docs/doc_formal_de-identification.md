# Formal De-Identification

You can use  the Formal Risk Assessment to perform detailed and formal privacy assessments of your datasets.
To apply de-identification techniques on a dataset using the **ARX service template** via a Jupyter notebook interface.

## Steps and Process
### 1. **Imports**
Import the necessary Python libraries and ARX service client methods

### 2. **Parameters**
- **Authentication Token**: The token is a JWT (JSON Web Token) used to authenticate requests to the ARX service
- **ARX Service URL**: arx_service_url is the endpoint where the ARX service runs
- **Backend Host**: The backend_host is the base URL for making requests to the data management system
- **Alternative: Requesting a Token Manually**: If the token is not pre-provided, you can manually request it by authenticating with your username and password.

### 3. **Fill the dataset**

#### **1. Loading the Dataset (`pd.read_parquet`)**
- **Purpose**: Reads the dataset in **Parquet** format and loads it into a pandas DataFrame
- **Parameters**:
  - `backend_host + "/api/v1/dataset/dataframe/84"`: The URL where the dataset (with ID `84`) is hosted
    - `backend_host` is the base URL of the backend server
  - `storage_options={"Authorization": "Bearer " + token}`: This provides authorization to access the dataset:
    - `"Bearer " + token`: Adds a **Bearer Token** for authentication, allowing secure access to the dataset

#### **2. Converting All Data to String (`dataset.astype(str)`)**
- **Purpose**: Converts all columns in the DataFrame to string format to ensure uniform data types

#### **3. Displaying the Data (`dataset`)**
- Shows the content of the loaded dataset after converting it to string format.

### 4. **Configuration**

#### **1. Build the basic configuration**
- **`build_basic_configuration()`**: Initializes the basic configuration object for the assessment.
- **`set_data_as_csv(config, dataset)`**: Converts the dataset to CSV format and includes it in the configuration.
  - `dataset`: The DataFrame containing the dataset data.

#### **2. Fill the job parameters values**
- **`set_nb_solutions(config, 2)`**: Sets the number of generalization solutions to **2**
- **`set_suppression_limit(config, 1)`**: Sets the suppression limit to **1** (i.e., the maximum percentage of data allowed to be suppressed for anonymization)
- **`set_is_used_population_model(config, False)`**: Disables the population model for risk calculation

#### **3. Fill the attributes**

This section defines different types of attributes such as **identifying attributes**, **quasi-identifying attributes**, and **insensitive attributes**:

- **"IPP_MASTER"**: An identifying attribute (e.g., patient ID)
  - `"IDENTIFYING_ATTRIBUTE"`: Indicates this attribute directly identifies individuals
- **Quasi-identifying attributes**: Attributes that, when combined, may re-identify individuals (e.g., "Sex", "Nationality")
- **Insensitive attributes**: Attributes with no significant re-identification risk

**Example**:
```python
config = configure_attribute(config, "DATE NAISSANCE", "DATE_NAISSANCE", "INSENSITIVE_ATTRIBUTE", None)
config = configure_attribute(config, "SEXE", "SEXE", "QUASI_IDENTIFYING_ATTRIBUTE", 0.5)
config = configure_attribute(config, "NATIONALITE", "NATIONALITE", "QUASI_IDENTIFYING_ATTRIBUTE", 0.5)
```

- **"DATE NAISSANCE"**: Marked as an **insensitive attribute**.
- **"SEXE"**: A **quasi-identifying attribute** with a generalization level of **0.5**.
- **"NATIONALITE"**: A **quasi-identifying attribute** with a generalization level of **0.5**.

#### **4. Fill the hierarchies (optional for attributes managed by the service by default)**

If needed, you can define generalization hierarchies for certain attributes using external CSV files.

```python
config = add_hierarchy(
     config, "SEXE", pd.read_csv("../gender_hierarchy.csv", header=None, sep=";")
 )
```

- **`add_hierarchy()`**: Adds a generalization hierarchy for an attribute.
  - Example: Adding a generalization hierarchy for "SEXE" using a CSV file (`gender_hierarchy.csv`), where values like "Male" and "Female" can be grouped into broader categories.

### 5. **Execute de-identification**

#### **1. Execute de-identification by Marketer Risk Level**

- **`set_average_prosecutor_risk(config, 0.45)`**: Sets the average prosecutor risk threshold to **0.45** (i.e., 45% probability that an individual could be identified by a prosecutor using known quasi-identifiers).
  - **Value `0.45`**: Indicates the acceptable risk level; lower values result in stricter anonymization.


#### **2. Apply the Assessment**

- **`apply_assessment(arx_service_url, config)`**: Sends the configured risk assessment request to the **ARX service** to execute the de-identification.
  - **`arx_service_url`**: The URL of the ARX service
  - **`config`**: The configuration object containing all the parameters for the assessment

#### **3. Apply Expert-based Anonymization**

- **`apply_expert_by_average_prosecutor_risk_level(arx_service_url, config)`**: Applies an expert-based de-identification process based on the average prosecutor risk level. This ensures that the anonymization process adheres to the set risk threshold and optimizes the anonymization level.