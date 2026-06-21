/**
 * @file Dashboard.tsx
 * @description Main dashboard view showing the calculated carbon footprint score,
 * AI insights, progress streaks, and personalized action recommendations.
 */

import { motion } from 'framer-motion';
import { useCarbonStore } from '../store/useCarbonStore';
import { ArrowDownRight, ArrowUpRight, Target, Leaf } from 'lucide-react';
import type { Recommendation } from '../utils/recommendationsLogic';

/**
 * Dashboard component displaying real-time footprint scores and recommended actions.
 */
export function Dashboard() {
  const { score, insight, recommendations, impactDiff, streak } = useCarbonStore();

  if (!score) return null;

  const getScoreColor = (total: number) => {
    if (total < 4000) return 'text-success';
    if (total < 8000) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="space-y-8 pb-8">
      
      {/* Hero Score Section */}
      <div className="glass-panel-elevated p-8 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-accent-primary/10 transition-colors duration-700"></div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="text-sm font-semibold tracking-widest text-text-secondary uppercase">Your Carbon Footprint</h2>
            <p className="text-xs text-text-secondary mt-1 max-w-[280px]">Understand, track, and reduce your carbon footprint through simple actions and personalized insights.</p>
            <div className="flex items-baseline gap-2 mt-2" aria-live="polite" aria-atomic="true">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className={`text-6xl md:text-7xl font-black ${getScoreColor(score.total)}`}
              >
                {score.total}
              </motion.span>
              <span className="text-xl font-medium text-text-secondary">kg CO₂e</span>
            </div>
          </div>
          
          {/* Streak Indicator */}
          <div className="flex flex-col items-center p-3 bg-bg-base/50 rounded-2xl border border-white/5">
            <span className="text-xl">🔥</span>
            <span className="text-xs font-bold text-warning mt-1">{streak} Day</span>
          </div>
        </div>

        {/* Diff Indicator */}
        {impactDiff && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
              impactDiff.isImprovement 
                ? 'bg-success/10 border-success/20 text-success' 
                : 'bg-danger/10 border-danger/20 text-danger'
            }`}
          >
            {impactDiff.isImprovement ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
            {impactDiff.summary}
          </motion.div>
        )}
      </div>

      {/* Insight Section */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent-primary/10 rounded-lg text-accent-primary">
            <Target size={20} />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">AI Insight</h3>
        </div>
        <p className="text-text-primary/90 text-lg leading-relaxed">{insight}</p>
      </div>

      {/* Action Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-text-primary">Action Plan</h3>
          <span className="text-xs font-medium text-accent-primary bg-accent-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">High ROI</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((rec, idx) => (
            <RecommendationCard key={idx} rec={rec} index={idx} />
          ))}
        </div>
      </div>

    </div>
  );
}

/**
 * Card component for listing recommended footprint reduction actions.
 */
function RecommendationCard({ rec, index }: { rec: Recommendation, index: number }) {
  const isHighImpact = rec.impact === 'high';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-panel p-5 rounded-2xl group transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
        isHighImpact ? 'hover:border-accent-primary/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]' : 'hover:border-success/50'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
          rec.type === 'quick-win' ? 'bg-accent-primary/10 text-accent-primary' : 
          rec.type === 'weekly-habit' ? 'bg-warning/10 text-warning' : 
          'bg-purple-500/10 text-purple-400'
        }`}>
          {rec.type.replace('-', ' ')}
        </span>
        
        <div className="flex gap-1">
          {Array.from({ length: isHighImpact ? 3 : rec.impact === 'medium' ? 2 : 1 }).map((_, i) => (
            <Leaf key={i} size={14} className={isHighImpact ? 'text-accent-primary' : 'text-success'} />
          ))}
        </div>
      </div>
      
      <h4 className="text-lg font-semibold text-text-primary mb-2">{rec.title}</h4>
      <p className="text-text-secondary text-sm leading-relaxed">{rec.description}</p>
    </motion.div>
  );
}
