import { AnalysisResult, HistoryItem } from "../types";

const HISTORY_KEY = 'ecothreads_scan_history';

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
