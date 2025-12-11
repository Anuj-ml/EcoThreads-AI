
import React, { useEffect, useState } from 'react';
import { HistoryItem } from '../types';
import { getHistory, clearHistory } from '../services/storageService';
import { ArrowLeft, Trash2, Calendar, ChevronRight, Wind, Droplets, Shirt, Tag, Clock } from 'lucide-react';

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

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-cream dark:bg-stone-900 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-cream/95 dark:bg-stone-900/95 backdrop-blur-sm p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center animate-fade-in-down">
        <button onClick={onBack} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <ArrowLeft className="text-ink dark:text-white" />
        </button>
        <h1 className="text-xl font-bold text-ink dark:text-white">Scan History</h1>
        <button onClick={handleClear} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full text-terracotta transition-colors">
            <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600 animate-fade-in">
            <Calendar size={48} className="mb-4 opacity-50" />
            <p>No scans yet.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="group bg-white dark:bg-stone-800 rounded-3xl p-3 shadow-sm border border-stone-100 dark:border-stone-700 flex gap-4 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Thumbnail with Score Overlay */}
              <div className="w-24 h-full min-h-[6rem] rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 relative">
                <img src={item.thumbnail} alt="Scan" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2 text-center">
                     <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-md ${item.result.overallScore > 70 ? 'bg-sage' : item.result.overallScore > 40 ? 'bg-yellow-500' : 'bg-terracotta'}`}>
                         Score: {item.result.overallScore}
                     </span>
                </div>
              </div>
              
              {/* Detailed Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center py-1 gap-1.5">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{formatDate(item.timestamp)}</span>
                    {(item.result.estimatedLifespan) && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock size={10} /> {item.result.estimatedLifespan} wears
                        </span>
                    )}
                </div>

                <h3 className="font-bold text-ink dark:text-white truncate text-base leading-tight">
                   {item.result.summary.split('.')[0] || "Unknown Item"}
                </h3>

                <div className="flex items-center gap-1.5">
                   <div className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center flex-shrink-0">
                       <Shirt size={10} className="text-stone-500 dark:text-stone-300" />
                   </div>
                   <span className="text-xs font-medium text-stone-600 dark:text-stone-300 truncate">
                        {item.result.mainMaterial}
                   </span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-900/20 px-1.5 py-0.5 rounded-md">
                        <Wind size={10} /> {item.result.carbonFootprint.value}
                    </div>
                </div>
              </div>

              <div className="flex items-center justify-center pr-1 text-gray-300 dark:text-gray-600 group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
