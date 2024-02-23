# Next.js Frontend Template

This project is a Next.js frontend template designed to kickstart your web development projects. It integrates Tailwind CSS for styling and TypeScript for type-safe coding, providing a robust foundation for building modern web applications.

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

2. **Deployment Configuration**

   The template is set up for deployment via Kubernetes. Update the configuration in the deploy directory, or modify the CI/CD pipeline in jenkins for alternative deployment methods.

3. **Setting Up CI/CD with Jenkins**

   - Push your code to a GitLab repository.
   - Create a new folder in Jenkins and configure two stages:
     - The first stage builds the base image (jenkins/stage1.jenkinsfile).
     - The second stage is a Multibranch Pipeline that builds, tests, and deploys your site (jenkins/stage2.jenkinsfile).
   - View the original pipeline configuration [here](https://jenkins.rdeid.unil.ch/jenkins/job/100-DS/job/Template%20frontend/).
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

For further assistance or inquiries, feel free to open an issue in the repository.
