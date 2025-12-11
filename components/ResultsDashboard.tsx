import React, { useEffect, useState } from 'react';
import { AnalysisResult, RecyclingResult } from '../types';
import { getEnrichedAlternatives, AlternativeProduct } from '../data/knowledgeBase';
import { findRecyclingCenters } from '../services/geminiService';
import { 
  Share2, RotateCcw, Droplets, Wind, ExternalLink, Leaf, Shirt, 
  Thermometer, Waves, Scissors, HeartHandshake, Calculator, MapPin, 
  Loader2, ArrowRight, Star, Navigation
} from 'lucide-react';
import { saveToHistory, addPoints } from '../services/storageService';

interface ResultsDashboardProps {
  result: AnalysisResult;
  thumbnail: string;
  onReset: () => void;
  isHistoryView: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, thumbnail, onReset, isHistoryView }) => {
  const [enrichedAlternatives, setEnrichedAlternatives] = useState<AlternativeProduct[]>([]);
  const [activeTab, setActiveTab] = useState<'impact' | 'care' | 'value'>('impact');
  
  // CPW State
  const [price, setPrice] = useState<string>('');
  const [cpw, setCpw] = useState<number | null>(null);

  // Recycling State
  const [recyclingResult, setRecyclingResult] = useState<RecyclingResult | null>(null);
  const [loadingRecycling, setLoadingRecycling] = useState(false);
  const [recyclingError, setRecyclingError] = useState<string | null>(null);

  // Gamification State
  const [pointsToast, setPointsToast] = useState<{show: boolean, amount: number, label: string}>({ show: false, amount: 0, label: '' });

  useEffect(() => {
    if (!isHistoryView) {
      saveToHistory(result, thumbnail);
      triggerPointsToast(50, "Scan Complete");
    }
    const keyword = result.alternatives[0]?.imagePlaceholder || "default";
    setEnrichedAlternatives(getEnrichedAlternatives(keyword));
  }, [result, thumbnail, isHistoryView]);

  const triggerPointsToast = (amount: number, label: string) => {
    // Only add points if it's not a history view event re-triggering (handled by effect for initial scan)
    // For manual actions like clicking links, we call this directly.
    if (amount > 0) {
        addPoints(amount);
        setPointsToast({ show: true, amount, label });
        setTimeout(() => setPointsToast(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleAlternativeClick = () => {
    triggerPointsToast(20, "Eco-Choice Selected");
  };

  const calculateCPW = () => {
    if (!price || isNaN(parseFloat(price))) return;
    const p = parseFloat(price);
    const estimatedWears = result.estimatedLifespan || 30;
    setCpw(p / estimatedWears);
  };

  const handleLocateRecycling = () => {
    if (!navigator.geolocation) {
        setRecyclingError("Geolocation is not supported by your browser");
        return;
    }

    setLoadingRecycling(true);
    setRecyclingError(null);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const data = await findRecyclingCenters(position.coords.latitude, position.coords.longitude);
                setRecyclingResult(data);
            } catch (err) {
                setRecyclingError("Failed to find recycling centers. Try again later.");
            } finally {
                setLoadingRecycling(false);
            }
        },
        () => {
            setRecyclingError("Location permission denied. Please enable location services.");
            setLoadingRecycling(false);
        }
    );
  };

  // Helper for Score Ring
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((result.overallScore / 100) * circumference);
  const scoreColor = result.overallScore > 75 ? '#8A9A5B' : result.overallScore > 40 ? '#EAB308' : '#D95D39';

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-stone-950 overflow-y-auto animate-fade-in transition-colors duration-300 relative">
      
      {/* Gamification Toast */}
      {pointsToast.show && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
            <div className="bg-ink dark:bg-white text-white dark:text-ink px-6 py-3 rounded-full shadow-xl flex items-center gap-3 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-ink font-black text-xs">
                    +{pointsToast.amount}
                </div>
                <span className="font-bold text-sm">{pointsToast.label}</span>
            </div>
        </div>
      )}

      {/* Premium Hero Section */}
      <div className="relative h-80 w-full flex-shrink-0 bg-stone-900 rounded-b-[2.5rem] overflow-hidden shadow-2xl z-10">
        <img src={thumbnail} alt="Analyzed Item" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/40 to-stone-900/90" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 pb-10">
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-white uppercase border border-white/20">
                            Sustainability Report
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-1 leading-tight max-w-[200px] truncate">
                        {result.breakdown.material > 80 ? "Eco-Friendly Choice" : "Conventional Item"}
                    </h1>
                    <p className="text-stone-300 text-sm">{result.summary.split('.')[0]}.</p>
                </div>
                
                {/* Animated Score Ring */}
                <div className="relative w-24 h-24 flex items-center justify-center bg-stone-800/50 backdrop-blur-xl rounded-full border border-white/10 shadow-xl">
                    <svg className="transform -rotate-90 w-24 h-24">
                        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-stone-700" />
                        <circle 
                            cx="48" cy="48" r={radius} 
                            stroke={scoreColor} 
                            strokeWidth="6" 
                            fill="transparent" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={strokeDashoffset} 
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-bold text-white leading-none">{result.overallScore}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Floating Tab Bar */}
      <div className="px-6 -mt-6 z-20 relative">
        <div className="bg-white dark:bg-stone-800 p-1.5 rounded-2xl shadow-lg border border-stone-100 dark:border-stone-700 flex justify-between gap-1">
            {['impact', 'care', 'value'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        activeTab === tab 
                        ? 'bg-ink dark:bg-white text-white dark:text-ink shadow-md transform scale-105' 
                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-stone-700 dark:hover:text-white'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-6 pt-8 pb-32 space-y-8">
        
        {activeTab === 'impact' && (
            <div className="animate-slide-up space-y-8">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Droplets size={48} className="text-blue-500" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Water Saved</p>
                        <p className="text-2xl font-black text-ink dark:text-white mb-2">{result.waterUsage.saved}L</p>
                        <div className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-lg inline-block">
                            {result.waterUsage.comparison}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wind size={48} className="text-orange-500" />
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Carbon Print</p>
                        <p className="text-2xl font-black text-ink dark:text-white mb-2">{result.carbonFootprint.value}</p>
                        <div className="text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-lg inline-block">
                            {result.carbonFootprint.comparison}
                        </div>
                    </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800">
                    <h3 className="font-bold text-lg text-ink dark:text-white mb-6">Impact Analysis</h3>
                    <div className="space-y-5">
                        {Object.entries(result.breakdown).map(([key, value], i) => (
                            <div key={key} className="flex items-center gap-4">
                                <div className="w-24 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">{key}</div>
                                <div className="flex-1 h-3 bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${value > 70 ? 'bg-sage' : value > 40 ? 'bg-yellow-400' : 'bg-terracotta'}`}
                                        style={{ width: `${value}%`, transitionDelay: `${i * 100}ms` }}
                                    />
                                </div>
                                <div className="w-8 text-xs font-bold text-ink dark:text-white">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sustainable Alternatives */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-ink dark:text-white">Greener Choices</h3>
                        <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2 py-1 rounded-md">
                            Earn +20 pts
                        </span>
                    </div>
                    
                    <div className="flex gap-4 overflow-x-auto pb-6 snap-x scrollbar-hide -mx-6 px-6">
                        {enrichedAlternatives.map((alt, idx) => (
                            <div key={idx} className="min-w-[260px] snap-center bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm border border-stone-100 dark:border-stone-800 group hover:shadow-md transition-all">
                                <div className="h-40 relative overflow-hidden">
                                    <img 
                                        src={alt.image} 
                                        alt={alt.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-ink flex items-center gap-1">
                                        <Leaf size={10} className="text-sage" /> BETTER
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-ink dark:text-white mb-1">{alt.name}</h4>
                                    <p className="text-xs text-gray-500 mb-4">{alt.brand}</p>
                                    <a 
                                        href={alt.url} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        onClick={handleAlternativeClick}
                                        className="flex items-center justify-center w-full py-3 bg-stone-100 dark:bg-stone-800 hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-ink rounded-xl text-xs font-bold transition-all gap-2"
                                    >
                                        View Product <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'care' && (
            <div className="animate-slide-up space-y-6">
                 {/* Care Guide Hero */}
                 <div className="bg-periwinkle/20 dark:bg-periwinkle/10 rounded-3xl p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-periwinkle/30 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                    
                    <Shirt className="w-12 h-12 text-periwinkle mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ink dark:text-white mb-2">Smart Care Guide</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                        Specific instructions extracted for {result.breakdown.material > 60 ? 'Natural Fibers' : 'Synthetic Blend'}
                    </p>
                 </div>

                 {/* Instructions List */}
                 <div className="grid gap-4">
                    {[
                        { icon: Waves, title: "Washing", text: result.careGuide.wash, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                        { icon: Thermometer, title: "Drying", text: result.careGuide.dry, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
                        { icon: Scissors, title: "Repair", text: result.careGuide.repair, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
                        { icon: HeartHandshake, title: "Longevity", text: result.careGuide.note, color: "text-sage", bg: "bg-green-50 dark:bg-green-900/20" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                                <item.icon size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-ink dark:text-white mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.text}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        )}

        {activeTab === 'value' && (
             <div className="animate-slide-up space-y-8">
                {/* Cost Calculator */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-terracotta/10 rounded-xl text-terracotta">
                            <Calculator size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-ink dark:text-white">True Cost Calculator</h3>
                            <p className="text-xs text-gray-500">Price per wear estimator</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 mb-6">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-3.5 text-gray-400 font-bold">$</span>
                            <input 
                                type="number" 
                                placeholder="Enter Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-stone-800 border-none rounded-xl font-bold text-ink dark:text-white focus:ring-2 focus:ring-terracotta transition-all"
                            />
                        </div>
                        <button 
                            onClick={calculateCPW}
                            className="bg-ink dark:bg-white text-white dark:text-ink px-6 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform"
                        >
                            Calculate
                        </button>
                    </div>

                    {cpw !== null && (
                        <div className="bg-gradient-to-br from-terracotta to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="relative z-10 flex justify-between items-end">
                                <div>
                                    <p className="text-white/80 text-xs font-bold uppercase mb-1">True Cost / Wear</p>
                                    <p className="text-4xl font-black">${cpw.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/80 text-xs font-bold mb-1">Lifespan</p>
                                    <p className="text-xl font-bold">{result.estimatedLifespan} Wears</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Local Recycling Locator */}
                <div className="space-y-4">
                     <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold text-lg text-ink dark:text-white flex items-center gap-2">
                            <MapPin size={20} className="text-sage" /> Nearby Recycling
                        </h3>
                        {recyclingResult && (
                             <button 
                                onClick={handleLocateRecycling}
                                className="text-xs font-bold text-sage hover:text-sage/80"
                            >
                                Refresh
                            </button>
                        )}
                    </div>
                    
                    {!recyclingResult && !loadingRecycling && (
                        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 text-center border border-stone-100 dark:border-stone-800">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Navigation className="text-sage" size={32} />
                            </div>
                            <p className="text-gray-500 text-sm mb-6 max-w-[200px] mx-auto">
                                Use your location to find the nearest textile recycling drop-off points.
                            </p>
                            <button 
                                onClick={handleLocateRecycling}
                                className="bg-sage text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-sage/30 hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                            >
                                <MapPin size={18} /> Locate Centers
                            </button>
                        </div>
                    )}

                    {loadingRecycling && (
                        <div className="py-12 flex flex-col items-center justify-center bg-white dark:bg-stone-900 rounded-3xl">
                            <Loader2 className="animate-spin text-sage mb-3" size={32} />
                            <p className="text-sm font-bold text-gray-400">Scanning your area...</p>
                        </div>
                    )}

                    {recyclingError && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-2xl text-center text-sm font-bold">
                            {recyclingError}
                        </div>
                    )}

                    {recyclingResult && (
                        <div className="grid gap-3 animate-fade-in">
                            {recyclingResult.places.map((place, idx) => (
                                <a 
                                    key={idx} 
                                    href={place.uri} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center justify-between group hover:border-sage/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0 group-hover:bg-sage/10 group-hover:text-sage transition-colors">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-ink dark:text-white truncate text-sm">{place.title}</h4>
                                            <p className="text-xs text-gray-400 truncate">Tap for directions</p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-stone-800 flex items-center justify-center text-gray-400 group-hover:bg-sage group-hover:text-white transition-all">
                                        <ExternalLink size={14} />
                                    </div>
                                </a>
                            ))}
                            <div className="text-center mt-2">
                                <p className="text-xs text-gray-400">Powered by Google Maps Grounding</p>
                            </div>
                        </div>
                    )}
                </div>
             </div>
        )}

      </div>

      {/* Floating Reset Button */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <button 
            onClick={onReset}
            className="pointer-events-auto bg-ink dark:bg-white text-white dark:text-ink px-8 py-4 rounded-full font-bold text-sm shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
        >
            <RotateCcw size={18} /> Scan Another Item
        </button>
      </div>
    </div>
  );
};