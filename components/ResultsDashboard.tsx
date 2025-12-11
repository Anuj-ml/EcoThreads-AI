
import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '../types';
import { getEnrichedAlternatives, AlternativeProduct } from '../data/knowledgeBase';
import { Share2, RotateCcw, Droplets, Wind, ExternalLink, Leaf, Shirt, Thermometer, Waves, Scissors, HeartHandshake } from 'lucide-react';
import { saveToHistory } from '../services/storageService';

interface ResultsDashboardProps {
  result: AnalysisResult;
  thumbnail: string;
  onReset: () => void;
  isHistoryView: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, thumbnail, onReset, isHistoryView }) => {
  const [enrichedAlternatives, setEnrichedAlternatives] = useState<AlternativeProduct[]>([]);
  const [activeTab, setActiveTab] = useState<'impact' | 'care'>('impact');

  useEffect(() => {
    // Save to history only if it's a fresh scan
    if (!isHistoryView) {
      saveToHistory(result, thumbnail);
    }

    // Enrich alternatives using the mock database based on keywords from Gemini
    const keyword = result.alternatives[0]?.imagePlaceholder || "default";
    setEnrichedAlternatives(getEnrichedAlternatives(keyword));
  }, [result, thumbnail, isHistoryView]);

  return (
    <div className="flex flex-col h-full bg-cream dark:bg-stone-900 overflow-y-auto animate-fade-in transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="relative h-64 w-full flex-shrink-0">
        <img src={thumbnail} alt="Analyzed Item" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div className="w-full">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">Eco Score</h2>
                        <div className={`text-5xl font-bold text-white flex items-baseline gap-2`}>
                            {result.overallScore}
                            <span className="text-lg font-normal opacity-70">/100</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex bg-white dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
            <button 
                onClick={() => setActiveTab('impact')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'impact' ? 'bg-ink dark:bg-stone-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-ink'}`}
            >
                Impact Analysis
            </button>
            <button 
                onClick={() => setActiveTab('care')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'care' ? 'bg-ink dark:bg-stone-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-ink'}`}
            >
                Care & Repair
            </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 p-6 space-y-8 pb-24">
        
        {activeTab === 'impact' ? (
            <>
                {/* Summary Card */}
                <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
                    <h3 className="font-bold text-ink dark:text-white mb-2 flex items-center gap-2">
                        <Leaf size={18} className="text-sage" /> Analysis Summary
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        {result.summary}
                    </p>
                    
                    {/* Certifications Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {result.certifications.map((cert, idx) => (
                            <span key={idx} className="px-3 py-1 bg-sage/10 text-sage text-xs font-bold rounded-full border border-sage/20">
                                {cert}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Impact Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                            <Droplets size={18} />
                            <span className="text-xs font-bold uppercase">Water</span>
                        </div>
                        <div className="text-xl font-bold text-ink dark:text-white">{result.waterUsage.saved}L</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.waterUsage.comparison}</div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                            <Wind size={18} />
                            <span className="text-xs font-bold uppercase">Carbon</span>
                        </div>
                        <div className="text-xl font-bold text-ink dark:text-white">{result.carbonFootprint.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.carbonFootprint.comparison}</div>
                    </div>
                </div>

                {/* Breakdown Bars */}
                <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
                     <h3 className="font-bold text-ink dark:text-white mb-4 text-sm">Impact Breakdown</h3>
                     <div className="space-y-4">
                        {Object.entries(result.breakdown).map(([key, value]) => (
                            <div key={key}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="capitalize text-gray-500 dark:text-gray-400">{key}</span>
                                    <span className="font-medium text-ink dark:text-white">{value}/100</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-stone-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${value > 70 ? 'bg-emerald-400' : value > 40 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                        style={{ width: `${value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Greener Alternatives */}
                <div>
                    <h3 className="font-bold text-ink dark:text-white mb-4 flex items-center justify-between">
                        <span>Greener Alternatives</span>
                        <span className="text-xs font-normal text-terracotta">Handpicked for you</span>
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                        {enrichedAlternatives.map((alt, idx) => (
                            <div key={idx} className="min-w-[220px] bg-white dark:bg-stone-800 rounded-xl shadow-sm border border-stone-100 dark:border-stone-700 overflow-hidden snap-center flex flex-col">
                                <div className="h-32 w-full bg-gray-200 relative">
                                    <img src={alt.image} alt={alt.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-sage backdrop-blur-sm">
                                        BETTER CHOICE
                                    </div>
                                </div>
                                <div className="p-3 flex flex-col flex-1">
                                    <h4 className="font-bold text-sm text-ink dark:text-white truncate">{alt.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{alt.brand}</p>
                                    
                                    <a 
                                        href={alt.url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="mt-auto w-full py-2 bg-ink dark:bg-white text-white dark:text-ink text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        Shop Now <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            /* Care Guide Tab */
            <div className="space-y-4 animate-slide-up">
                 {/* Main Care Card */}
                 <div className="bg-periwinkle/10 border border-periwinkle/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-periwinkle text-white rounded-lg">
                            <Shirt size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-ink dark:text-white">Smart Care Guide</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Extend the life of your garment</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <Waves className="text-periwinkle shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="font-bold text-sm text-ink dark:text-white">Washing</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{result.careGuide?.wash || "Wash cold on gentle cycle."}</p>
                            </div>
                        </div>
                         <div className="flex gap-4 items-start">
                            <Thermometer className="text-terracotta shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="font-bold text-sm text-ink dark:text-white">Drying</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{result.careGuide?.dry || "Air dry flat to save energy."}</p>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Repair Tip */}
                 <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700">
                    <h3 className="font-bold text-ink dark:text-white mb-3 flex items-center gap-2">
                        <Scissors size={18} className="text-terracotta" /> Repair & Maintenance
                    </h3>
                     <p className="text-sm text-gray-600 dark:text-gray-300 italic border-l-2 border-terracotta/30 pl-3">
                        "{result.careGuide?.repair || "Check buttons and seams regularly."}"
                    </p>
                 </div>

                 {/* Eco Tip */}
                 <div className="bg-sage/10 p-5 rounded-2xl border border-sage/20">
                     <h3 className="font-bold text-ink dark:text-white mb-2 flex items-center gap-2">
                        <HeartHandshake size={18} className="text-sage" /> Longevity Note
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {result.careGuide?.note || "Wearing this item 9 months longer reduces its carbon footprint by 30%."}
                    </p>
                 </div>
            </div>
        )}

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <button 
            onClick={onReset}
            className="pointer-events-auto bg-terracotta text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-terracotta/30 flex items-center gap-2 hover:scale-105 transition-transform"
        >
            <RotateCcw size={18} /> Scan Another
        </button>
      </div>
    </div>
  );
};
