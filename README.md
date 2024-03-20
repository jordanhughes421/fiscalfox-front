FiscalFox Frontend

Welcome to the FiscalFox Frontend repository! This React application is designed to offer intuitive financial tracking and management tools. Below you'll find a guide on how the project is structured, the technologies used, and how you can get started with development.
Technologies and Libraries

    React: The core framework used for building the UI.
    Material-UI: Provides a wide range of components for a sleek, responsive design.
    react-router-dom: Manages routing for a single-page application experience.
    Emotion: Used for writing CSS styles in JavaScript.
    Testing Libraries: Jest, @testing-library/react, and @testing-library/user-event for robust frontend testing.

Getting Started 

To get started with development, follow these steps to set up your environment:

    Clone the repository: Download the code to your local machine.
    Install dependencies: Run npm install to install all required dependencies for the project.
    Local Development:
        For local development with hot reloading and real-time changes, use npm run local. This leverages react-scripts start to serve the app in development mode with built-in hot reloading.
    Prod-like Testing:
        To mimic a production environment locally, first build the application using npm run build, which compiles the React app into static files for production. Then, serve the production build with npm start, which serves the app with a static server. This approach is useful for testing the production build of your application locally before deployment.
    Deployment:
        For deployment, particularly when deploying to platforms like Heroku, the heroku-postbuild script is configured to automatically run npm run build as part of the deployment process. This ensures that the latest version of your application is built and ready for production.

Project Structure

The project follows a modular structure to keep components manageable and reusable:

    src/App.js: The main application component that ties everything together.

    src/index.js: The entry point for the application, where the React app is rendered into the DOM.

    Components: This directory contains all the React components used in the application, structured as follows:
        AddAsset, AddExpense, AddProject, AddRevenue: Components for adding new entries to their respective categories.
        DataDeleter: Provides functionality for deleting data entries.
        DataEditor: Allows for the editing of existing data entries.
        HomePage: The landing page of the application.
        Navbar: A navigation bar component for easy access to different parts of the application.
        auth: Contains components and utilities related to authentication.
        fetchers: Utility functions for making API requests and managing data fetch operations.

Contributing

We welcome contributions to the FiscalFox Frontend! Please feel free to submit issues, pull requests, or suggestions to improve the codebase or add new features.
