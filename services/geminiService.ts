
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, LocalAIResult } from "../types";
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
    You are the "Ensemble Fusion" layer of EcoThreads AI, an expert sustainability auditor for fashion.
    
    CONTEXT DATA:
    1. MATERIAL IMPACT DATABASE: ${materialsContext}
    2. BRAND ETHICS DATABASE: ${brandsContext}
    
    INPUT SIGNALS:
    1. Visual Classification (MobileNet): ${localAI.classification.join(', ')}
    2. OCR Text (Tesseract): "${localAI.ocrText}"

    TASK:
    Analyze the clothing item provided in the image to generate a strict, data-backed sustainability report AND a care guide.

    ANALYSIS LOGIC:
    1. **Material Identification**: 
       - PRIORITIZE OCR text for specific percentages.
       - IF OCR is silent, INFER from visual texture (e.g., "Denim" -> Cotton).
    
    2. **Impact Calculation**:
       - Estimate Weight based on item type.
       - Carbon Formula: (Weight * Material_CO2_Factor) + 1.5kg.
       - Water Usage: Compare against global averages.

    3. **Scoring Algorithm (0-100)**:
       - 0-30: High Impact (Virgin Synthetics, Air Freight).
       - 31-60: Moderate (Conventional Cotton).
       - 61-85: Good (Recycled materials, Natural fibers).
       - 86-100: Excellent (Organic, Regenerative).

    4. **Smart Care Guide**:
       - Generate specific, eco-friendly washing instructions based on the inferred material (e.g., "Wash cold to reduce microplastics" for polyester).
       - Provide a repair tip (e.g., "Darn small holes immediately" for knits).

    OUTPUT REQUIREMENTS:
    - Return strict JSON.
    - **Summary**: Concise, objective, 2 sentences max.
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
                comparison: { type: Type.STRING }
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
