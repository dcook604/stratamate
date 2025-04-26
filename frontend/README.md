# StrataMate Frontend

This is the React frontend for the StrataMate property management application.

## Project Structure
- `src/` — React source code
- `public/` — Static assets (including `index.html`)
- `package.json` — Project dependencies and Vite scripts
- `.env` / `.env.production` — Environment variables for development and production

## Getting Started

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run on [http://localhost:3000](http://localhost:3000).

### Production Build
1. Build the app:
   ```bash
   npm run build
   ```
2. Deploy the contents of the `dist/` directory to your preferred static hosting provider.

### Environment Variables
- `REACT_APP_API_BASE_URL` — The base URL for the backend API (set in `.env` or `.env.production`).

## Deployment
- This app is ready for deployment on Netlify or any static hosting platform.
- The `netlify.toml` file contains Vite build and redirect settings.

## Notes
- Ensure that `package.json` is present and up to date.
- If deploying to Netlify, make sure all files are uploaded, including `package.json`.
