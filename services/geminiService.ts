
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, LocalAIResult, RecyclingResult, AlternativeProduct, RepairLocation } from "../types";
import { MATERIALS_DB, BRANDS_DB } from "../data/knowledgeBase";
import { queryOARFacilities } from "./oarService";
import { findRepairServices } from "./repairService";

// Initialize AI only if key exists to prevent immediate crash
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper for retrying failed requests
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries === 0) throw error;
    
    const errorMessage = (error.message || '').toLowerCase();
    const isRetryable = error.status >= 500 || 
                        errorMessage.includes('xhr') || 
                        errorMessage.includes('fetch') || 
                        errorMessage.includes('network') ||
                        errorMessage.includes('failed to fetch');

    if (!isRetryable) throw error;
    
    console.warn(`API Error (${error.status || 'Network'}). Retrying in ${delay}ms... attempts left: ${retries}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

// Microplastic Calculation Logic
const calculateMicroplastics = (materialName: string): AnalysisResult['microplasticImpact'] => {
    const mat = MATERIALS_DB.find(m => materialName.toLowerCase().includes(m.name.split(' ')[0].toLowerCase())) || MATERIALS_DB[0];
    
    const fibersPerWash = (mat as any).microplasticsPerWash || 0;
    const annualFibers = (mat as any).microplasticsPerYear || 0;
    
    let riskLevel: 'none' | 'low' | 'medium' | 'high' | 'severe' = 'none';
    if (annualFibers > 40000000) riskLevel = 'severe';
    else if (annualFibers > 20000000) riskLevel = 'high';
    else if (annualFibers > 5000000) riskLevel = 'medium';
    else if (annualFibers > 0) riskLevel = 'low';

    // Contextual Ocean Equivalent
    let oceanEquivalent = "Minimal impact.";
    if (annualFibers > 1000000) {
        const bottles = Math.round(annualFibers / 700000); // Rough approx
        oceanEquivalent = `Equivalent to dumping ${bottles} plastic bottles into the sea annually.`;
    }

    // Mitigation
    let mitigation = {
        recommendation: "Natural fibers shed no plastic.",
        reductionPotential: "100%",
        productLink: undefined
    };

    if (riskLevel !== 'none') {
        mitigation = {
            recommendation: "Use a washing bag (e.g., Guppyfriend) or install a microfiber filter.",
            reductionPotential: "Up to 86%",
            productLink: "https://guppyfriend.com/"
        };
    }

    return {
        fibersPerWash,
        annualFibers,
        oceanEquivalent,
        riskLevel,
        mitigation
    };
};

export const analyzeSustainability = async (
  base64Image: string,
  localAI: LocalAIResult
): Promise<AnalysisResult> => {
  
  // 1. FAIL-SAFE: Check for API Key. If missing, use Local Fallback.
  if (!ai || !apiKey) {
    console.warn("API_KEY not found. Using local heuristic analysis.");
    return analyzeSustainabilityLocal(localAI);
  }

  // Serialize knowledge base
  const materialsContext = JSON.stringify(MATERIALS_DB);
  const brandsContext = JSON.stringify(BRANDS_DB);

  const prompt = `
    You are the "Ensemble Fusion" layer of EcoThreads AI.
    
    CONTEXT:
    MATERIALS: ${materialsContext}
    BRANDS: ${brandsContext}
    
    INPUT:
    Visual: ${localAI.classification.join(', ')}
    OCR: "${localAI.ocrText}"

    TASK:
    Analyze the clothing item image. Generate a sustainability report with deep traceability and repairability.
    
    1. **Identify Material**: Combine OCR & Visuals. EXTRACT "mainMaterial".
    2. **Impact**: Estimate Carbon.
    3. **Score**: 0-100 based on material/ethics.
    4. **Supply Chain**: Estimate a PLAUSIBLE 3-step journey (Raw Fiber -> Processing -> Assembly).
    5. **Activism**: Write a Tweet and Email to the brand.
    6. **End of Life**: Landfill vs Recycling prediction.
    7. **Repair**: List common issues for this item type and detailed DIY repair steps.

    OUTPUT: Strict JSON.
  `;

  try {
    const result = await retryWithBackoff(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
              {
                  inlineData: {
                      mimeType: 'image/jpeg',
                      data: base64Image.split(',')[1] // Remove header
                  }
              },
              { text: prompt }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER },
              mainMaterial: { type: Type.STRING },
              breakdown: {
                type: Type.OBJECT,
                properties: {
                  material: { type: Type.NUMBER },
                  ethics: { type: Type.NUMBER },
                  production: { type: Type.NUMBER },
                  longevity: { type: Type.NUMBER },
                  transparency: { type: Type.NUMBER }
                }
              },
              carbonFootprint: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.STRING },
                  comparison: { type: Type.STRING },
                  breakdown: {
                      type: Type.OBJECT,
                      properties: {
                          material: { type: Type.NUMBER },
                          manufacturing: { type: Type.NUMBER },
                          transport: { type: Type.NUMBER },
                          use: { type: Type.NUMBER }
                      }
                  }
                }
              },
              waterUsage: {
                type: Type.OBJECT,
                properties: {
                  saved: { type: Type.NUMBER },
                  comparison: { type: Type.STRING }
                }
              },
              certifications: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              summary: { type: Type.STRING },
              estimatedLifespan: { type: Type.INTEGER },
              careGuide: {
                  type: Type.OBJECT,
                  properties: {
                      wash: { type: Type.STRING },
                      dry: { type: Type.STRING },
                      repair: { type: Type.STRING },
                      note: { type: Type.STRING }
                  }
              },
              supplyChain: {
                  type: Type.OBJECT,
                  properties: {
                      totalMiles: { type: Type.NUMBER },
                      steps: {
                          type: Type.ARRAY,
                          items: {
                              type: Type.OBJECT,
                              properties: {
                                  stage: { type: Type.STRING },
                                  location: { type: Type.STRING },
                                  description: { type: Type.STRING }
                              }
                          }
                      }
                  }
              },
              activism: {
                  type: Type.OBJECT,
                  properties: {
                      brandTwitter: { type: Type.STRING },
                      tweetContent: { type: Type.STRING },
                      emailSubject: { type: Type.STRING },
                      emailBody: { type: Type.STRING }
                  }
              },
              endOfLife: {
                  type: Type.OBJECT,
                  properties: {
                      landfill: { type: Type.STRING },
                      recycling: { type: Type.STRING }
                  }
              },
              repairInfo: {
                  type: Type.OBJECT,
                  properties: {
                      commonIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                      repairGuide: {
                          type: Type.OBJECT,
                          properties: {
                              diy: { type: Type.STRING },
                              tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Professional'] }
                          }
                      }
                  }
              },
              alternatives: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          name: { type: Type.STRING },
                          brand: { type: Type.STRING },
                          score: { type: Type.NUMBER },
                          imagePlaceholder: { type: Type.STRING },
                          url: { type: Type.STRING }
                      }
                  }
              }
            }
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response generated from AI model.");
      return JSON.parse(text) as AnalysisResult;
    });

    // --- Post-Processing Enhancements ---

    // 1. Calculate Microplastics (Deterministic)
    result.microplasticImpact = calculateMicroplastics(result.mainMaterial);

    // 2. Open Apparel Registry (OAR) Check
    // Extract Brand Name heuristic
    const brandName = result.summary.split(' ').find(w => BRANDS_DB[w.toUpperCase()]) || 
                      Object.keys(BRANDS_DB).find(b => result.summary.toUpperCase().includes(b)) ||
                      "";
    
    if (brandName) {
        const oarData = await queryOARFacilities(brandName);
        if (oarData) {
            // Merge verified steps with estimated miles (or calculate miles if coords exist)
            result.supplyChain = {
                ...result.supplyChain,
                ...oarData,
                totalMiles: result.supplyChain.totalMiles // Keep estimated miles if verification doesn't provide route
            };
        } else {
            result.supplyChain.source = 'estimated';
        }
    } else {
        result.supplyChain.source = 'estimated';
    }

    return result;

  } catch (error) {
    console.error("Gemini Analysis Failed. Falling back to local engine:", error);
    const localResult = analyzeSustainabilityLocal(localAI);
    localResult.summary += " (Note: AI service unavailable, using local estimation)";
    return localResult;
  }
};

/**
 * Offline Fallback Analysis
 */
export const analyzeSustainabilityLocal = (localAI: LocalAIResult): AnalysisResult => {
  const combinedText = (localAI.classification.join(' ') + ' ' + localAI.ocrText).toLowerCase();
  let foundMaterial = MATERIALS_DB.find(m => combinedText.includes(m.name.toLowerCase().split(' ')[0]));
  if (!foundMaterial) foundMaterial = MATERIALS_DB[0]; 

  const brandName = Object.keys(BRANDS_DB).find(b => combinedText.includes(b.toLowerCase()));
  const brandData = brandName ? BRANDS_DB[brandName] : { ethics: 50, transparency: 50 };

  const score = Math.round(
    (foundMaterial.score * 10 * 0.5) + 
    (brandData.ethics * 0.3) + 
    (brandData.transparency * 0.2)
  );

  return {
    overallScore: score,
    mainMaterial: foundMaterial.name,
    breakdown: {
      material: foundMaterial.score * 10,
      ethics: brandData.ethics,
      production: 50,
      longevity: 60,
      transparency: brandData.transparency
    },
    carbonFootprint: {
      value: `${foundMaterial.carbonPerKg}kg CO2e`,
      comparison: "Estimated offline",
      breakdown: { material: 50, manufacturing: 30, transport: 10, use: 10 }
    },
    waterUsage: { saved: 0, comparison: "Data unavailable" },
    certifications: ["Mode: Offline/Local"],
    summary: `Local Estimation: Likely ${foundMaterial.name} based on visual scan.`,
    estimatedLifespan: 30,
    careGuide: { wash: "Wash cold", dry: "Air dry", repair: "Check seams", note: "Standard care." },
    alternatives: [],
    supplyChain: {
        source: 'estimated',
        totalMiles: 8500,
        steps: [
            { stage: "Material", location: "Unknown Origin", description: "Likely sourced from global commodity markets." },
            { stage: "Manufacturing", location: "Global South", description: "Standard assembly hub." },
            { stage: "Retail", location: "Local", description: "Transported to your location." }
        ]
    },
    activism: {
        brandTwitter: "@FashionBrand",
        tweetContent: `Hey @FashionBrand, I want more transparency on your supply chain. #EcoThreads`,
        emailSubject: "Inquiry about sustainability",
        emailBody: "To whom it may concern, I recently purchased an item and would like to know more about its origins."
    },
    endOfLife: {
        landfill: "Persists for decades.",
        recycling: "Potential for mechanical recycling."
    },
    microplasticImpact: calculateMicroplastics(foundMaterial.name),
    repairInfo: {
        commonIssues: ["Loose threads", "Fading"],
        repairGuide: {
            diy: "Basic stitch repair.",
            tools: ["Needle", "Thread"],
            difficulty: "Easy"
        }
    }
  };
};

export const findRecyclingCenters = async (lat: number, lng: number): Promise<RecyclingResult> => {
  if (!ai) throw new Error("AI Service not configured");
  
  return retryWithBackoff(async () => {
      const prompt = `
        Find 3 closest textile recycling centers or clothing donation drop-off points near these coordinates: ${lat}, ${lng}. 
        Requirements: Use Google Maps tool. Return strictly JSON array.
        JSON Object: { "name": "", "address": "", "info": "" }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{googleMaps: {}}],
          toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
        },
      });

      const text = response.text || "[]";
      let locations = [];
      try {
          const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
          locations = JSON.parse(jsonStr);
      } catch (e) { console.warn(e); }
      
      const places: Array<{title: string, uri: string}> = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) places.push({ title: chunk.web.title, uri: chunk.web.uri });
          else if (chunk.maps?.uri && chunk.maps?.title) places.push({ title: chunk.maps.title, uri: chunk.maps.uri });
        });
      }
      return { locations, places };
  });
};

export const searchSustainableAlternatives = async (query: string): Promise<AlternativeProduct[]> => {
    if (!ai) return [];
    return retryWithBackoff(async () => {
            const prompt = `
            Task: Find 4 real, available sustainable fashion products matching "${query}". 
            Use Google Search tool. Return ONLY raw JSON array.
            Format: { "name": "", "brand": "", "price": "", "sustainabilityFeature": "", "url": "" }
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { tools: [{googleSearch: {}}] }
            });

            let products: AlternativeProduct[] = [];
            const text = response.text || "";
            try {
                const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                products = JSON.parse(jsonStr);
            } catch (e) { console.warn(e); }

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            const validLinks = groundingChunks.map((c: any) => c.web).filter((web: any) => web && web.uri && web.title);

            if (products.length === 0 && validLinks.length > 0) {
                return validLinks.slice(0, 4).map((link: any) => ({
                    name: link.title,
                    brand: "Verified Source",
                    price: "Check Site",
                    sustainabilityFeature: "Eco-Friendly Option",
                    url: link.uri,
                    image: `https://source.unsplash.com/featured/?fashion,sustainable,${encodeURIComponent(query.split(' ')[0])}`
                }));
            }
            return products.map((p, index) => {
                let finalUrl = p.url;
                if ((!p.url || p.url.includes('example.com') || p.url === '#') && validLinks[index]) {
                    finalUrl = validLinks[index].uri;
                }
                return {
                    ...p,
                    url: finalUrl,
                    image: (p.image && p.image.startsWith('http')) ? p.image : `https://source.unsplash.com/featured/?clothing,${encodeURIComponent(p.name)}`
                };
            });
    });
};

export { findRepairServices };
