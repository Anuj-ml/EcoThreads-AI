
import React, { useEffect, useState } from 'react';
import { X, History, Home, Leaf, ShieldCheck, ChevronRight, Clock } from 'lucide-react';
import { GamificationProfile, AppState, HistoryItem } from '../types';
import { GamificationHub } from './GamificationHub';
import { getHistory } from '../services/storageService';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (state: AppState) => void;
  onSelectHistory?: (item: HistoryItem) => void;
  profile: GamificationProfile;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onNavigate, onSelectHistory, profile }) => {
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);

  // Refresh history whenever menu opens
  useEffect(() => {
    if (isOpen) {
      const allHistory = getHistory();
      setRecentHistory(allHistory.slice(0, 3)); // Get top 3
    }
  }, [isOpen]);

  const handleHistoryClick = (item: HistoryItem) => {
    if (onSelectHistory) {
        onSelectHistory(item);
        onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-500 backdrop-blur-sm ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 bottom-0 w-80 bg-cream dark:bg-stone-950 shadow-2xl z-50 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 200 200" className="w-full h-full text-ink dark:text-white">
                      <path d="M100 185 V 35" stroke="currentColor" strokeWidth="20" strokeLinecap="round" />
                      <path d="M100 160 C 40 160, 20 100, 100 80" stroke="currentColor" strokeWidth="16" strokeLinecap="round" fill="none" />
                      <path d="M100 130 C 160 130, 180 70, 100 50" stroke="currentColor" strokeWidth="16" strokeLinecap="round" fill="none" />
                  </svg>
               </div>
               <span className="font-bold text-lg text-ink dark:text-white tracking-tight">EcoThreads</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-ink dark:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Profile Section */}
          <div className="p-6 bg-stone-50 dark:bg-stone-900/50">
             <GamificationHub profile={profile} compact={true} />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button 
              onClick={() => { onNavigate(AppState.LANDING); onClose(); }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-stone-800 transition-all text-ink dark:text-white font-bold text-left group"
            >
              <div className="p-2 bg-stone-200 dark:bg-stone-700 rounded-lg group-hover:bg-terracotta group-hover:text-white transition-colors">
                 <Home size={20} />
              </div>
              Home
            </button>
            
            <button 
              onClick={() => { onNavigate(AppState.HISTORY); onClose(); }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-stone-800 transition-all text-ink dark:text-white font-bold text-left group"
            >
              <div className="p-2 bg-stone-200 dark:bg-stone-700 rounded-lg group-hover:bg-periwinkle group-hover:text-ink transition-colors">
                <History size={20} />
              </div>
              Full Scan History
            </button>

            {/* Recent Scans Section */}
            {recentHistory.length > 0 && (
                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 animate-fade-in">
                    <div className="px-4 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Clock size={12} /> Recent Scans
                    </div>
                    <div className="space-y-2">
                        {recentHistory.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleHistoryClick(item)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-stone-800 transition-all group text-left"
                            >
                                <img src={item.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-200" />
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-bold text-ink dark:text-white truncate">
                                        {item.result.summary.split('.')[0] || "Unknown Item"}
                                    </div>
                                    <div className="text-[10px] text-gray-500 truncate">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-300 group-hover:text-terracotta" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800">
               <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">About</div>
               <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-stone-800 transition-all text-gray-500 dark:text-gray-400 font-medium text-left text-sm">
                  <ShieldCheck size={18} /> Privacy Policy
               </button>
            </div>
          </nav>
          
          <div className="p-6 border-t border-stone-200 dark:border-stone-800">
             <p className="text-xs text-center text-gray-400">v1.2.1 • Live Search Active</p>
          </div>
        </div>
      </div>
    </>
  );
};
