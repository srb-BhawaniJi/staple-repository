# staple-repository

## Installation

Follow these steps to run the project locally:

1. **Clone the repository**:
   git clone <repository_url>
   cd staple-repository

2. **Install dependencies**:
    npm install

3. **Set up GitHub Token**:
    In the src/ApolloClient.js file, you will need to replace YOUR_GITHUB_TOKEN with your personal GitHub token for authentication.

    Please make sure to do this step other project will show error 
    **Error: Response not successful: Received status code 401**

4. **Start the development server**:
    npm run dev



## Commit Messages
- Initial commit:
This commit was created to verify if pull requests (PRs) are getting listed correctly from GitHub using GraphQL. This helped in setting up the initial structure and connection to GitHub's GraphQL API.

- User friendly:
Improved the user interface by adding styling with Material-UI. The goal was to make the project more user-friendly and visually appealing.

- Project v1:
This was the initial version of the project, which was running on **Webpack** for bundling and development.

- Upgraded tech stack:
In this commit, the project’s tech stack was upgraded:

**Vite** replaced Webpack as the build tool for faster development.

**React 18** was integrated to leverage the latest features and concurrent rendering.

The **Node.js** version was upgraded to Node.js 20