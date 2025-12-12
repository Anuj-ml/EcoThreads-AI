
import React, { useEffect, useState } from 'react';
import { AnalysisResult, RecyclingResult, AlternativeProduct } from '../types';
import { findRecyclingCenters, searchSustainableAlternatives } from '../services/geminiService';
import { MATERIALS_DB, BRANDS_DB } from '../data/knowledgeBase';
import { 
  Share2, RotateCcw, Droplets, Wind, ExternalLink, Leaf, Shirt, 
  Thermometer, Waves, Scissors, HeartHandshake, Calculator, MapPin, 
  Loader2, ArrowRight, Star, Navigation, Zap, Car, Coffee, Smartphone,
  ShoppingBag, ThumbsUp, ThumbsDown, Sprout, Factory, Scale, Award, Check
} from 'lucide-react';
import { saveToHistory, addPoints } from '../services/storageService';

interface ResultsDashboardProps {
  result: AnalysisResult;
  thumbnail: string;
  onReset: () => void;
  isHistoryView: boolean;
  onOpenMenu: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, thumbnail, onReset, isHistoryView, onOpenMenu }) => {
  const [alternatives, setAlternatives] = useState<AlternativeProduct[]>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'impact' | 'care' | 'value'>('impact');
  
  // CPW State
  const [price, setPrice] = useState<string>('');
  const [lifespan, setLifespan] = useState<number>(30);
  const [cpw, setCpw] = useState<number | null>(null);

  // Recycling State
  const [recyclingResult, setRecyclingResult] = useState<RecyclingResult | null>(null);
  const [loadingRecycling, setLoadingRecycling] = useState(false);
  const [recyclingError, setRecyclingError] = useState<string | null>(null);

  // Gamification State
  const [pointsToast, setPointsToast] = useState<{show: boolean, amount: number, label: string}>({ show: false, amount: 0, label: '' });

  // Feedback State
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  
  // Knowledge Base Lookups
  const [materialInfo, setMaterialInfo] = useState<any>(null);
  const [brandInfo, setBrandInfo] = useState<any>(null);

  useEffect(() => {
    if (!isHistoryView) {
      saveToHistory(result, thumbnail);
      triggerPointsToast(50, "Scan Complete");
    }

    // Initialize lifespan from result
    if (result.estimatedLifespan) {
        setLifespan(result.estimatedLifespan);
    }
    
    // Identify Material Context
    const matchedMaterial = MATERIALS_DB.find(m => 
      result.mainMaterial.toLowerCase().includes(m.name.split(' ')[0].toLowerCase())
    );
    setMaterialInfo(matchedMaterial);

    // Identify Brand Context
    const matchedBrandKey = Object.keys(BRANDS_DB).find(b => result.summary.toUpperCase().includes(b));
    if (matchedBrandKey) {
        setBrandInfo({ name: matchedBrandKey, ...BRANDS_DB[matchedBrandKey] });
    }

    // Fetch Alternatives dynamically with enhanced query
    const fetchAlternatives = async () => {
        setLoadingAlternatives(true);
        try {
             // Heuristic to build a better search query
             
             // 1. Extract base term from summary (first sentence/clause)
             let summaryTerm = result.summary.split('.')[0].replace(/[^\w\s]/gi, ''); 
             
             // 2. Remove detected brand to find broad alternatives
             if (matchedBrandKey) {
                summaryTerm = summaryTerm.replace(new RegExp(matchedBrandKey, 'gi'), '');
             }
             
             // 3. Remove words already in "mainMaterial" to prevent redundancy (e.g. "Organic Cotton Cotton T-Shirt")
             const materialWords = result.mainMaterial.toLowerCase().split(' ');
             const uniqueProductWords = summaryTerm.split(' ').filter(word => {
                 return !materialWords.includes(word.toLowerCase()) && word.length > 2;
             });
             
             const productType = uniqueProductWords.slice(0, 3).join(' ');

             // 4. Construct final query
             const query = `sustainable ${result.mainMaterial} ${productType}`.trim();
             console.log("Searching alternatives for:", query);

             const data = await searchSustainableAlternatives(query);
             setAlternatives(data);
        } catch (e) {
            console.error("Failed to load alternatives", e);
        } finally {
            setLoadingAlternatives(false);
        }
    };

    if (!isHistoryView) {
        fetchAlternatives();
    } else {
        fetchAlternatives();
    }

  }, [result, thumbnail, isHistoryView]);

  const triggerPointsToast = (amount: number, label: string) => {
    if (amount > 0) {
        addPoints(amount);
        setPointsToast({ show: true, amount, label });
        setTimeout(() => setPointsToast(prev => ({ ...prev, show: false })), 3000);
    }
  };

  const handleAlternativeClick = () => {
    triggerPointsToast(20, "Eco-Choice Selected");
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    if (type === 'up') {
        triggerPointsToast(10, "Thanks for feedback!");
    }
  };

  const calculateCPW = () => {
    if (!price || isNaN(parseFloat(price))) return;
    const p = parseFloat(price);
    setCpw(p / lifespan);
  };

  // Re-calculate if lifespan changes while price is present
  useEffect(() => {
      if (price && !isNaN(parseFloat(price)) && cpw !== null) {
          calculateCPW();
      }
  }, [lifespan]);

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
  // Increased radius to fill the space
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((result.overallScore / 100) * circumference);
  const scoreColor = result.overallScore > 75 ? '#8A9A5B' : result.overallScore > 40 ? '#EAB308' : '#D95D39';
  
  // Star Rating Calculation
  const starCount = Math.round((result.overallScore / 100) * 5);

  // Helper for Carbon Context
  const getCarbonEquivalent = () => {
    // Parse value (e.g. "12.5 kg CO2e" -> 12.5)
    const val = parseFloat(result.carbonFootprint.value) || 10;
    return [
        { icon: Smartphone, label: "Phone Charges", value: Math.round(val * 120).toLocaleString() }, // ~8g per charge
        { icon: Car, label: "Miles Driven", value: (val * 2.5).toFixed(1) }, // ~400g per mile
        { icon: Coffee, label: "Kettles Boiled", value: Math.round(val * 15).toLocaleString() }, // ~15g per boil (low estimate)
        { icon: Zap, label: "LED Hours", value: Math.round(val * 200).toLocaleString() } // ~5g per hour
    ];
  };

  const carbonBreakdown = result.carbonFootprint.breakdown || { material: 50, manufacturing: 25, transport: 15, use: 10 };

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

      {/* Navigation Button Overlay */}
      <div className="absolute top-6 left-6 z-30">
          <button 
            onClick={onOpenMenu}
            className="group p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-all duration-300 active:scale-95 border border-white/10"
          >
            <div className="flex flex-col gap-1.5 items-end">
                <span className="w-6 h-0.5 bg-white rounded-full group-hover:w-8 transition-all duration-300"></span>
                <span className="w-4 h-0.5 bg-white rounded-full group-hover:w-8 transition-all duration-300 delay-75"></span>
            </div>
          </button>
      </div>

      {/* Premium Hero Section */}
      <div className="relative h-[22rem] w-full flex-shrink-0 bg-stone-900 rounded-b-[3rem] overflow-hidden shadow-2xl z-10 group">
        <img 
            src={thumbnail} 
            alt="Analyzed Item" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay blur-sm scale-110 transition-transform duration-[3s] group-hover:scale-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-end p-8 pb-12">
            
            {/* Prominent Eco-Score Display */}
            <div className="relative mb-4 flex flex-col items-center animate-fade-in-up">
                 {/* Score Ring - Clean Single Circle Design */}
                <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                    <svg className="transform -rotate-90 w-full h-full p-0.5" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
                        <circle 
                            cx="60" cy="60" r={radius} 
                            stroke={scoreColor} 
                            strokeWidth="6" 
                            fill="transparent" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={strokeDashoffset} 
                            strokeLinecap="round"
                            className="transition-all duration-[1.5s] ease-out shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-white tracking-tight leading-none">{result.overallScore}</span>
                    </div>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                            key={s} 
                            size={16} 
                            className={`${s <= starCount ? 'text-yellow-400 fill-yellow-400' : 'text-stone-600'} drop-shadow-md`} 
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest text-white uppercase border border-white/20">
                         {result.mainMaterial || (result.breakdown.material > 80 ? "Eco-Friendly Choice" : "Conventional Item")}
                    </span>
                </div>
            </div>

            <p className="text-stone-300 text-sm text-center max-w-xs leading-relaxed animate-fade-in-up delay-100">{result.summary.split('.')[0]}.</p>
        
            {/* User Feedback */}
            <div className="flex gap-4 mt-4 animate-fade-in-up delay-200">
                <button 
                    onClick={() => handleFeedback('up')}
                    disabled={feedback !== null}
                    className={`p-2 rounded-full transition-all duration-300 ${feedback === 'up' ? 'bg-green-500 text-white scale-110' : 'bg-white/10 text-stone-400 hover:bg-white/20 hover:scale-105'}`}
                    title="Accurate Analysis"
                >
                    {feedback === 'up' ? <Check size={16} /> : <ThumbsUp size={16} />}
                </button>
                <button 
                    onClick={() => handleFeedback('down')}
                    disabled={feedback !== null}
                    className={`p-2 rounded-full transition-all duration-300 ${feedback === 'down' ? 'bg-red-500 text-white scale-110' : 'bg-white/10 text-stone-400 hover:bg-white/20 hover:scale-105'}`}
                    title="Inaccurate Analysis"
                >
                    <ThumbsDown size={16} />
                </button>
            </div>
            {feedback === 'up' && <p className="text-green-400 text-[10px] font-bold mt-2 animate-fade-in">Thanks for helping us improve!</p>}
        </div>
      </div>

      {/* Floating Tab Bar */}
      <div className="px-6 -mt-8 z-20 relative animate-fade-in-up delay-300">
        <div className="bg-white dark:bg-stone-800 p-1.5 rounded-2xl shadow-xl shadow-stone-900/10 border border-stone-100 dark:border-stone-700 flex justify-between gap-1">
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
                
                {/* Expanded Carbon Footprint Section */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 relative overflow-hidden animate-fade-in-up delay-100 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-500">
                            <Wind size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-ink dark:text-white text-lg">Carbon Footprint</h3>
                            <p className="text-xs text-gray-500">Emission Lifecycle Analysis</p>
                        </div>
                        <div className="ml-auto text-right">
                             <p className="text-2xl font-black text-ink dark:text-white">{result.carbonFootprint.value}</p>
                        </div>
                    </div>

                    {/* Breakdown Chart */}
                    <div className="mb-6">
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mb-2">
                            <span>Lifecycle Breakdown</span>
                        </div>
                        <div className="h-4 w-full flex rounded-full overflow-hidden">
                            <div style={{ width: `${carbonBreakdown.material}%` }} className="bg-orange-400 transition-all duration-1000" title="Material"></div>
                            <div style={{ width: `${carbonBreakdown.manufacturing}%` }} className="bg-yellow-400 transition-all duration-1000" title="Manufacturing"></div>
                            <div style={{ width: `${carbonBreakdown.transport}%` }} className="bg-blue-400 transition-all duration-1000" title="Transport"></div>
                            <div style={{ width: `${carbonBreakdown.use}%` }} className="bg-green-400 transition-all duration-1000" title="Use Phase"></div>
                        </div>
                        <div className="flex gap-3 mt-3 justify-center flex-wrap">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-400"></div><span className="text-[10px] text-gray-500">Material</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-400"></div><span className="text-[10px] text-gray-500">Mfg</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400"></div><span className="text-[10px] text-gray-500">Transport</span></div>
                             <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400"></div><span className="text-[10px] text-gray-500">Use</span></div>
                        </div>
                    </div>

                    {/* Real World Impact Grid */}
                    <div className="bg-gray-50 dark:bg-stone-800/50 rounded-2xl p-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 text-center">Equivalent To</p>
                        <div className="grid grid-cols-4 gap-2">
                            {getCarbonEquivalent().map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center hover:scale-105 transition-transform">
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-stone-700 flex items-center justify-center text-gray-400 mb-1 shadow-sm">
                                        <item.icon size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-ink dark:text-white">{item.value}</span>
                                    <span className="text-[8px] text-gray-400 leading-tight">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* NEW: Material Details Section */}
                {materialInfo && (
                     <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 animate-fade-in-up delay-200 transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600">
                                <Sprout size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-ink dark:text-white text-lg">Material Details</h3>
                                <p className="text-xs text-gray-500">Detailed Impact Stats</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-stone-800 p-3 rounded-2xl text-center">
                                <div className="text-xs text-gray-400 uppercase font-bold mb-1">Carbon</div>
                                <div className="text-xl font-black text-ink dark:text-white">{materialInfo.carbonPerKg}<span className="text-xs font-normal text-gray-500"> kg/kg</span></div>
                            </div>
                            <div className="bg-gray-50 dark:bg-stone-800 p-3 rounded-2xl text-center">
                                <div className="text-xs text-gray-400 uppercase font-bold mb-1">Water</div>
                                <div className="text-xl font-black text-ink dark:text-white">{materialInfo.waterPerKg}<span className="text-xs font-normal text-gray-500"> L/kg</span></div>
                            </div>
                             <div className="col-span-2 bg-gray-50 dark:bg-stone-800 p-3 rounded-2xl flex items-center justify-between px-4">
                                <div className="text-xs text-gray-400 uppercase font-bold">Biodegradability</div>
                                <div className="text-sm font-bold text-ink dark:text-white">{materialInfo.biodegradability || "Unknown"}</div>
                            </div>
                        </div>
                     </div>
                )}

                {/* NEW: Brand Ethics Section */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 animate-fade-in-up delay-200 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600">
                            <Scale size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-ink dark:text-white text-lg">Brand Ethics</h3>
                            <p className="text-xs text-gray-500">Transparency & Practices</p>
                        </div>
                    </div>
                    
                    {brandInfo ? (
                        <div className="space-y-5">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-xl text-ink dark:text-white">{brandInfo.name}</h4>
                                <span className="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md font-bold uppercase">{brandInfo.label}</span>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                                        <span>Labor Standards</span>
                                        <span className="text-ink dark:text-white">{brandInfo.laborScore || brandInfo.ethics}/100</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                        <div style={{ width: `${brandInfo.laborScore || brandInfo.ethics}%` }} className="h-full bg-purple-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                                        <span>Environmental Score</span>
                                        <span className="text-ink dark:text-white">{brandInfo.envScore || brandInfo.transparency}/100</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                        <div style={{ width: `${brandInfo.envScore || brandInfo.transparency}%` }} className="h-full bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                                        <span>Transparency</span>
                                        <span className="text-ink dark:text-white">{brandInfo.transparency}/100</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                        <div style={{ width: `${brandInfo.transparency}%` }} className="h-full bg-blue-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-gray-50 dark:bg-stone-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-stone-700">
                             <Award className="mx-auto text-gray-300 mb-2" size={32} />
                             <p className="text-sm text-gray-400">Brand data not available.</p>
                             <p className="text-xs text-gray-500">Scan tag for better detection.</p>
                        </div>
                    )}
                </div>

                {/* Score Breakdown */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 animate-fade-in-up delay-200 transition-all hover:shadow-md">
                    <h3 className="font-bold text-lg text-ink dark:text-white mb-6">Impact Analysis</h3>
                    <div className="space-y-5">
                        {(Object.entries(result.breakdown) as [string, number][]).map(([key, value], i) => (
                            <div key={key} className="flex items-center gap-4 group">
                                <div className="w-24 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">{key}</div>
                                <div className="flex-1 h-3 bg-gray-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 ${value > 70 ? 'bg-sage' : value > 40 ? 'bg-yellow-400' : 'bg-terracotta'}`}
                                        style={{ width: `${value}%`, transitionDelay: `${i * 100}ms` }}
                                    />
                                </div>
                                <div className="w-8 text-xs font-bold text-ink dark:text-white">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sustainable Alternatives */}
                <div className="space-y-4 animate-fade-in-up delay-300">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-ink dark:text-white flex items-center gap-2">
                             Greener Choices
                             <span className="text-xs font-normal text-gray-400">(Live Search)</span>
                        </h3>
                        <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2 py-1 rounded-md">
                            Earn +20 pts
                        </span>
                    </div>
                    
                    {loadingAlternatives ? (
                        <div className="flex gap-4 overflow-x-auto pb-6 px-2">
                             {[1,2,3].map(i => (
                                 <div key={i} className="min-w-[260px] h-64 bg-gray-100 dark:bg-stone-800 rounded-2xl animate-pulse"></div>
                             ))}
                        </div>
                    ) : alternatives.length > 0 ? (
                        <div className="flex gap-4 overflow-x-auto pb-6 snap-x scrollbar-hide -mx-6 px-6">
                            {alternatives.map((alt, idx) => (
                                <div key={idx} className="min-w-[260px] snap-center bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm border border-stone-100 dark:border-stone-800 group hover:shadow-md transition-all">
                                    <div className="h-40 relative overflow-hidden bg-gray-50 dark:bg-stone-800">
                                        <img 
                                            src={alt.image !== 'default' ? alt.image : `https://source.unsplash.com/random/400x300/?clothing,${encodeURIComponent(alt.name)}`} 
                                            alt={alt.name} 
                                            onError={(e) => {
                                                // Fallback if image load fails
                                                (e.target as HTMLImageElement).src = `https://placehold.co/400x300/EEE/31343C?text=${encodeURIComponent(alt.brand)}`;
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-ink flex items-center gap-1">
                                            <Leaf size={10} className="text-sage" /> {alt.sustainabilityFeature || "Eco"}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-ink dark:text-white text-sm line-clamp-1 flex-1">{alt.name}</h4>
                                            <span className="text-xs font-bold text-terracotta ml-2">{alt.price}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4">{alt.brand}</p>
                                        <a 
                                            href={alt.url} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            onClick={handleAlternativeClick}
                                            className="flex items-center justify-center w-full py-3 bg-stone-100 dark:bg-stone-800 hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-ink rounded-xl text-xs font-bold transition-all gap-2"
                                        >
                                            <ShoppingBag size={14} /> Shop Now
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center bg-gray-50 dark:bg-stone-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-stone-800">
                            <p className="text-sm text-gray-400">No specific alternatives found.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* ... (Care and Value Tabs remain similar but with added transitions via classNames) ... */}
        {activeTab === 'care' && (
            <div className="animate-slide-up space-y-6">
                 {/* Care Guide Hero */}
                 <div className="bg-periwinkle/20 dark:bg-periwinkle/10 rounded-3xl p-8 text-center relative overflow-hidden animate-fade-in-up">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-periwinkle/30 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                    
                    <Shirt className="w-12 h-12 text-periwinkle mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-ink dark:text-white mb-2">Smart Care Guide</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                        Specific instructions extracted for {result.mainMaterial || (result.breakdown.material > 60 ? 'Natural Fibers' : 'Synthetic Blend')}
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
                        <div key={i} className="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-start gap-4 animate-fade-in-up hover:scale-[1.02] transition-transform" style={{ animationDelay: `${i * 100}ms` }}>
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
                <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 animate-fade-in-up transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-terracotta/10 rounded-xl text-terracotta">
                            <Calculator size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-ink dark:text-white">True Cost Calculator</h3>
                            <p className="text-xs text-gray-500">Price per wear estimator</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Price Input */}
                        <div className="flex gap-3">
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

                        {/* Lifespan Slider */}
                        <div>
                             <label className="text-xs text-gray-500 font-bold uppercase mb-3 flex justify-between">
                                <span>Estimated Lifespan</span>
                                <span className="text-ink dark:text-white">{lifespan} Wears</span>
                             </label>
                             <input 
                                type="range" 
                                min="10" 
                                max="300" 
                                step="5"
                                value={lifespan} 
                                onChange={(e) => {
                                    setLifespan(parseInt(e.target.value));
                                }}
                                className="w-full h-2 bg-gray-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-terracotta"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                <span>Low Quality</span>
                                <span>High Durability</span>
                            </div>
                        </div>

                        {cpw !== null && (
                            <div className="bg-gradient-to-br from-terracotta to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden animate-fade-in">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse"></div>
                                <div className="relative z-10 flex justify-between items-end">
                                    <div>
                                        <p className="text-white/80 text-xs font-bold uppercase mb-1">True Cost / Wear</p>
                                        <p className="text-4xl font-black">${cpw.toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white/80 text-xs font-bold mb-1">Lifespan</p>
                                        <p className="text-xl font-bold">{lifespan} Wears</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Local Recycling Locator */}
                <div className="space-y-4 animate-fade-in-up delay-100">
                     <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold text-lg text-ink dark:text-white flex items-center gap-2">
                            <MapPin size={20} className="text-sage" /> Nearby Recycling
                        </h3>
                        {recyclingResult && (
                             <button 
                                onClick={handleLocateRecycling}
                                disabled={loadingRecycling}
                                className="text-xs font-bold text-sage hover:text-sage/80 flex items-center gap-1 disabled:opacity-50"
                            >
                                {loadingRecycling && <Loader2 size={10} className="animate-spin" />}
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

                    {loadingRecycling && !recyclingResult && (
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
                        <div className="space-y-4 animate-fade-in">
                            {/* Structured List of Locations */}
                            <div className="grid gap-3">
                                {recyclingResult.locations.map((loc, idx) => {
                                    // Try to find a matching link from grounding chunks
                                    const matchingPlace = recyclingResult.places.find(
                                        p => p.title.includes(loc.name) || loc.name.includes(p.title)
                                    );
                                    const mapLink = matchingPlace ? matchingPlace.uri : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.address)}`;

                                    return (
                                        <a 
                                            key={idx} 
                                            href={mapLink} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="bg-white dark:bg-stone-900 p-5 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-start gap-4 group hover:border-sage/50 transition-colors hover:scale-[1.01]"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0 text-sage group-hover:bg-sage group-hover:text-white transition-colors">
                                                <MapPin size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-ink dark:text-white text-sm mb-1">{loc.name}</h4>
                                                <p className="text-xs text-gray-500 mb-2 truncate">{loc.address}</p>
                                                <p className="text-xs text-sage font-medium bg-sage/5 px-2 py-1 rounded-md inline-block">
                                                    {loc.info}
                                                </p>
                                            </div>
                                            <ExternalLink size={14} className="text-gray-300 group-hover:text-sage" />
                                        </a>
                                    );
                                })}
                                
                                {recyclingResult.locations.length === 0 && (
                                     <p className="text-sm text-gray-400 text-center py-4">No specific details found, check the map links below.</p>
                                )}
                            </div>

                            {/* Fallback/Additional Source Links (if any distinct ones exist) */}
                            {recyclingResult.places.length > 0 && recyclingResult.locations.length === 0 && (
                                <div className="grid gap-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase ml-1">Search Results</h4>
                                    {recyclingResult.places.map((place, idx) => (
                                        <a 
                                            key={idx} 
                                            href={place.uri} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 flex items-center justify-between group hover:border-sage/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0">
                                                    <MapPin size={14} />
                                                </div>
                                                <span className="font-bold text-ink dark:text-white truncate text-xs">{place.title}</span>
                                            </div>
                                            <ExternalLink size={12} className="text-gray-400" />
                                        </a>
                                    ))}
                                </div>
                            )}
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
