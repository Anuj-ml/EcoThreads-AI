
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
    realWorldImpact?: { // New dynamic field
        smartphones: number; // charges
        milesDriven: number; // miles
        kettlesBoiled: number; // count
        ledHours: number; // hours
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
  // UPDATED: Supply Chain Traceability with OAR
  supplyChain: {
    source: 'verified' | 'estimated'; // New field
    oarAttribution?: string; // New field
    totalMiles: number;
    steps: Array<{
        stage: string; // e.g. "Raw Fiber", "Spinning", "Assembly"
        facilityName?: string; // New field for verified facilities
        location: string; // e.g. "Gujarat, India"
        coordinates?: { lat: number; lng: number }; // New field
        certifications?: string[]; // New field
        description: string;
    }>;
  };
  // NEW: Microplastic Pollution
  microplasticImpact?: {
    fibersPerWash: number;
    annualFibers: number;
    oceanEquivalent: string;
    riskLevel: 'none' | 'low' | 'medium' | 'high' | 'severe';
    mitigation: {
        recommendation: string;
        reductionPotential: string;
        productLink?: string;
    };
  };
  // NEW: Repair Information
  repairInfo?: {
    commonIssues: string[];
    repairGuide: {
        diy: string;
        tools: string[];
        difficulty: 'Easy' | 'Medium' | 'Professional';
    };
    localServices?: RepairLocation[];
  };
  // NEW: Direct Activism
  activism: {
    brandTwitter?: string;
    tweetContent: string;
    emailSubject: string;
    emailBody: string;
  };
  // NEW: End of Life Projection
  endOfLife: {
    landfill: string; // e.g., "200+ years to decompose, releasing methane."
    recycling: string; // e.g., "Can be mechanically shredded into insulation."
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

export interface RecyclingLocation {
  name: string;
  address: string;
  info: string;
  uri?: string;
}

export interface RepairLocation {
  name: string;
  address: string;
  distance: string;
  rating?: number;
  specialties?: string[];
  phone?: string;
  mapsUrl: string;
}

export interface RecyclingResult {
  locations: RecyclingLocation[];
  places: Array<{
    title: string;
    uri: string;
  }>;
}

export interface AnonymousScanData {
    timestamp: number;
    brand: string;
    scoreRounded: number;
    material: string;
    regionHash: string; // Simplified region identifier
}

export interface SocialStats {
    globalScans: number;
    weeklyScans: number;
    totalWaterSaved: number;
    totalCarbonAvoided: number;
    topSustainableBrand: { name: string; avgScore: number; scans: number };
    worstBrand: { name: string; avgScore: number; scans: number };
    trendingBrands: Array<{ name: string; trend: 'up' | 'down'; scans: number }>;
}

export enum AppState {
  LANDING = 'LANDING',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  HISTORY = 'HISTORY'
}