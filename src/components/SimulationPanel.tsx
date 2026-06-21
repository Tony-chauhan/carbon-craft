import { useEffect } from 'react';
import { useCarbonStore } from '../store/useCarbonStore';
import { useForm } from 'react-hook-form';
import type { AssessmentData } from '../utils/validationSchema';
import { motion } from 'framer-motion';
import { Sliders, RefreshCw } from 'lucide-react';

export function SimulationPanel() {
  const { assessmentData, simulationScore, updateSimulation, toggleSimulationMode } = useCarbonStore();

  const { register, watch, reset } = useForm<AssessmentData>({
    defaultValues: assessmentData || undefined
  });

  // Watch all form fields and trigger updates in the store
  const currentValues = watch();

  useEffect(() => {
    toggleSimulationMode(true);
    return () => toggleSimulationMode(false);
  }, [toggleSimulationMode]);

  useEffect(() => {
    if (Object.keys(currentValues).length > 0) {
      updateSimulation(currentValues as AssessmentData);
    }
  }, [JSON.stringify(currentValues), updateSimulation]);

  if (!simulationScore) return null;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl flex justify-between items-center bg-gradient-to-r from-bg-surface to-accent-primary/5">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Sliders className="text-accent-primary" />
            What-If Simulator
          </h2>
          <p className="text-sm text-text-secondary mt-1">Tweak your habits to see instant 3D changes.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Simulated Score</p>
          <motion.p 
            key={simulationScore.total}
            initial={{ scale: 1.2, color: '#22D3EE' }}
            animate={{ scale: 1, color: '#E6EDF3' }}
            className="text-3xl font-black"
          >
            {simulationScore.total} <span className="text-sm font-medium text-text-secondary">kg</span>
          </motion.p>
        </div>
      </div>

      <form className="space-y-4">
        
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <label className="text-sm font-semibold text-text-primary flex justify-between">
            Transport Mode
            <span className="text-accent-primary">{currentValues.transport}</span>
          </label>
          <select {...register('transport')} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-2 text-text-primary focus:border-accent-primary outline-none">
            <option value="car">Car</option>
            <option value="mixed">Mixed</option>
            <option value="public">Public Transit</option>
            <option value="bike">Bicycle</option>
            <option value="walk">Walk</option>
          </select>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <label className="text-sm font-semibold text-text-primary flex justify-between">
            Home Energy Plan
            <span className="text-accent-primary">{currentValues.homeEnergy}</span>
          </label>
          <select {...register('homeEnergy')} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-2 text-text-primary focus:border-accent-primary outline-none">
            <option value="fossil">Fossil Fuels</option>
            <option value="mixed">Mixed</option>
            <option value="renewable">100% Renewable</option>
          </select>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <label className="text-sm font-semibold text-text-primary flex justify-between">
            Diet Style
            <span className="text-accent-primary">{currentValues.diet}</span>
          </label>
          <select {...register('diet')} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-2 text-text-primary focus:border-accent-primary outline-none">
            <option value="meat-heavy">Meat Heavy</option>
            <option value="balanced">Balanced</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
        
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <label className="text-sm font-semibold text-text-primary flex justify-between">
            Annual Flights
            <span className="text-accent-primary">{currentValues.flights}</span>
          </label>
          <input type="range" min="0" max="20" {...register('flights', { valueAsNumber: true })} className="w-full accent-accent-primary" />
        </div>

      </form>

      <button 
        type="button"
        onClick={() => { 
          if(assessmentData) {
            reset(assessmentData);
            updateSimulation(assessmentData);
          }
        }}
        className="w-full py-3 glass-panel hover:bg-bg-elevated rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors"
      >
        <RefreshCw size={16} /> Reset to My Actual Data
      </button>

    </div>
  );
}
