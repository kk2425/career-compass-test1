# Career Compass AI - Full Stack Application

This is a full-stack career guidance application featuring a React/TypeScript frontend and a Node.js/Express backend.

## Project Structure

- `src/` - Contains all frontend source code (React components, services, etc.)
- `public/` - Contains static assets.
- `server.js` - The Node.js Express backend server.
- `package.json` - Manages project dependencies and scripts.
- `vite.config.ts` - Configuration for the Vite frontend development server.
- `database.json` - This file will be created automatically by the server to store feedback submissions.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup and Installation

1.  **Clone the repository and navigate into the project directory.**

2.  **Create a `.env` file:**
    In the root of your project, create a new file named `.env`. This file will hold your secret API key. Add the following line to it, replacing `YOUR_GEMINI_API_KEY` with your actual key:
    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY
    ```
    **Important:** This file is listed in `.gitignore` and should never be committed to version control.

3.  **Install dependencies:**
    Open your terminal in the project root and run the following command to install both frontend and backend dependencies:
    ```bash
    npm install
    ```

## Running the Application

To run both the frontend and backend servers concurrently, use the single development script:

```bash
npm run dev
```

This command will:
- Start the backend server on `http://localhost:3001`.
- Start the Vite frontend development server on `http://localhost:5173` (or the next available port).
- Open the application automatically in your default web browser.

## How It Works

- The React frontend (running on port 5173) makes API calls to the backend.
- The Express backend (running on port 3001) listens for requests on `/api/feedback`.
- When feedback is submitted, the backend server appends the data to the `database.json` file in your project root, creating a persistent record of all feedback.
