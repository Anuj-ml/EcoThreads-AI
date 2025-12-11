
import { AnalysisResult, HistoryItem, GamificationProfile } from "../types";

const HISTORY_KEY = 'ecothreads_scan_history';
const GAMIFICATION_KEY = 'ecothreads_user_profile';

// --- History ---

export const saveToHistory = (result: AnalysisResult, thumbnail: string): void => {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      result,
      thumbnail
    };
    
    // Keep only last 20 items
    const updatedHistory = [newItem, ...history].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history:", error);
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

// --- Gamification ---

const calculateLevel = (points: number): GamificationProfile['level'] => {
  if (points >= 1000) return 'Forest';
  if (points >= 500) return 'Tree';
  if (points >= 200) return 'Sapling';
  if (points >= 50) return 'Sprout';
  return 'Seed';
};

export const getGamificationProfile = (): GamificationProfile => {
  try {
    const stored = localStorage.getItem(GAMIFICATION_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  
  return { points: 0, level: 'Seed', badges: [], scansCompleted: 0 };
};

export const addPoints = (amount: number): { profile: GamificationProfile, leveledUp: boolean, newBadge: string | null } => {
  const profile = getGamificationProfile();
  const oldLevel = profile.level;
  
  profile.points += amount;
  profile.scansCompleted += 1;
  profile.level = calculateLevel(profile.points);

  let newBadge: string | null = null;
  const leveledUp = oldLevel !== profile.level;

  // Badge Logic
  if (profile.scansCompleted === 1 && !profile.badges.includes('First Scan')) {
    profile.badges.push('First Scan');
    newBadge = 'First Scan';
  }
  if (profile.scansCompleted === 5 && !profile.badges.includes('Eco Enthusiast')) {
    profile.badges.push('Eco Enthusiast');
    newBadge = 'Eco Enthusiast';
  }
  if (profile.level === 'Tree' && !profile.badges.includes('Carbon Neutralizer')) {
    profile.badges.push('Carbon Neutralizer');
    newBadge = 'Carbon Neutralizer';
  }

  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(profile));
  return { profile, leveledUp, newBadge };
};
