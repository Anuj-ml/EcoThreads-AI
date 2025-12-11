
export interface AnalysisResult {
  overallScore: number; // 0-100
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
  careGuide: {
    wash: string;
    dry: string;
    repair: string;
    note: string;
  };
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
}

export enum AppState {
  LANDING = 'LANDING',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  HISTORY = 'HISTORY'
}
