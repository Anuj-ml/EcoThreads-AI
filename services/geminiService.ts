
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, LocalAIResult, RecyclingResult, AlternativeProduct } from "../types";
import { MATERIALS_DB, BRANDS_DB } from "../data/knowledgeBase";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSustainability = async (
  base64Image: string,
  localAI: LocalAIResult
): Promise<AnalysisResult> => {
  
  // Serialize knowledge base for the model context
  const materialsContext = JSON.stringify(MATERIALS_DB);
  const brandsContext = JSON.stringify(BRANDS_DB);

  const prompt = `
    You are the "Ensemble Fusion" layer of EcoThreads AI, utilizing advanced computer vision capabilities.
    
    CONTEXT DATA:
    1. MATERIAL IMPACT DATABASE: ${materialsContext}
    2. BRAND ETHICS DATABASE: ${brandsContext}
    
    INPUT SIGNALS:
    1. Visual Classification (MobileNet): ${localAI.classification.join(', ')}
    2. OCR Text (Tesseract): "${localAI.ocrText}"

    TASK:
    Analyze the clothing item provided in the image to generate a strict, data-backed sustainability report.

    ADVANCED VISUAL ANALYSIS REQUIRED:
    1. **Brand Logo Recognition (CNN Simulation)**: 
       - Scan the image specifically for brand logos (e.g., Nike Swoosh, Patagonia skyline, Adidas stripes) or distinctive tags.
       - Identify the brand even if OCR fails, based on visual identity.
       - If a brand is found, use its specific data for the 'ethics' score.

    2. **High-Fidelity Material Detection (EfficientNet Simulation)**:
       - Analyze fabric texture at a granular level. Look for:
         - **Weave Patterns**: Twill (Denim), Jersey (Tees), Piqué (Polos).
         - **Sheen/Luster**: High sheen often indicates Silk or Synthetics (Polyester/Nylon). Matte often indicates Cotton/Wool.
         - **Pilling/Texture**: Fuzziness suggests Wool or Acrylic.
       - Use these visual cues to refine the 'mainMaterial' identification beyond just the OCR text.

    ANALYSIS LOGIC:
    1. **Material Identification**: 
       - Combine OCR text with Visual Texture analysis.
       - EXTRACT the "mainMaterial" string (e.g. "Recycled Polyester", "Organic Cotton Jersey").
    
    2. **Impact Calculation**:
       - Estimate Weight based on item type.
       - Carbon Formula: (Weight * Material_CO2_Factor) + 1.5kg.
       - Estimate Carbon Breakdown % (Material extraction vs Manufacturing vs Transport vs Use).

    3. **Scoring Algorithm (0-100)**:
       - 0-30: High Impact (Virgin Synthetics, Air Freight).
       - 31-60: Moderate (Conventional Cotton).
       - 61-85: Good (Recycled materials, Natural fibers).
       - 86-100: Excellent (Organic, Regenerative).

    OUTPUT REQUIREMENTS:
    - Return strict JSON.
    - **Summary**: Concise, objective, 2 sentences max. Mention the Brand if detected.
    - **Care Guide**: Short, actionable sentences.

    RESPONSE FORMAT:
    Follow the JSON schema strictly.
  `;

  try {
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
            mainMaterial: { type: Type.STRING, description: "The primary fabric detected, e.g., '100% Organic Cotton'" },
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
                        material: { type: Type.NUMBER, description: "Percentage attributed to raw material" },
                        manufacturing: { type: Type.NUMBER, description: "Percentage attributed to production" },
                        transport: { type: Type.NUMBER, description: "Percentage attributed to logistics" },
                        use: { type: Type.NUMBER, description: "Percentage attributed to consumer care" }
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
            estimatedLifespan: { type: Type.INTEGER, description: "Estimated number of wears before end of life" },
            careGuide: {
                type: Type.OBJECT,
                properties: {
                    wash: { type: Type.STRING, description: "Washing instructions (temp, cycle)" },
                    dry: { type: Type.STRING, description: "Drying instructions" },
                    repair: { type: Type.STRING, description: "Specific repair tip for this fabric" },
                    note: { type: Type.STRING, description: "One eco-tip for longevity" }
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

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Sustainability analysis failed. Please ensure image is clear and try again.");
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
      comparison: "Data unavailable offline"
    },
    certifications: ["Offline Mode - Pending Verification"],
    summary: `Offline Analysis: Detected potential ${foundMaterial.name}. Connect to internet for detailed report.`,
    estimatedLifespan: 30,
    careGuide: {
      wash: "Wash cold (General recommendation)",
      dry: "Air dry to save energy",
      repair: "Check seams regularly",
      note: "Offline mode: Standard care applies."
    },
    alternatives: [
      {
        name: "Check online for alternatives",
        brand: "System",
        score: 0,
        imagePlaceholder: "default",
        url: "#"
      }
    ]
  };
};

export const findRecyclingCenters = async (lat: number, lng: number): Promise<RecyclingResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find 3 closest textile recycling centers or clothing donation drop-off points near these coordinates: ${lat}, ${lng}. 
      For each location, provide a structured summary including:
      1. Name
      2. Address
      3. Operating Hours (approximate)
      4. Accepted Materials (e.g., clothes, shoes, rags)
      5. Contact Phone (if available)
      
      Return the response as clear text/markdown, do NOT use JSON.`,
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

    const text = response.text || "No results found.";
    
    // Extract grounding chunks for links
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

    return { text, places };
  } catch (error) {
    console.error("Recycling Locator Error:", error);
    throw new Error("Could not find recycling centers.");
  }
};

export const searchSustainableAlternatives = async (query: string): Promise<AlternativeProduct[]> => {
    try {
        const prompt = `
        Find 4 real, available sustainable fashion products matching "${query}".
        Focus on recognized sustainable brands (e.g., Patagonia, Reformation, Everlane, Organic Basics, Kotn).
        
        Return a valid JSON array of objects. Each object must have:
        - "name": Product Name
        - "brand": Brand Name
        - "price": Price (approx)
        - "sustainabilityFeature": Short reason why it's eco-friendly (max 5 words)
        - "url": URL to product page (must be a valid URL starting with http)
        - "image": A direct image URL for the product if you can find one, otherwise return "default".
        
        Strictly format the output as a JSON array only. No markdown ticks.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}]
            }
        });

        const text = response.text || "";
        
        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        let products: AlternativeProduct[] = [];
        try {
            products = JSON.parse(jsonStr);
        } catch (e) {
            console.warn("Failed to parse alternatives JSON", e);
            return [];
        }

        // Validate and clean up
        return products.map(p => ({
            ...p,
            image: (p.image && p.image.startsWith('http')) ? p.image : `https://source.unsplash.com/featured/?${encodeURIComponent(p.name + " " + p.brand)}`, // Unsplash fallback
        }));

    } catch (error) {
        console.error("Alternatives Search Error:", error);
        return [];
    }
};
