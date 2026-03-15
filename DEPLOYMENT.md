# Deployment Guide: AgroPredict

This project is a full-stack web application designed for predicting crop yields using Machine Learning.

## Technology Stack
- **Frontend**: React.js (Vite)
- **Backend**: Node.js (Express)
- **ML Logic**: TypeScript (Simulated) / Python (Training)
- **Database**: Firestore (History) / MySQL (Training Source)
- **Styling**: Tailwind CSS

## Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment Instructions

### 1. Render / Railway
- Connect your GitHub repository.
- Set the Build Command: `npm run build`
- Set the Start Command: `npm start`
- Add Environment Variables:
  - `NODE_ENV=production`
  - `GEMINI_API_KEY` (if using AI features)

### 2. Google Cloud Run
- Build the Docker image:
  ```bash
  docker build -t gcr.io/[PROJECT_ID]/agropredict .
  ```
- Push to Container Registry:
  ```bash
  docker push gcr.io/[PROJECT_ID]/agropredict
  ```
- Deploy to Cloud Run:
  ```bash
  gcloud run deploy agropredict --image gcr.io/[PROJECT_ID]/agropredict --platform managed
  ```

### 4. Vercel (Recommended for Frontend + Serverless)
- Connect your GitHub repository to Vercel.
- Vercel will automatically detect the `vercel.json` configuration.
- The frontend will be served as a static site, and the backend will run as Serverless Functions in the `api/` directory.
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework Preset: `Vite`

## API Documentation

### POST `/api/predict`
Predicts the expected crop yield.
- **Body**: `{ state, crop, season, rainfall, temperature, area }`
- **Returns**: `{ expectedYield, confidence, timestamp, input }`

### GET `/api/model-metrics`
Returns evaluation metrics of the trained models.

### GET `/api/dataset-stats`
Returns statistics about the agricultural dataset.

### GET `/api/prediction-history`
Returns the last 10 predictions made by users.

## Database Schema (MySQL)
```sql
CREATE TABLE crop_yield_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    State_Name VARCHAR(100),
    District_Name VARCHAR(100),
    Crop VARCHAR(100),
    Season VARCHAR(50),
    Temperature FLOAT,
    Rainfall FLOAT,
    Area FLOAT,
    Production FLOAT,
    Yield FLOAT
);
```
