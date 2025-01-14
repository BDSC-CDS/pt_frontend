# **Rule-Based De-identification**

## **Steps and Process**

### 1. **Select or Upload a New Dataset** 
- Navigate to the dataset list and click on a dataset to view its details
  - Information displayed:
    - **Dataset Name**, **Created Date**, **Number of Rows**, **Number of Columns**
- You can also upload a new CSV file by clicking the **"New Project"** button

### 2. **Create Configuration** 
- Click **Rule-Based De-identification** to open the configuration form
- **Options Available**:
  - **Has Date Shift**:  
    - Adjusts the dates in your dataset within a specified range to anonymize time-sensitive information. 
    - Example: Configure a lower and upper range (e.g., `-30` to `30` days) to shift dates randomly within that range.
  
  - **Has Scramble Field**:  
    - Randomizes the values in specified fields to break direct connections between data entries.  
    - Example: Provide a list of fields to scramble (e.g., `EmployeeID`, `FirstName`, `Department`).
  
  - **Has Substitute Field List**:  
    - Replaces the values in the selected fields with values from a predefined list.  
    - Example: Replace department names with generic values (e.g., "HR" → "Department A").
  
  - **Has Substitute Field Regex**:  
    - Substitutes text in selected fields based on a regular expression pattern.  
    - Example: Replace specific patterns such as `allergy[1-3]` with a generic value (e.g., `ALLERGY_ID`).

### 3. **Import Configuration**  
- Use the **Import Configuration** option to load an existing configuration file.
- You can create such a file using the **Qualitative Risk Assessment** tool. At the end of the questionnaire, you can download the SPHN configuration file, which is compatible for use here.

### 4. **Apply Transformation**  
- After defining or importing a configuration, select the transformation on the right side and click **Apply Transformation**.
- Confirm the changes to transform the dataset.

### 5. **New Transformed Dataset**  
- After applying the transformation, a new copy of your dataset is created.
- You can view the new version in your **Dataset Overview**.
