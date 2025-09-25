<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Habitica Bingo App

This is an online application to create and track bingo cards using your tasks from Habitica. All data is stored locally in your browser.

## Run Locally

**Prerequisites:** Node.js

1.  **Install dependencies:**
    `npm install`
2.  **Run the app:**
    `npm run dev`
    
    The application will be available at `http://localhost:3000`.

## Deploy to GitHub Pages

This project is configured for easy deployment to GitHub Pages.

1.  **Set the `homepage` URL:**
    Open the `package.json` file and change the `homepage` value to your GitHub Pages URL.
    For example: `"homepage": "https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/"`

2.  **Set the `base` path:**
    Open the `vite.config.ts` file and change the `base` value to match your repository name.
    For example: `base: '/<YOUR_REPOSITORY_NAME>/'`

3.  **Deploy:**
    Run the following command in your terminal:
    `npm run deploy`
    
    This command will automatically build your application and push the result to a `gh-pages` branch on your repository.

4.  **Configure GitHub Pages:**
    In your GitHub repository settings, navigate to the "Pages" section and set the source to deploy from the `gh-pages` branch. Your site will be live within a few minutes.