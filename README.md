# Crop Yield Prediction — Prototype

A crop-yield exploration project combining a React/Vite web interface, an Express API, simulated sample statistics, and a separate Python model-training experiment.

> **Important:** The current API uses heuristic formulas, random noise, and mock data. Its displayed confidence and model metrics are hard-coded/simulated; they are **not validated model performance** and should not be used for agricultural decisions. The Python training script also generates demonstration data when the real data connection is not enabled.

## Project Components

### Web application

- React + TypeScript + Vite interface
- Express server
- Crop, season, weather, area, and soil-pH input fields
- API endpoints for predictions, dataset summaries, and recent prediction history
- Gemini integration dependencies/configuration are present; configure a key only if the corresponding feature requires it

### Python experiment

`train_model.py` is a separate scikit-learn experiment that compares Linear Regression, Decision Tree, Random Forest, and Gradient Boosting regressors. It currently generates synthetic/demo records rather than loading a verified agricultural dataset, and its outputs should be interpreted accordingly.

## Technology Stack

- TypeScript, React, Vite, Express
- Python, pandas, NumPy, scikit-learn
- Optional Gemini API configuration for AI-powered features

## Run the Web App Locally

**Prerequisites:** Node.js and npm.

1. Clone this repository and open its directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. If you use a feature that calls Gemini, create a local `.env.local` file and add your own key:

   ```env
   GEMINI_API_KEY=your_key_here
   ```

   Never commit real API keys. The repository's `.env.example` is a template, not a place to store secrets.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed by the server (the server code currently listens on port 3000).

To check TypeScript types, run:

```bash
npm run lint
```

To create a production frontend build, run:

```bash
npm run build
```

## Run the Python Experiment

**Prerequisites:** Python and pip.

```bash
python -m venv .venv
```

Activate the environment, then install dependencies:

```bash
pip install -r requirements.txt
python train_model.py
```

The script compares candidate regressors using regression metrics and attempts to save the selected model artifacts. Confirm the output directory exists and inspect the generated metrics before relying on any result.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/predict` | Returns a heuristic-based yield estimate and soil-pH recommendation |
| GET | `/api/model-metrics` | Returns currently hard-coded demonstration metrics |
| GET | `/api/dataset-stats` | Returns summaries derived partly from mock data |
| GET | `/api/prediction-history` | Returns recent in-memory prediction history |

## Limitations and Roadmap

- Replace synthetic/mock data with a documented, licensed agricultural dataset.
- Connect the prediction API to a trained and versioned model rather than a heuristic formula.
- Remove random prediction noise and hard-coded metrics; compute metrics from a held-out test set.
- Add input validation, error handling, and unit tests.
- Document dataset provenance, units, target definition, and model evaluation.
- Add screenshots and a clear demonstration of the actual interface.
- Verify the production deployment configuration before publishing a live demo.

## Author

**Shiva Sai Goud Mallarapu**  
GitHub: [Shivasai-mallarapu](https://github.com/Shivasai-mallarapu)
