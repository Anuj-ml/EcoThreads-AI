
import React from 'react';
import { GamificationProfile } from '../types';
import { Trophy, Sprout, TreeDeciduous, Award, Medal, Zap, Crown, Mountain } from 'lucide-react';

interface GamificationHubProps {
  profile: GamificationProfile;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({ profile }) => {
  const getLevelConfig = () => {
    switch (profile.level) {
      case 'Forest': return { icon: Mountain, color: 'text-emerald-700', bg: 'bg-emerald-100', next: 'Max Level', max: 2000 };
      case 'Tree': return { icon: TreeDeciduous, color: 'text-emerald-500', bg: 'bg-emerald-100', next: 'Forest', max: 1000 };
      case 'Sapling': return { icon: Sprout, color: 'text-green-500', bg: 'bg-green-100', next: 'Tree', max: 500 };
      case 'Sprout': return { icon: Sprout, color: 'text-lime-500', bg: 'bg-lime-100', next: 'Sapling', max: 200 };
      default: return { icon: Sprout, color: 'text-stone-400', bg: 'bg-stone-100', next: 'Sprout', max: 50 };
    }
  };

  const config = getLevelConfig();
  const LevelIcon = config.icon;

  const getProgress = () => {
    const points = profile.points;
    let prevMax = 0;
    if (points >= 500) prevMax = 500;
    else if (points >= 200) prevMax = 200;
    else if (points >= 50) prevMax = 50;
    
    const range = config.max - prevMax;
    const current = points - prevMax;
    return Math.min(100, Math.max(5, (current / range) * 100));
  };

  const badgeIcons: Record<string, React.ElementType> = {
      'First Scan': Zap,
      'Eco Enthusiast': Trophy,
      'Carbon Neutralizer': Crown
  };

  return (
    <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-stone-200 dark:border-stone-700 animate-fade-in hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 ${config.bg} dark:bg-opacity-10 rounded-2xl shadow-inner`}>
            <LevelIcon className={`${config.color}`} size={28} />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-0.5">Eco Level</div>
            <div className="font-black text-ink dark:text-white text-xl leading-none">{profile.level}</div>
          </div>
        </div>
        <div className="text-right">
             <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-orange-500">{profile.points}</div>
             <div className="text-[10px] text-gray-400 uppercase font-bold">Total Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5 uppercase">
            <span>Progress</span>
            <span>Next: {config.next}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-stone-700 rounded-full overflow-hidden shadow-inner">
            <div 
            className="h-full bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500 transition-all duration-1000 ease-out relative"
            style={{ width: `${getProgress()}%` }}
            >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
         <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Achievements</p>
         {profile.badges.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {profile.badges.map((badge, idx) => {
                const BIcon = badgeIcons[badge] || Award;
                return (
                    <div key={idx} className="flex-shrink-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-stone-700 dark:to-stone-800 border border-orange-100 dark:border-stone-600 p-2 pr-3 rounded-xl flex items-center gap-2 shadow-sm" title={badge}>
                        <div className="bg-white dark:bg-stone-600 rounded-lg p-1 text-orange-500">
                            <BIcon size={14} />
                        </div>
                        <span className="text-[10px] font-bold text-orange-800 dark:text-orange-200">{badge}</span>
                    </div>
                );
            })}
            </div>
         ) : (
             <div className="text-xs text-gray-400 text-center py-2 italic bg-gray-50 dark:bg-stone-900 rounded-xl border border-dashed border-gray-200 dark:border-stone-700">
                 Complete scans to unlock your first badge!
             </div>
         )}
      </div>
    </div>
  );
};
