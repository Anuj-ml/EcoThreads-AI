
export interface AnalysisResult {
  overallScore: number; // 0-100
  mainMaterial: string; // e.g., "Organic Cotton"
  breakdown: {
    material: number;
    ethics: number;
    production: number;
    longevity: number;
    transparency: number;
  };
  carbonFootprint: {
    value: string;
    comparison: string; // e.g., "driving 6 miles"
    breakdown?: { // Percentage breakdown
        material: number;
        manufacturing: number;
        transport: number;
        use: number;
    };
  };
  waterUsage: {
    saved: number; // Liters
    comparison: string;
  };
  certifications: string[];
  alternatives: Array<{
    name: string;
    brand: string;
    score: number;
    imagePlaceholder: string; // "shirt", "pants" etc for mapping
    url?: string; // Link to product
  }>;
  summary: string;
  estimatedLifespan: number; // Estimated number of wears
  careGuide: {
    wash: string;
    dry: string;
    repair: string;
    note: string;
  };
}

export interface AlternativeProduct {
  name: string;
  brand: string;
  price: string;
  image: string;
  url: string;
  sustainabilityFeature: string;
}

export interface LocalAIResult {
  classification: string[];
  ocrText: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: AnalysisResult;
  thumbnail: string; // Base64 data URI
  userFeedback?: 'positive' | 'negative';
}

export interface GamificationProfile {
  points: number;
  level: 'Seed' | 'Sprout' | 'Sapling' | 'Tree' | 'Forest';
  badges: string[];
  scansCompleted: number;
}

export interface RecyclingResult {
  text: string;
  places: Array<{
    title: string;
    uri: string;
  }>;
}

export enum AppState {
  LANDING = 'LANDING',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  HISTORY = 'HISTORY'
}
