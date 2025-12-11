
import React from 'react';
import { X, History, Home, Leaf, ShieldCheck, LogOut } from 'lucide-react';
import { GamificationProfile, AppState } from '../types';
import { GamificationHub } from './GamificationHub';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (state: AppState) => void;
  profile: GamificationProfile;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onNavigate, profile }) => {
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
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-ink dark:bg-white rounded-lg flex items-center justify-center">
                  <Leaf size={16} className="text-white dark:text-ink" />
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
              Scan History
            </button>

            <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800">
               <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">About</div>
               <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white dark:hover:bg-stone-800 transition-all text-gray-500 dark:text-gray-400 font-medium text-left text-sm">
                  <ShieldCheck size={18} /> Privacy Policy
               </button>
            </div>
          </nav>
          
          <div className="p-6 border-t border-stone-200 dark:border-stone-800">
             <p className="text-xs text-center text-gray-400">v1.2.0 • Offline Ready</p>
          </div>
        </div>
      </div>
    </>
  );
};
