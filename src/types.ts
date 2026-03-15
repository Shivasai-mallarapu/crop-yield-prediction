export interface CropData {
  state: string;
  district: string;
  crop: string;
  season: string;
  temperature: number;
  rainfall: number;
  area: number;
  production: number;
  yield: number;
}

export interface PredictionInput {
  state: string;
  crop: string;
  season: string;
  rainfall: number;
  temperature: number;
  area: number;
  soilPh: number;
}

export interface PredictionResult {
  expectedYield: number;
  confidence: number;
  timestamp: string;
  input: PredictionInput;
  recommendation: string;
}

export interface ModelMetrics {
  r2: number;
  mae: number;
  rmse: number;
  bestModel: string;
}

export interface DatasetStats {
  totalRecords: number;
  avgYield: number;
  topCrops: { crop: string; avgYield: number }[];
  seasonalTrends: { season: string; avgYield: number }[];
}
