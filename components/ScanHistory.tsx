import React, { useEffect, useState } from 'react';
import { HistoryItem } from '../types';
import { getHistory, clearHistory } from '../services/storageService';
import { ArrowLeft, Trash2, Calendar, ChevronRight } from 'lucide-react';

interface ScanHistoryProps {
  onBack: () => void;
  onSelect: (item: HistoryItem) => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({ onBack, onSelect }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your scan history?")) {
      clearHistory();
      setItems([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cream dark:bg-stone-900 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-cream/95 dark:bg-stone-900/95 backdrop-blur-sm p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
        <button onClick={onBack} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full">
            <ArrowLeft className="text-ink dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-ink dark:text-white">Scan History</h1>
        <button onClick={handleClear} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-terracotta">
            <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600">
            <Calendar size={48} className="mb-4 opacity-50" />
            <p>No scans yet.</p>
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="bg-white dark:bg-stone-800 rounded-xl p-3 shadow-sm border border-stone-100 dark:border-stone-700 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-stone-700">
                <img src={item.thumbnail} alt="Scan" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                   <h3 className="font-bold text-ink dark:text-white truncate pr-2">
                     {item.result.summary.split('.')[0]}
                   </h3>
                   <span className="text-xs font-medium text-white bg-sage px-2 py-0.5 rounded-full">
                     {item.result.overallScore}
                   </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
              
              <ChevronRight className="text-gray-300 dark:text-gray-600" size={20} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};