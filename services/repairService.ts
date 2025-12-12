
import { GoogleGenAI } from "@google/genai";
import { RepairLocation } from "../types";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = 2,
    delay = 1000
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithBackoff(fn, retries - 1, delay * 2);
    }
}

export const findRepairServices = async (lat: number, lng: number): Promise<RepairLocation[]> => {
    if (!ai) return [];

    return retryWithBackoff(async () => {
        try {
            const prompt = `
            Find 3 highly-rated clothing repair shops, tailors, or repair cafes near these coordinates: ${lat}, ${lng}.
            
            Strict Requirements:
            1. Use the Google Maps tool.
            2. Return ONLY a JSON array. No markdown.
            3. Fields required:
               - "name": Shop name
               - "address": Full address
               - "distance": Estimated distance (e.g. "0.5 miles")
               - "rating": Numeric rating (e.g. 4.8)
               - "phone": Phone number if available
               - "specialties": Array of keywords (e.g. ["Alterations", "Leather", "Denim"])
            `;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    tools: [{ googleMaps: {} }],
                    toolConfig: {
                        retrievalConfig: {
                            latLng: { latitude: lat, longitude: lng }
                        }
                    }
                }
            });

            const text = response.text || "[]";
            let locations: RepairLocation[] = [];

            try {
                const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
                locations = JSON.parse(jsonStr);
            } catch (e) {
                console.warn("Failed to parse repair locations JSON", e);
            }

            // Enrich with grounding metadata for valid URIs
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            
            locations = locations.map(loc => {
                let mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.address)}`;
                
                // Try to find exact Google Maps URI from grounding
                if (chunks) {
                    const match = chunks.find((c: any) => 
                        (c.maps?.title && (c.maps.title.includes(loc.name) || loc.name.includes(c.maps.title))) ||
                        (c.web?.title && (c.web.title.includes(loc.name) || loc.name.includes(c.web.title)))
                    );
                    if (match) {
                        mapsUrl = match.maps?.uri || match.web?.uri || mapsUrl;
                    }
                }

                return { ...loc, mapsUrl };
            });

            return locations;

        } catch (error) {
            console.error("Repair Service Error:", error);
            throw error;
        }
    });
};
