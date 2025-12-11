
import React, { useEffect, useState } from 'react';
import { GamificationProfile } from '../types';
import { Trophy, Sprout, TreeDeciduous, Award, Medal, Zap, Crown, Mountain, Star, Flame, Shield, Leaf, CheckCircle2 } from 'lucide-react';

interface GamificationHubProps {
  profile: GamificationProfile;
  compact?: boolean;
}

const BADGE_CONFIG: Record<string, { icon: React.ElementType, from: string, to: string, text: string, border: string }> = {
    'First Scan': { icon: Zap, from: 'from-yellow-300', to: 'to-amber-500', text: 'text-amber-900', border: 'border-amber-200' },
    'Eco Enthusiast': { icon: Flame, from: 'from-orange-300', to: 'to-red-500', text: 'text-red-950', border: 'border-orange-200' },
    'Carbon Neutralizer': { icon: Leaf, from: 'from-green-300', to: 'to-emerald-600', text: 'text-emerald-950', border: 'border-emerald-200' },
    'Trendsetter': { icon: Star, from: 'from-purple-300', to: 'to-indigo-500', text: 'text-indigo-950', border: 'border-purple-200' },
    'Guardian': { icon: Shield, from: 'from-blue-300', to: 'to-cyan-500', text: 'text-cyan-950', border: 'border-blue-200' },
    'default': { icon: Award, from: 'from-gray-200', to: 'to-gray-400', text: 'text-gray-700', border: 'border-gray-200' }
};

export const GamificationHub: React.FC<GamificationHubProps> = ({ profile, compact = false }) => {
  const [progressWidth, setProgressWidth] = useState(0);

  const getLevelConfig = () => {
    switch (profile.level) {
      case 'Forest': return { icon: Mountain, color: 'text-emerald-100', bg: 'bg-emerald-900', gradient: 'from-emerald-700 to-teal-900', next: 'Max Level', max: 2000 };
      case 'Tree': return { icon: TreeDeciduous, color: 'text-green-100', bg: 'bg-green-800', gradient: 'from-green-600 to-emerald-800', next: 'Forest', max: 1000 };
      case 'Sapling': return { icon: Sprout, color: 'text-lime-100', bg: 'bg-lime-700', gradient: 'from-lime-500 to-green-700', next: 'Tree', max: 500 };
      case 'Sprout': return { icon: Sprout, color: 'text-yellow-100', bg: 'bg-yellow-700', gradient: 'from-yellow-500 to-lime-700', next: 'Sapling', max: 200 };
      default: return { icon: Sprout, color: 'text-stone-100', bg: 'bg-stone-600', gradient: 'from-stone-400 to-stone-600', next: 'Sprout', max: 50 };
    }
  };

  const config = getLevelConfig();
  const LevelIcon = config.icon;

  const getProgress = () => {
    const points = profile.points;
    let prevMax = 0;
    if (points >= 1000) prevMax = 1000;
    else if (points >= 500) prevMax = 500;
    else if (points >= 200) prevMax = 200;
    else if (points >= 50) prevMax = 50;
    
    if (config.next === 'Max Level') return 100;
    
    const range = config.max - prevMax;
    const current = points - prevMax;
    return Math.min(100, Math.max(5, (current / range) * 100));
  };

  useEffect(() => {
    // Small delay to trigger CSS transition
    const timer = setTimeout(() => {
        setProgressWidth(getProgress());
    }, 100);
    return () => clearTimeout(timer);
  }, [profile.points]);

  if (compact) {
    return (
        <div className="w-full animate-fade-in group">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    <LevelIcon className={`${config.color} relative z-10`} size={20} />
                </div>
                <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current Level</div>
                    <div className="font-black text-ink dark:text-white leading-none text-lg flex items-center gap-2">
                        {profile.level}
                    </div>
                </div>
                <div className="ml-auto text-right">
                    <span className="text-xl font-black text-terracotta">{profile.points}</span>
                    <span className="text-[10px] text-gray-400 block -mt-1 font-bold uppercase">pts</span>
                </div>
            </div>
            
            <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mb-4 border border-stone-200 dark:border-stone-700 relative">
                 <div 
                    className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-1000 ease-out relative`} 
                    style={{ width: `${progressWidth}%` }}
                 >
                    <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                 </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mask-linear-fade">
                {profile.badges.slice(0, 4).map((badge, idx) => {
                     const bStyle = BADGE_CONFIG[badge] || BADGE_CONFIG['default'];
                     const BIcon = bStyle.icon;
                     return (
                         <div key={idx} className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${bStyle.from} ${bStyle.to} flex items-center justify-center shadow-sm border border-white/20`} title={badge}>
                             <BIcon size={14} className="text-white drop-shadow-sm" />
                         </div>
                     );
                })}
                {profile.badges.length === 0 && (
                    <span className="text-xs text-gray-400 italic pl-1">No badges yet</span>
                )}
            </div>
        </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-stone-700 animate-fade-in relative overflow-hidden">
      
      {/* Background decoration */}
      <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${config.gradient} rounded-full opacity-10 blur-3xl`}></div>
      <div className={`absolute -bottom-20 -left-20 w-64 h-64 bg-terracotta rounded-full opacity-5 blur-3xl`}></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-5">
          <div key={profile.level} className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-2xl flex items-center justify-center animate-bounce-in ring-4 ring-white/10 dark:ring-black/10`}>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
             <LevelIcon className={`${config.color} drop-shadow-md relative z-10`} size={40} />
             
             {/* Level Badge */}
             <div className="absolute -bottom-3 -right-3 bg-white dark:bg-stone-800 text-ink dark:text-white text-[10px] font-black px-2 py-1 rounded-full shadow-md border border-stone-100 dark:border-stone-700">
                LVL {Object.keys(getLevelConfig()).indexOf(profile.level) + 1}
             </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                Eco Status 
                {profile.level === 'Forest' && <Crown size={12} className="text-yellow-500" />}
            </div>
            <div className="font-black text-ink dark:text-white text-4xl leading-none tracking-tight">{profile.level}</div>
            <div className="text-sm text-gray-400 font-medium mt-1">Keep scanning to grow!</div>
          </div>
        </div>
        
        <div className="text-right">
             <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-orange-500 tracking-tighter filter drop-shadow-sm">{profile.points}</div>
             <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-1">Total Impact Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-8 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700/50">
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
            <span>Progress to {config.next}</span>
            <span className="text-terracotta">{Math.round((profile.points - (config.max - (config.max === 2000 ? 1000 : config.max === 1000 ? 500 : config.max === 500 ? 200 : config.max === 200 ? 50 : 0))) / (config.max - (config.max === 2000 ? 1000 : config.max === 1000 ? 500 : config.max === 500 ? 200 : config.max === 200 ? 50 : 0)) * 100)}%</span>
        </div>
        <div className="w-full h-5 bg-stone-200 dark:bg-stone-900 rounded-full overflow-hidden shadow-inner relative">
            <div 
                className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-1500 ease-out relative flex items-center justify-end pr-1`}
                style={{ width: `${progressWidth}%` }}
            >
                <div className="w-1 h-full bg-white/30"></div>
                <div className="absolute inset-0 bg-white/10 animate-[shimmer_2s_infinite]"></div>
            </div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-300">
            <span>Current</span>
            <span>{config.max} pts</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
         <div className="flex items-center justify-between mb-4">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unlocked Badges</p>
             <span className="text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-500 px-2 py-1 rounded-md">{profile.badges.length} Collected</span>
         </div>
         
         {profile.badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
            {profile.badges.map((badge, idx) => {
                const bStyle = BADGE_CONFIG[badge] || BADGE_CONFIG['default'];
                const BIcon = bStyle.icon;
                return (
                    <div key={idx} className={`relative overflow-hidden bg-white dark:bg-stone-800 border ${bStyle.border} dark:border-opacity-20 p-3 rounded-2xl flex items-center gap-3 shadow-sm group hover:scale-[1.02] transition-transform duration-300`}>
                        <div className={`absolute right-0 top-0 w-16 h-16 bg-gradient-to-br ${bStyle.from} ${bStyle.to} opacity-10 rounded-bl-full transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500`}></div>
                        
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${bStyle.from} ${bStyle.to} flex items-center justify-center shadow-md flex-shrink-0 group-hover:rotate-12 transition-transform`}>
                            <BIcon size={18} className="text-white" />
                        </div>
                        
                        <div className="min-w-0">
                            <span className={`text-xs font-black ${bStyle.text} dark:text-gray-200 block truncate`}>{badge}</span>
                            <span className="text-[10px] text-gray-400 block truncate">Unlocked</span>
                        </div>
                        
                        <CheckCircle2 size={12} className="ml-auto text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                );
            })}
            </div>
         ) : (
             <div className="text-center py-8 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800/50">
                 <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-2 text-stone-300">
                    <Medal size={24} />
                 </div>
                 <p className="text-xs text-gray-400 font-bold">Start scanning to verify your impact!</p>
             </div>
         )}
      </div>
    </div>
  );
};
