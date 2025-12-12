
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, LocalAIResult, RecyclingResult, AlternativeProduct } from "../types";
import { MATERIALS_DB, BRANDS_DB } from "../data/knowledgeBase";

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

export const analyzeSustainability = async (
  base64Image: string,
  localAI: LocalAIResult
): Promise<AnalysisResult> => {
  
  // 1. FAIL-SAFE: Check for API Key. If missing, use Local Fallback immediately.
  if (!ai || !apiKey) {
    console.warn("API_KEY not found. Using local heuristic analysis.");
    return analyzeSustainabilityLocal(localAI);
  }

  // Serialize knowledge base for the model context
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
    Analyze the clothing item image. Generate a sustainability report.
    
    1. **Identify Material**: Combine OCR & Visuals. EXTRACT "mainMaterial".
    2. **Impact**: Estimate Carbon (Weight * Factor + 1.5kg).
    3. **Score (0-100)**: 0-30 Bad, 31-60 Mod, 61-85 Good, 86+ Excel.

    OUTPUT: Strict JSON.
  `;

  try {
    return await retryWithBackoff(async () => {
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

  } catch (error) {
    // 2. FAIL-SAFE: If API call fails (Quota, Network, 500), Fallback to Local.
    // This ensures the user ALWAYS sees the results dashboard.
    console.error("Gemini Analysis Failed. Falling back to local engine:", error);
    const localResult = analyzeSustainabilityLocal(localAI);
    // Append a note to summary so user knows it might be less accurate
    localResult.summary += " (Note: AI service unavailable, using local estimation)";
    return localResult;
  }
};

/**
 * Offline Fallback Analysis
 * Uses local heuristic logic to estimate sustainability when Gemini is unreachable.
 */
export const analyzeSustainabilityLocal = (localAI: LocalAIResult): AnalysisResult => {
  const combinedText = (localAI.classification.join(' ') + ' ' + localAI.ocrText).toLowerCase();
  
  // 1. Detect Material
  let foundMaterial = MATERIALS_DB.find(m => combinedText.includes(m.name.toLowerCase().split(' ')[0]));
  if (!foundMaterial) foundMaterial = MATERIALS_DB[0]; // Default to conventional cotton if unknown

  // 2. Detect Brand
  const brandName = Object.keys(BRANDS_DB).find(b => combinedText.includes(b.toLowerCase()));
  const brandData = brandName ? BRANDS_DB[brandName] : { ethics: 50, transparency: 50 };

  // 3. Calculate Score (Simple weighted average)
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
      breakdown: {
          material: 50,
          manufacturing: 30,
          transport: 10,
          use: 10
      }
    },
    waterUsage: {
      saved: 0,
      comparison: "Data unavailable"
    },
    certifications: ["Mode: Offline/Local"],
    summary: `Local Estimation: Likely ${foundMaterial.name} based on visual scan.`,
    estimatedLifespan: 30,
    careGuide: {
      wash: "Wash cold",
      dry: "Air dry",
      repair: "Check seams",
      note: "Standard care applies."
    },
    alternatives: []
  };
};

export const findRecyclingCenters = async (lat: number, lng: number): Promise<RecyclingResult> => {
  if (!ai) throw new Error("AI Service not configured");
  
  return retryWithBackoff(async () => {
    try {
      const prompt = `
        Find 3 closest textile recycling centers or clothing donation drop-off points near these coordinates: ${lat}, ${lng}. 
        
        Requirements:
        1. Use the Google Maps tool to find real locations.
        2. Return the response strictly as a JSON array of objects.
        3. Do NOT wrap the JSON in markdown code blocks.
        
        JSON Object Structure:
        {
          "name": "Name of the center",
          "address": "Full Address",
          "info": "Brief info about hours and what they accept (e.g. 'Open 9-5, Accepts clothes & shoes')"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          tools: [{googleMaps: {}}],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: lat,
                longitude: lng
              }
            }
          }
        },
      });

      const text = response.text || "[]";
      let locations = [];
      try {
          const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
          locations = JSON.parse(jsonStr);
      } catch (e) {
          console.warn("Failed to parse locations JSON", e);
      }
      
      const places: Array<{title: string, uri: string}> = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) {
              places.push({ title: chunk.web.title, uri: chunk.web.uri });
          } else if (chunk.maps?.uri && chunk.maps?.title) {
              places.push({ title: chunk.maps.title, uri: chunk.maps.uri });
          }
        });
      }

      return { locations, places };
    } catch (error) {
      console.error("Recycling Locator Error:", error);
      throw error;
    }
  });
};

export const searchSustainableAlternatives = async (query: string): Promise<AlternativeProduct[]> => {
    if (!ai) return [];

    return retryWithBackoff(async () => {
        try {
            const prompt = `
            Task: Find 4 real, available sustainable fashion products matching "${query}". 
            Use the Google Search tool to find actual product pages.
            
            Strict Requirements:
            1. "name": The exact product name from the search result.
            2. "brand": The brand name.
            3. "price": Approximate price if visible (e.g. "$45"), otherwise estimate based on brand.
            4. "sustainabilityFeature": Short reason why it's eco-friendly (max 5 words).
            5. "url": You MUST provide the direct URL to the product page found in the search results.
            
            Output format:
            Return ONLY a raw JSON array of objects. Do not wrap in markdown code blocks.
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{googleSearch: {}}]
                }
            });

            let products: AlternativeProduct[] = [];
            const text = response.text || "";
            
            try {
                const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                products = JSON.parse(jsonStr);
            } catch (e) {
                console.warn("Model did not return valid JSON. Falling back to Grounding Chunks.", e);
            }

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            const validLinks = groundingChunks
                .map((c: any) => c.web)
                .filter((web: any) => web && web.uri && web.title);

            if (products.length === 0 && validLinks.length > 0) {
                console.log("Using Grounding Chunks for products");
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

        } catch (error) {
            console.error("Alternatives Search Error:", error);
            throw error;
        }
    });
};
