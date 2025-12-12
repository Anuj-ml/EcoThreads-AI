
import React, { useEffect, useState } from 'react';
import { X, Globe, Droplets, Wind, TrendingUp, TrendingDown, Award, AlertTriangle, Users } from 'lucide-react';
import { SocialStats } from '../types';
import { fetchGlobalStats } from '../services/socialProofService';

interface CommunityImpactModalProps {
  onClose: () => void;
}

export const CommunityImpactModal: React.FC<CommunityImpactModalProps> = ({ onClose }) => {
  const [stats, setStats] = useState<SocialStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
        const data = await fetchGlobalStats();
        setStats(data);
        setLoading(false);
    };
    loadStats();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-2">
                <Globe className="text-blue-200" size={32} />
                <h2 className="text-2xl font-black">Community Impact</h2>
            </div>
            <p className="text-blue-100 text-sm">You are part of a global movement.</p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-24 bg-gray-100 dark:bg-stone-800 rounded-2xl"></div>
                    <div className="h-40 bg-gray-100 dark:bg-stone-800 rounded-2xl"></div>
                </div>
            ) : stats && (
                <div className="space-y-6">
                    {/* Live Counter */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-800">
                             <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                                 {stats.weeklyScans.toLocaleString()}
                             </div>
                             <div className="text-xs font-bold text-gray-500 uppercase">Scans This Week</div>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl text-center border border-indigo-100 dark:border-indigo-800">
                             <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                                 {stats.globalScans.toLocaleString()}
                             </div>
                             <div className="text-xs font-bold text-gray-500 uppercase">Total Scans</div>
                        </div>
                    </div>

                    {/* Resources Saved */}
                    <div className="bg-stone-50 dark:bg-stone-800 p-5 rounded-2xl">
                        <h3 className="font-bold text-ink dark:text-white mb-4 flex items-center gap-2">
                            <Users size={16} /> Collective Savings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl text-cyan-600">
                                    <Droplets size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-ink dark:text-white">
                                        {(stats.totalWaterSaved / 1000).toFixed(1)}k <span className="text-sm font-normal text-gray-500">Liters</span>
                                    </div>
                                    <div className="text-xs text-gray-400">Water preserved by choosing verified sustainable items.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600">
                                    <Wind size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-ink dark:text-white">
                                        {(stats.totalCarbonAvoided / 1000).toFixed(1)}k <span className="text-sm font-normal text-gray-500">kg</span>
                                    </div>
                                    <div className="text-xs text-gray-400">CO2e avoided via low-carbon choices.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Brand Podium */}
                    <div className="space-y-3">
                         <h3 className="font-bold text-ink dark:text-white text-sm uppercase tracking-wide">Brand Reputation</h3>
                         
                         {/* Top Brand */}
                         <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                             <div className="flex items-center gap-3">
                                 <Award className="text-emerald-500" size={24} />
                                 <div>
                                     <div className="font-bold text-ink dark:text-white">{stats.topSustainableBrand.name}</div>
                                     <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Top Rated ({stats.topSustainableBrand.avgScore}/100)</div>
                                 </div>
                             </div>
                             <TrendingUp className="text-emerald-500" />
                         </div>

                         {/* Low Brand */}
                         <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800">
                             <div className="flex items-center gap-3">
                                 <AlertTriangle className="text-red-500" size={24} />
                                 <div>
                                     <div className="font-bold text-ink dark:text-white">{stats.worstBrand.name}</div>
                                     <div className="text-xs text-red-600 dark:text-red-400 font-bold">Needs Improvement</div>
                                 </div>
                             </div>
                             <TrendingDown className="text-red-500" />
                         </div>
                    </div>

                    <div className="text-center pt-4 border-t border-gray-100 dark:border-stone-800">
                        <a href="#" className="text-xs text-gray-400 hover:text-blue-500 underline">Privacy Policy</a>
                        <p className="text-[10px] text-gray-300 mt-1">Data is aggregated anonymously. No personal info stored.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
