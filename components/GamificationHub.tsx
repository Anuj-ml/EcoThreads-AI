
import React from 'react';
import { GamificationProfile } from '../types';
import { Trophy, Sprout, TreeDeciduous, Award, Medal } from 'lucide-react';

interface GamificationHubProps {
  profile: GamificationProfile;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({ profile }) => {
  const getLevelIcon = () => {
    switch (profile.level) {
      case 'Forest': return <TreeDeciduous className="text-emerald-600" size={24} />;
      case 'Tree': return <TreeDeciduous className="text-emerald-400" size={24} />;
      case 'Sapling': return <Sprout className="text-green-500" size={24} />;
      case 'Sprout': return <Sprout className="text-lime-400" size={24} />;
      default: return <div className="w-6 h-6 rounded-full bg-stone-300" />;
    }
  };

  const getProgress = () => {
    const points = profile.points;
    if (points >= 1000) return 100; // Max
    if (points >= 500) return ((points - 500) / 500) * 100;
    if (points >= 200) return ((points - 200) / 300) * 100;
    if (points >= 50) return ((points - 50) / 150) * 100;
    return (points / 50) * 100;
  };

  return (
    <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-stone-200 dark:border-stone-700 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cream dark:bg-stone-700 rounded-lg shadow-sm">
            {getLevelIcon()}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Eco Level</div>
            <div className="font-bold text-ink dark:text-white text-lg">{profile.level}</div>
          </div>
        </div>
        <div className="text-right">
             <div className="text-2xl font-black text-terracotta">{profile.points}</div>
             <div className="text-[10px] text-gray-400 uppercase font-bold">Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-100 dark:bg-stone-700 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-1000 ease-out"
          style={{ width: `${getProgress()}%` }}
        ></div>
      </div>

      {/* Badges */}
      {profile.badges.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {profile.badges.map((badge, idx) => (
            <div key={idx} className="flex-shrink-0 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 px-2 py-1 rounded-md flex items-center gap-1.5" title={badge}>
              <Award size={12} className="text-orange-500" />
              <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300">{badge}</span>
            </div>
          ))}
        </div>
      )}
      
      {profile.badges.length === 0 && (
         <div className="text-xs text-gray-400 text-center py-1">Scan items to unlock badges!</div>
      )}
    </div>
  );
};
