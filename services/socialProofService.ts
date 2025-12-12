
import { AnonymousScanData, SocialStats } from "../types";

// Configuration
// Using REST API avoids importing the heavy Firebase SDK
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'ecothreads-community';
const API_KEY = process.env.FIREBASE_API_KEY || ''; // Optional for public read, required for write if rules enforce it
const DATABASE_URL = `https://${PROJECT_ID}-default-rtdb.firebaseio.com`;

/**
 * Initializes connection check (Mock or Real)
 */
export const initializeFirebase = async (): Promise<boolean> => {
    if (!PROJECT_ID) {
        console.warn("Firebase Project ID missing. Social features will be simulated.");
        return false;
    }
    return true;
};

/**
 * Submits anonymous scan data to the community pool
 */
export const submitAnonymousScan = async (data: AnonymousScanData): Promise<void> => {
    try {
        // We push to a 'scans' collection
        const url = `${DATABASE_URL}/scans.json?auth=${API_KEY}`;
        
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
    } catch (error) {
        console.warn("Failed to submit social proof stats (Offline/Config Error):", error);
        // Fail silently - user experience shouldn't be blocked
    }
};

/**
 * Fetches aggregated global statistics
 * In a real app, this would likely query a Cloud Function or a specific aggregated node
 * to avoid downloading massive datasets. Here we simulate the aggregation or fetch a stats node.
 */
export const fetchGlobalStats = async (): Promise<SocialStats> => {
    try {
        // Attempt to fetch a pre-calculated stats node
        const url = `${DATABASE_URL}/stats.json?auth=${API_KEY}`;
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            if (data) return data;
        }
        throw new Error("No stats data found");

    } catch (error) {
        console.warn("Using simulated social stats due to fetch failure.");
        // Return Mock Data for Demo Purposes if DB is not set up
        return {
            globalScans: 12450 + Math.floor(Math.random() * 100),
            weeklyScans: 843,
            totalWaterSaved: 450000,
            totalCarbonAvoided: 12500,
            topSustainableBrand: { name: "Patagonia", avgScore: 92, scans: 150 },
            worstBrand: { name: "Shein", avgScore: 12, scans: 300 },
            trendingBrands: [
                { name: "Reformation", trend: 'up', scans: 45 },
                { name: "Zara", trend: 'down', scans: 200 }
            ]
        };
    }
};

/**
 * Fetches specific brand reputation stats from the community
 */
export const fetchBrandReputation = async (brandName: string): Promise<{ rating: number, count: number, trend: 'up'|'down'|'stable' } | null> => {
    // Mock logic for demo - in production would query DB
    if (!brandName) return null;
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));
    
    // Deterministic mock based on name length
    const mockRating = (brandName.length % 5) * 10 + 50; 
    
    return {
        rating: mockRating,
        count: brandName.length * 15 + 20,
        trend: brandName.length % 2 === 0 ? 'up' : 'down'
    };
};
