import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import * as ss from "simple-statistics";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Prediction History
  let predictionHistory: any[] = [];

  // Mock Dataset for Stats
  const mockData = [
    { state: "Maharashtra", crop: "Rice", season: "Kharif", temperature: 28, rainfall: 1200, area: 500, yield: 2.5 },
    { state: "Maharashtra", crop: "Wheat", season: "Rabi", temperature: 22, rainfall: 400, area: 300, yield: 3.2 },
    { state: "Punjab", crop: "Rice", season: "Kharif", temperature: 30, rainfall: 800, area: 1000, yield: 4.1 },
    { state: "Punjab", crop: "Wheat", season: "Rabi", temperature: 18, rainfall: 200, area: 1200, yield: 4.8 },
    { state: "Karnataka", crop: "Maize", season: "Kharif", temperature: 26, rainfall: 1000, area: 400, yield: 3.5 },
    { state: "Karnataka", crop: "Sugarcane", season: "Whole Year", temperature: 29, rainfall: 1500, area: 600, yield: 70.2 },
    { state: "Tamil Nadu", crop: "Rice", season: "Kharif", temperature: 32, rainfall: 1100, area: 550, yield: 3.8 },
    { state: "Tamil Nadu", crop: "Groundnut", season: "Rabi", temperature: 27, rainfall: 500, area: 250, yield: 2.1 },
  ];

  // API Endpoints
  app.post("/api/predict", (req, res) => {
    const { state, crop, season, rainfall, temperature, area, soilPh } = req.body;

    // Simple heuristic-based prediction (simulating ML)
    // Yield = Base + (Rainfall * 0.001) + (Temp * 0.05) + (Area * 0.0001) + Random Noise
    let baseYield = 3.0;
    if (crop === "Sugarcane") baseYield = 65.0;
    if (crop === "Rice") baseYield = 3.5;
    
    // Impact of pH on yield (optimal 6.0 - 7.0)
    const phImpact = Math.max(0, 1 - Math.abs(soilPh - 6.5) * 0.1);
    
    const predictedYield = (baseYield + (rainfall * 0.0005) + (temperature * 0.02) + (area * 0.00001)) * phImpact + (Math.random() * 0.5);
    
    let recommendation = "";
    if (soilPh < 5.5) {
      recommendation = "Your soil is acidic. Recommend adding lime to neutralize soil and improve nutrient availability.";
    } else if (soilPh >= 5.5 && soilPh <= 7.5) {
      recommendation = "Your soil pH is optimal. This range is excellent for most crops and ensures maximum nutrient uptake.";
    } else {
      recommendation = "Your soil is alkaline. Recommend adding organic matter or sulfur to lower the pH and improve productivity.";
    }

    const result = {
      expectedYield: Number(predictedYield.toFixed(2)),
      confidence: 0.85 + (Math.random() * 0.1),
      timestamp: new Date().toISOString(),
      input: { state, crop, season, rainfall, temperature, area, soilPh },
      recommendation
    };

    predictionHistory.push(result);
    res.json(result);
  });

  app.get("/api/model-metrics", (req, res) => {
    res.json({
      r2: 0.92,
      mae: 0.15,
      rmse: 0.22,
      bestModel: "Random Forest Regression"
    });
  });

  app.get("/api/dataset-stats", (req, res) => {
    const totalRecords = mockData.length;
    const avgYield = mockData.reduce((acc, curr) => acc + curr.yield, 0) / totalRecords;
    
    const cropYields: Record<string, number[]> = {};
    mockData.forEach(d => {
      if (!cropYields[d.crop]) cropYields[d.crop] = [];
      cropYields[d.crop].push(d.yield);
    });

    const topCrops = Object.entries(cropYields).map(([crop, yields]) => ({
      crop,
      avgYield: Number((yields.reduce((a, b) => a + b, 0) / yields.length).toFixed(2))
    })).sort((a, b) => b.avgYield - a.avgYield);

    res.json({
      totalRecords: 12450, // Simulated larger dataset size
      avgYield: Number(avgYield.toFixed(2)),
      topCrops,
      seasonalTrends: [
        { season: "Kharif", avgYield: 3.2 },
        { season: "Rabi", avgYield: 3.8 },
        { season: "Whole Year", avgYield: 68.5 }
      ]
    });
  });

  app.get("/api/prediction-history", (req, res) => {
    res.json(predictionHistory.slice(-10).reverse());
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
