
interface OARFacility {
    id: string;
    properties: {
        name: string;
        address: string;
        country_name: string;
        sector: string[];
    };
    geometry: {
        coordinates: [number, number]; // lng, lat
    };
}

// Fallback logic for retry
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

export const queryOARFacilities = async (brandName: string): Promise<any> => {
    // Note: Open Supply Hub API typically requires authentication.
    // If the user has provided an optional OAR_API_KEY, we use it. 
    // Otherwise, we perform a public search query or return null to gracefully degrade.
    
    // In a real production environment, you would proxy this through your backend to keep keys safe.
    // The endpoint logic below follows the requested structure.
    
    if (!brandName) return null;

    const apiKey = process.env.OAR_API_KEY;
    // URL pattern based on legacy OAR, now Open Supply Hub
    // Using a broad search endpoint for contributors/brand association
    const url = `https://openapparel.org/api/v1/facilities/?contributors=${encodeURIComponent(brandName)}`;

    try {
        const fetchFacilities = async () => {
             const headers: Record<string, string> = {
                'Content-Type': 'application/json'
             };
             
             if (apiKey) {
                 headers['Authorization'] = `Token ${apiKey}`;
             }

             const response = await fetch(url, { headers });
             
             if (!response.ok) {
                 if (response.status === 401 && !apiKey) {
                     console.warn("OAR API requires key. Skipping verification.");
                     return null;
                 }
                 throw new Error(`OAR API Error: ${response.status}`);
             }
             
             return await response.json();
        };

        const data = await retryWithBackoff(fetchFacilities);
        
        if (data && data.features && data.features.length > 0) {
            // Transform the first few facilities into our supply chain step format
            // We select a representative sample to show verification capability
            const facilities: OARFacility[] = data.features.slice(0, 3);
            
            return {
                source: 'verified',
                oarAttribution: "Verified by Open Supply Hub (OAR)",
                totalMiles: 0, // Will need to be recalculated or combined with estimated
                steps: facilities.map(f => ({
                    stage: "Manufacturing",
                    facilityName: f.properties.name,
                    location: `${f.properties.address}, ${f.properties.country_name}`,
                    coordinates: {
                        lat: f.geometry.coordinates[1],
                        lng: f.geometry.coordinates[0]
                    },
                    description: `Registered facility contributing to ${brandName}. Sector: ${f.properties.sector.join(', ') || 'Apparel'}`
                }))
            };
        }

        return null;
    } catch (error) {
        console.warn("OAR Service lookup failed:", error);
        return null; // Fallback to estimated data
    }
};
