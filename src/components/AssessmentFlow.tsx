import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assessmentSchema, type AssessmentData } from '../utils/validationSchema';
import { useCarbonStore } from '../store/useCarbonStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Home, ShoppingBag, Utensils, Plane, ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
  { id: 'transport', title: 'Transportation', icon: <Car /> },
  { id: 'home', title: 'Home Energy', icon: <Home /> },
  { id: 'diet', title: 'Diet & Food', icon: <Utensils /> },
  { id: 'consumption', title: 'Shopping & Waste', icon: <ShoppingBag /> },
  { id: 'travel', title: 'Air Travel', icon: <Plane /> },
];

export function AssessmentFlow() {
  const { submitAssessment } = useCarbonStore();
  const [currentStep, setCurrentStep] = useState(0);

  const { register, handleSubmit } = useForm<AssessmentData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      transport: 'mixed', carUsage: 100,
      homeEnergy: 'mixed', energyUsage: 500,
      diet: 'balanced',
      shopping: 'average', waste: 'average',
      flights: 1,
    }
  });

  const nextStep = async () => {
    // We could trigger specific field validation here
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const onSubmit = (data: AssessmentData) => {
    submitAssessment(data);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary mb-2">Build Your World</h2>
        <p className="text-text-secondary">Let's estimate your footprint to generate your 3D ecosystem.</p>
      </div>

      <div className="glass-panel-elevated rounded-3xl p-8 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-bg-base">
          <motion.div 
            className="h-full bg-accent-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <div className="flex items-center gap-3 mb-8 text-accent-primary">
          {steps[currentStep].icon}
          <h3 className="text-xl font-bold text-text-primary">{steps[currentStep].title}</h3>
          <span className="ml-auto text-sm text-text-secondary">{currentStep + 1} / {steps.length}</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 min-h-[250px]"
            >
              
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Primary mode of transport</label>
                    <select aria-label="Primary mode of transport" {...register('transport')} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-primary outline-none transition-all">
                      <option value="car">Car (Gas/Diesel)</option>
                      <option value="mixed">Mixed (Car + Public)</option>
                      <option value="public">Public Transit</option>
                      <option value="bike">Bicycle</option>
                      <option value="walk">Walking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Estimated Car Usage (miles/week)</label>
                    <input aria-label="Estimated Car Usage" type="number" {...register('carUsage', { valueAsNumber: true })} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-primary outline-none transition-all" />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Energy Source</label>
                    <select aria-label="Energy Source" {...register('homeEnergy')} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-primary outline-none transition-all">
                      <option value="fossil">Mostly Fossil Fuels</option>
                      <option value="mixed">Mixed</option>
                      <option value="renewable">100% Renewable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Monthly Electricity (kWh)</label>
                    <input aria-label="Monthly Electricity" type="number" {...register('energyUsage', { valueAsNumber: true })} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-primary outline-none transition-all" />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Diet Type</label>
                    <select aria-label="Diet Type" {...register('diet')} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-primary outline-none transition-all">
                      <option value="meat-heavy">Meat Heavy (Every meal)</option>
                      <option value="balanced">Balanced (Some meat)</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Shopping Habits</label>
                    <select aria-label="Shopping Habits" {...register('shopping')} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-primary outline-none transition-all">
                      <option value="frequent">Frequent (Fast Fashion)</option>
                      <option value="average">Average</option>
                      <option value="rare">Rare / Essential only</option>
                      <option value="second-hand">Mostly Second-hand</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Waste Management</label>
                    <select aria-label="Waste Management" {...register('waste')} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-primary outline-none transition-all">
                      <option value="high">High (Rarely recycle)</option>
                      <option value="average">Average (Recycle basics)</option>
                      <option value="low">Low (Compost + Recycle)</option>
                      <option value="zero-waste">Zero Waste</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Flights per year</label>
                    <input aria-label="Flights per year" type="number" {...register('flights', { valueAsNumber: true })} className="w-full bg-bg-base border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:border-accent-primary outline-none transition-all" />
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
            {currentStep > 0 && (
              <button 
                type="button" 
                onClick={prevStep}
                className="px-6 py-3 rounded-xl bg-bg-surface hover:bg-bg-elevated text-text-primary font-medium transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={18} /> Back
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="ml-auto px-6 py-3 rounded-xl bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 font-bold transition-colors flex items-center gap-2 border border-accent-primary/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
              >
                Next <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                type="submit" 
                className="ml-auto px-8 py-3 rounded-xl bg-success text-bg-base font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                Reveal My World
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
