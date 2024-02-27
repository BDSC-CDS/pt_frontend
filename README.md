# Privacy Toolbox frontend

## Introduction
The privacy toolbox is a one stop privacy platform, offer pseudonymisation, de-identification, anonymisation, synthetic data generation and other tools and services related to data privacy protecting techniques

## Getting Started

This guide will walk you through setting up and customizing your frontend based on this template.

### Prerequisites

Before you begin, ensure you have the following installed:

- Docker: A containerization platform.
- Dev Containers extension for Visual Studio Code: Enhances the development experience by allowing you to work within a Docker container.

### Installation

Start by cloning this repository to your local machine:

```bash
git clone https://your-repository-url.git
cd your-repository-name
```

### Development

1. **Open the project in a dev container**

   The project includes a .devcontainer folder at the root. Dev Containers allow for seamless development inside a Docker container, ensuring a consistent and fully-prepared development environment. Learn more about Dev Containers [here](https://code.visualstudio.com/docs/devcontainers/containers).

   To open the project in a Dev Container:

   - Ensure the Dev Containers extension is installed in Visual Studio Code.
   - Click on the green arrows in the lower left corner of VS Code (as shown below).
   - Select "Reopen in Container" from the menu.

   ![alt text](https://code.visualstudio.com/assets/docs/devcontainers/tutorial/remote-status-bar.png)

   Once opened in the container, you'll have access to a terminal for interaction.

2. **Install Dependencies and Run the Development Server**

   Install the necessary packages:

   ```bash
   pnpm install
   ```

   Start the development server:

   ```bash
   pnpm dev
   ```

   Your application will now be running on the specified localhost port. The development server will automatically refresh upon any changes to the code.

3. **Developing Your Application**

   - Main Page: Edit src/pages/index.tsx to modify the homepage.
   - New Pages: Create additional pages and routes in the src/pages directory.
   - Shared Components: Develop reusable components like headers or footers in the src/components folder.

### Production

1. **Testing Your Application**

   - Add or update tests in `__tests__/`.
   - Example tests for components and pages are provided, such as for the Home component.

2. **Local Production Testing**

   Build and run the production application locally:

   ```bash
   cd docker
   ./build-stage1.sh # this step can be done only once
   docker build -f dockerfiles/stage2.dockerfile -t prod-app ..
   docker run -p <some port>:80 -d prod-image
   ```

   Access your application at `localhost:<the port you put>`.

For further assistance or inquiries, feel free to open an issue in the repository.

## Developer documentation

This guide outlines the steps to add a custom service. Begin by cloning the template repository and creating a new branch for your project. To document how to develop within frontend we will implement a concrete service and make the frontend into a real use case. The goal is to develop a simple medication tracker, so that for instance elderly can save the list of their medication, including the name, the posology and frequency of intake and get reminder for it. 

## Prerequisites

For this project, the prerequisites include having Visual Studio Code (VSCode) installed, along with the DevContainer extension for VSCode. Additionally, a fundamental understanding of Typescript or Javascript, and Docker is essential.

## 1. Backend creation

Start by building the backend for your service using the backend template documentation as a reference.

## 2. Integrate the API Folder

Copy the `api/` folder from your backend project into the frontend directory. This folder contains essential API specifications for your service.

## 3. Generate the API Client

To generate the client-side code for your API:

- Modify the `.devcontainer/devcontainer.json` file to specify the Java Dockerfile:

```json
{
  "dockerfile": "java.Dockerfile"
}
```

  <img src="http://gitlab.itrcs3-app.intranet.chuv/privacy-toolbox/template_frontend/-/raw/medication-tracker/images/devcontainer.gif" width="900"  />

- Reopen the project in a DevContainer (ensure the DevContainer VSCode extension is installed).

  <img src="http://gitlab.itrcs3-app.intranet.chuv/privacy-toolbox/template_frontend/-/raw/medication-tracker/images/reopen.gif" width="900"  />

- In the container's terminal, run the script to generate client-side code:

```bash
cd scripts
./generate.protos.sh
```

New files will appear in `src/internal/client/`, constituting your service's API client. No modification is necessary for these files.

## 4. Develop the User Interface (UI)

To start UI development:

- Exit the Java container and revert the `.devcontainer.json` to use the standard development Dockerfile:

  <img src="http://gitlab.itrcs3-app.intranet.chuv/privacy-toolbox/template_frontend/-/raw/medication-tracker/images/open-ssh.gif" width="900"  />

```json
{
  "dockerfile": "dev.Dockerfile"
}
```

Reopen the project in the updated container and run:

```bash
pnpm install
pnpm dev
```

Access your development website at the address specified in the terminal (e.g., http://localhost:3000). Changes to the UI code will be reflected immediately on this development site.

### UI Code Structure

- `src/`: Root directory for UI code.
- `src/pages/`: Contains main website pages. Each .tsx file corresponds to a path (e.g., localhost:3000/new_page).
- `src/pages/_app.tsx`: Global file. Generally doesn't require changes.
- `src/pages/index.tsx`: Main homepage.
- `src/internal/`: Contains the unmodifiable API client code.
- `src/components/`: Reusable UI components (e.g., headers, footers).
- `src/styles/global.css`: Global CSS settings. Use [Tailwind CSS](https://tailwindcss.com/) for inline styles.
- `src/utils/`: API configuration and utility functions. For added API services:

  - Create an API client configuration file (e.g., apiClientNewService.ts):

  ```typescript
  import {
    IndexApi,
    Configuration,
    NewServiceApi,
  } from "../internal/client/index";

  const apiURL = "https://url/";
  const apiConfig = new Configuration({ basePath: apiURL });
  const apiClientNewService = new AuthenticationApi(apiConfig);

  export default apiClientNewService;
  ```

  - Optionally, create utility functions for API paths:

  ```typescript
  import apiClientNewService from "././apiClientNewService";
  import { GetNewServicePathRequest } from "../internal/client/index";
  import { number } from "zod";

  export const getNewService = async (id: number) => {
    const request: GetNewServiceRequest = {
      body: {
        id: id,
      },
    };

    try {
      const response = await apiClientNewService.getNewService(request);
      return response;
    } catch (error) {
      console.log("Error getting  ...:" + error);
    }
  };
  ```

  Refer to the .proto file in api/ for request structure.

### Linking Pages

Use Next.js Link components for navigation:

```tsx
<Link href="/new_page" passHref>
  <span className="tailwindcss configs">Go to new page</span>
</Link>
```

## Production

1. **Testing Your Application**

   - Add or update tests in `__tests__/`.
   - Example tests for components and pages are provided, such as for the Home component.

2. **Deployment Configuration**

   The template is set up for deployment via Kubernetes. Update the configuration in the deploy directory, or modify the CI/CD pipeline in jenkins for alternative deployment methods.

3. **Setting Up CI/CD with Jenkins**

   - Push your code to a GitLab repository.
   - Create a new folder in Jenkins and configure two stages:
     - The first stage builds the base image (jenkins/stage1.jenkinsfile).
     - The second stage is a Multibranch Pipeline that builds, tests, and deploys your site (jenkins/stage2.jenkinsfile).
   - View the original pipeline configuration [here](https://jenkins.horus-graph.intranet.chuv/jenkins/job/100-DS/job/Template%20frontend/).
   - Every push to GitLab will trigger this pipeline, automating the testing and deployment process.

4. **Local Production Testing**

   Build and run the production application locally:

   ```bash
   cd docker
   ./build-stage1.sh # this step can be done only once
   docker build -f dockerfiles/stage2.dockerfile -t prod-app ..
   docker run -p <some port>:80 -d prod-image
   ```

   Access your application at `localhost:<the port you put>`.
