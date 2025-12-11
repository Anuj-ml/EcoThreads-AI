
import React, { useEffect, useState } from 'react';
import { HistoryItem } from '../types';
import { getHistory, clearHistory } from '../services/storageService';
import { ArrowLeft, Trash2, Calendar, ChevronRight, Wind, Droplets, Shirt } from 'lucide-react';

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
              className="bg-white dark:bg-stone-800 rounded-2xl p-4 shadow-sm border border-stone-100 dark:border-stone-700 flex gap-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-stone-700 border border-stone-200 dark:border-stone-600">
                <img src={item.thumbnail} alt="Scan" className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div className="flex justify-between items-start gap-2">
                   <div>
                       <h3 className="font-bold text-ink dark:text-white truncate text-base leading-tight">
                        {item.result.summary.split('.')[0]}
                       </h3>
                       {item.result.mainMaterial && (
                           <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mt-1">
                               <Shirt size={10} /> {item.result.mainMaterial}
                           </div>
                       )}
                   </div>
                   <div className="flex flex-col items-end gap-1">
                       <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${item.result.overallScore > 70 ? 'bg-sage' : item.result.overallScore > 40 ? 'bg-yellow-500' : 'bg-terracotta'}`}>
                         {item.result.overallScore}
                       </span>
                   </div>
                </div>
                
                <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-[10px] bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-md">
                        <Wind size={10} /> {item.result.carbonFootprint.value}
                    </div>
                    {item.result.waterUsage.saved > 0 && (
                        <div className="flex items-center gap-1 text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">
                            <Droplets size={10} /> {item.result.waterUsage.saved}L Saved
                        </div>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
