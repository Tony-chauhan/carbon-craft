import { motion } from 'framer-motion';
import { useCarbonStore } from '../store/useCarbonStore';
import { Trophy, Award } from 'lucide-react';

export function Gamification() {
  const { xp, ecoLevel, achievements } = useCarbonStore();

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Planet Hero': return 'text-accent-primary drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]';
      case 'Guardian': return 'text-success drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]';
      case 'Reducer': return 'text-warning';
      default: return 'text-text-primary';
    }
  };

  const getNextLevelXp = (currentXp: number) => {
    if (currentXp < 50) return 50;
    if (currentXp < 200) return 200;
    if (currentXp < 500) return 500;
    if (currentXp < 1000) return 1000;
    return 1000; // max
  };

  const nextXp = getNextLevelXp(xp);
  const progress = Math.min((xp / nextXp) * 100, 100);

  return (
    <div className="space-y-6">
      
      {/* Current Level Card */}
      <div className="glass-panel-elevated p-8 rounded-3xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary/10 via-bg-base/0 to-bg-base/0"></div>
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="relative z-10"
        >
          <div className="w-20 h-20 mx-auto bg-bg-surface rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.2)] mb-4">
            <Trophy className="w-10 h-10 text-accent-primary" />
          </div>
          <h2 className="text-sm font-semibold tracking-widest text-text-secondary uppercase mb-1">Current Status</h2>
          <h1 className={`text-4xl font-black ${getLevelColor(ecoLevel)}`}>{ecoLevel}</h1>
        </motion.div>

        {/* XP Bar */}
        <div className="mt-8 relative z-10">
          <div className="flex justify-between text-xs font-medium text-text-secondary mb-2">
            <span>{xp} XP</span>
            <span>{nextXp} XP to Next Rank</span>
          </div>
          <div className="w-full h-3 bg-bg-base rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-accent-primary/50 to-accent-primary relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
          <Award className="text-warning" /> 
          Unlocked Badges
        </h3>
        
        {achievements.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-white/10">
            <p className="text-text-secondary">No badges yet. Complete actions to earn them!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((ach, idx) => (
              <motion.div 
                key={ach.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center group hover:bg-bg-surface transition-colors"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{ach.icon}</div>
                <h4 className="text-sm font-bold text-text-primary">{ach.title}</h4>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
