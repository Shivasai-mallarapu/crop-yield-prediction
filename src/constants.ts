export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const CROPS = [
  "Rice", "Wheat", "Maize", "Sugarcane", "Cotton", "Groundnut",
  "Jowar", "Bajra", "Pulses", "Potato", "Onion", "Tomato"
];

export const SEASONS = [
  "Kharif", "Rabi", "Summer", "Whole Year"
];

export const MODEL_ACCURACY_DATA = [
  { name: "Linear Regression", r2: 0.78, mae: 0.45, rmse: 0.55 },
  { name: "Decision Tree", r2: 0.85, mae: 0.32, rmse: 0.42 },
  { name: "Random Forest", r2: 0.92, mae: 0.15, rmse: 0.22 },
  { name: "Gradient Boosting", r2: 0.94, mae: 0.12, rmse: 0.18 }
];

export const FEATURE_IMPORTANCE = [
  { feature: "Area", importance: 0.45 },
  { feature: "Rainfall", importance: 0.25 },
  { feature: "Temperature", importance: 0.15 },
  { feature: "Crop Type", importance: 0.10 },
  { feature: "Season", importance: 0.05 }
];
