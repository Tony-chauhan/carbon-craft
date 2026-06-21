import React, { Suspense } from 'react';
import { useCarbonStore } from './store/useCarbonStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Gamepad2, Settings2, Loader2 } from 'lucide-react';

// Code Splitting for Performance
const AssessmentFlow = React.lazy(() => import('./components/AssessmentFlow').then(m => ({ default: m.AssessmentFlow })));
const Dashboard = React.lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const EcoScene = React.lazy(() => import('./components/EcoScene').then(m => ({ default: m.EcoScene })));
const SimulationPanel = React.lazy(() => import('./components/SimulationPanel').then(m => ({ default: m.SimulationPanel })));
const Gamification = React.lazy(() => import('./components/Gamification').then(m => ({ default: m.Gamification })));

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-accent-primary p-12">
      <Loader2 className="animate-spin mb-4" size={32} aria-label="Loading content" />
      <p className="text-sm text-text-secondary font-medium">Loading experience...</p>
    </div>
  );
}

function App() {
  const { hasCompletedOnboarding, activePanel, setActivePanel } = useCarbonStore();

  return (
    <main className="w-full h-screen flex flex-col md:flex-row bg-bg-base overflow-hidden font-sans">
      
      {/* LEFT: Immersive 3D World */}
      <section className={`relative transition-all duration-1000 ease-in-out ${hasCompletedOnboarding ? 'w-full md:w-[60%]' : 'w-full'} h-[40vh] md:h-full shrink-0 z-0`} aria-label="Interactive 3D Carbon Ecosystem">
        <Suspense fallback={<LoadingFallback />}>
          <EcoScene />
        </Suspense>
        
        {/* Subtle overlay gradient for depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent to-bg-base/80 md:to-bg-base/90"></div>
      </section>

      {/* RIGHT: Glassmorphic Panels & Controls */}
      <section className={`relative transition-all duration-1000 ease-in-out ${hasCompletedOnboarding ? 'w-full md:w-[40%]' : 'w-0 opacity-0'} h-[60vh] md:h-full z-10 flex flex-col`} aria-label="Controls and Insights Panel">
        
        {hasCompletedOnboarding && (
          <>
            {/* Top Navigation */}
            <nav className="flex justify-center gap-4 p-6 shrink-0" aria-label="Main Navigation">
              <NavButton icon={<Activity />} label="Dashboard" isActive={activePanel === 'dashboard'} onClick={() => setActivePanel('dashboard')} />
              <NavButton icon={<Settings2 />} label="Simulation" isActive={activePanel === 'simulation'} onClick={() => setActivePanel('simulation')} />
              <NavButton icon={<Gamepad2 />} label="Journey" isActive={activePanel === 'gamification'} onClick={() => setActivePanel('gamification')} />
            </nav>

            {/* Content Area with Framer Motion transitions */}
            <div className="flex-1 overflow-y-auto px-6 pb-12 custom-scrollbar relative">
              <Suspense fallback={<LoadingFallback />}>
                <AnimatePresence mode="wait">
                  {activePanel === 'dashboard' && (
                    <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <Dashboard />
                    </motion.div>
                  )}
                  {activePanel === 'simulation' && (
                    <motion.div key="sim" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <SimulationPanel />
                    </motion.div>
                  )}
                  {activePanel === 'gamification' && (
                    <motion.div key="game" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <Gamification />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Suspense>
            </div>
          </>
        )}
      </section>

      {/* Full-Screen Onboarding Overlay */}
      <AnimatePresence>
        {!hasCompletedOnboarding && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 z-50 overflow-y-auto bg-bg-base/70 backdrop-blur-2xl flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <Suspense fallback={<LoadingFallback />}>
              <AssessmentFlow />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
      
    </main>
  );
}

function NavButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      aria-label={label}
      aria-pressed={isActive}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border focus:ring-2 focus:ring-accent-primary focus:outline-none ${
        isActive 
          ? 'bg-accent-primary/10 border-accent-primary/50 text-accent-primary shadow-[0_0_15px_rgba(50,215,75,0.2)]' 
          : 'bg-bg-surface/50 border-white/5 text-text-secondary hover:text-text-primary hover:bg-bg-surface'
      }`}
    >
      <span className="w-4 h-4" aria-hidden="true">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default App;
