
export const MATERIALS_DB = [
  { 
      name: "Cotton (Conventional)", 
      carbonPerKg: 21.0, 
      waterPerKg: 10000, 
      score: 5, 
      biodegradability: "High (3-5 Months)",
      microplasticsPerWash: 0,
      microplasticsPerYear: 0
  },
  { 
      name: "Cotton (Organic)", 
      carbonPerKg: 3.8, 
      waterPerKg: 2400, 
      score: 9, 
      biodegradability: "High (3-5 Months)",
      microplasticsPerWash: 0,
      microplasticsPerYear: 0
  },
  { 
      name: "Polyester (Virgin)", 
      carbonPerKg: 9.5, 
      waterPerKg: 100, 
      score: 3, 
      biodegradability: "None (200+ Years)",
      microplasticsPerWash: 700000,
      microplasticsPerYear: 36400000 
  },
  { 
      name: "Polyester (Recycled)", 
      carbonPerKg: 3.5, 
      waterPerKg: 50, 
      score: 8, 
      biodegradability: "Low (200+ Years)",
      microplasticsPerWash: 700000,
      microplasticsPerYear: 36400000 
  },
  { 
      name: "Tencel/Lyocell", 
      carbonPerKg: 3.0, 
      waterPerKg: 150, 
      score: 9, 
      biodegradability: "High (6 Weeks)",
      microplasticsPerWash: 0,
      microplasticsPerYear: 0 
  },
  { 
      name: "Wool", 
      carbonPerKg: 13.0, 
      waterPerKg: 120, 
      score: 6, 
      biodegradability: "High (1-5 Years)",
      microplasticsPerWash: 0,
      microplasticsPerYear: 0 
  },
  { 
      name: "Denim", 
      carbonPerKg: 33.4, 
      waterPerKg: 3000, 
      score: 5, 
      biodegradability: "High (10-12 Months)",
      microplasticsPerWash: 0,
      microplasticsPerYear: 0 
  },
  { 
      name: "Nylon", 
      carbonPerKg: 15.0, 
      waterPerKg: 200, 
      score: 4, 
      biodegradability: "None (30-40 Years)",
      microplasticsPerWash: 140000,
      microplasticsPerYear: 7280000 
  }
];

export const BRANDS_DB: Record<string, { ethics: number; transparency: number; label: string; laborScore?: number; envScore?: number }> = {
  "PATAGONIA": { ethics: 95, transparency: 90, label: "Sustainability Leader", laborScore: 92, envScore: 96 },
  "H&M": { ethics: 50, transparency: 70, label: "Fast Fashion (Improving)", laborScore: 55, envScore: 60 },
  "SHEIN": { ethics: 10, transparency: 10, label: "Ultra Fast Fashion", laborScore: 15, envScore: 10 },
  "LEVI'S": { ethics: 70, transparency: 60, label: "Good", laborScore: 68, envScore: 75 },
  "ZARA": { ethics: 40, transparency: 50, label: "Fast Fashion", laborScore: 45, envScore: 40 },
  "REFORMATION": { ethics: 85, transparency: 80, label: "Eco-Conscious", laborScore: 82, envScore: 88 },
  "KOTN": { ethics: 92, transparency: 95, label: "Ethical Supply Chain", laborScore: 95, envScore: 90 },
  "EVERLANE": { ethics: 65, transparency: 75, label: "Radical Transparency", laborScore: 60, envScore: 70 }
};

export const PRODUCTS_DB: Record<string, any> = {
  "123456789": {
    name: "Classic Organic Tee",
    brand: "Patagonia",
    materials: "100% Organic Cotton",
    weightKg: 0.2,
    carbonFootprint: "0.8kg CO2e",
    overallScore: 92,
    summary: "A simplified example from the local database.",
    breakdown: { material: 95, ethics: 95, production: 90, longevity: 90, transparency: 90 },
    certifications: ["GOTS", "Fair Trade"],
    waterUsage: { saved: 500, comparison: "50 days of drinking water" },
    alternatives: []
  }
};

// Mock alternatives with high quality images and real links
export interface AlternativeProduct {
  name: string;
  brand: string;
  image: string;
  url: string;
}

export const MOCK_ALTERNATIVES: Record<string, AlternativeProduct[]> = {
  "shirt": [
    { name: "Organic Hemp Tee", brand: "Patagonia", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500", url: "https://www.patagonia.com/" },
    { name: "Recycled Cotton T-Shirt", brand: "For Days", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=500", url: "https://fordays.com/" }
  ],
  "pants": [
    { name: "Circular Denim", brand: "Mud Jeans", image: "https://images.unsplash.com/photo-1542272617-08f08630329e?auto=format&fit=crop&q=80&w=500", url: "https://mudjeans.eu/" },
    { name: "Hemp Trousers", brand: "Thought", image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&q=80&w=500", url: "https://www.wearethought.com/" }
  ],
  "jacket": [
    { name: "Recycled Down Jacket", brand: "Cotopaxi", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=500", url: "https://www.cotopaxi.com/" },
    { name: "Vintage Denim Jacket", brand: "Beyond Retro", image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=500", url: "https://www.beyondretro.com/" }
  ],
  "default": [
     { name: "Thrifted Find", brand: "Depop", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=500", url: "https://www.depop.com/" },
     { name: "Rental Piece", brand: "Rent the Runway", image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&q=80&w=500", url: "https://www.renttherunway.com/" }
  ]
};

export const getEnrichedAlternatives = (keyword: string) => {
    // Simple loose matching
    const key = Object.keys(MOCK_ALTERNATIVES).find(k => keyword.toLowerCase().includes(k)) || "default";
    return MOCK_ALTERNATIVES[key];
};
