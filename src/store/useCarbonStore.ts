import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AssessmentData } from '../utils/validationSchema';
import { calculateScore, type ScoreResult } from '../utils/scoringLogic';
import { generateRecommendations, type Recommendation } from '../utils/recommendationsLogic';
import { generateInsight } from '../utils/insightEngine';
import { calculateImpactDiff, type ImpactDiff } from '../utils/impactDiff';

export type Achievement = {
  id: string;
  title: string;
  icon: string;
  unlockedAt: string;
};

type State = {
  // userInputSlice
  assessmentData: AssessmentData | null;
  
  // scoreSlice
  score: ScoreResult | null;
  recommendations: Recommendation[];
  insight: string | null;
  
  // progressSlice
  history: { date: string; score: ScoreResult }[];
  impactDiff: ImpactDiff | null;

  // gamificationSlice
  xp: number;
  ecoLevel: string;
  streak: number;
  lastActionDate: string | null;
  achievements: Achievement[];

  // simulationSlice
  isSimulationMode: boolean;
  simulationData: AssessmentData | null;
  simulationScore: ScoreResult | null;

  // uiSlice
  hasCompletedOnboarding: boolean;
  activePanel: 'dashboard' | 'insights' | 'simulation' | 'gamification';
};

type Actions = {
  submitAssessment: (data: AssessmentData) => void;
  updateSimulation: (data: AssessmentData) => void;
  toggleSimulationMode: (active: boolean) => void;
  setActivePanel: (panel: State['activePanel']) => void;
  logAction: (actionXp: number) => void;
  resetData: () => void;
};

const getEcoLevel = (xp: number) => {
  if (xp >= 1000) return 'Planet Hero';
  if (xp >= 500) return 'Guardian';
  if (xp >= 200) return 'Reducer';
  if (xp >= 50) return 'Aware';
  return 'Beginner';
};

const initialState: State = {
  assessmentData: null,
  score: null,
  recommendations: [],
  insight: null,
  history: [],
  impactDiff: null,
  xp: 0,
  ecoLevel: 'Beginner',
  streak: 0,
  lastActionDate: null,
  achievements: [],
  isSimulationMode: false,
  simulationData: null,
  simulationScore: null,
  hasCompletedOnboarding: false,
  activePanel: 'dashboard'
};

export const useCarbonStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      submitAssessment: (data: AssessmentData) => {
        const newScore = calculateScore(data);
        const recommendations = generateRecommendations(data, newScore);
        const insight = generateInsight(newScore);
        
        const currentHistory = get().history;
        let diff = null;
        if (currentHistory.length > 0) {
          const lastScore = currentHistory[currentHistory.length - 1].score;
          diff = calculateImpactDiff(lastScore, newScore);
        }

        const newHistoryEntry = { date: new Date().toISOString(), score: newScore };

        set(() => ({
          assessmentData: data,
          score: newScore,
          recommendations,
          insight,
          history: [...currentHistory, newHistoryEntry],
          hasCompletedOnboarding: true,
          impactDiff: diff,
          simulationData: data,
          simulationScore: newScore,
          activePanel: 'dashboard'
        }));
        
        get().logAction(50);
      },

      updateSimulation: (data: AssessmentData) => {
        const newSimScore = calculateScore(data);
        set({
          simulationData: data,
          simulationScore: newSimScore
        });
      },

      toggleSimulationMode: (active: boolean) => {
        set((state) => ({
          isSimulationMode: active,
          // Reset simulation data to actual data when turning off
          simulationData: active ? state.simulationData : state.assessmentData,
          simulationScore: active ? state.simulationScore : state.score,
        }));
      },

      setActivePanel: (panel) => set({ activePanel: panel }),

      logAction: (actionXp: number) => {
        const today = new Date().toDateString();
        const state = get();
        
        let newStreak = state.streak;
        if (state.lastActionDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          newStreak = state.lastActionDate === yesterday.toDateString() ? state.streak + 1 : 1;
        }

        const newXp = state.xp + actionXp;
        const newLevel = getEcoLevel(newXp);
        
        const achievements = [...state.achievements];
        
        // Example dynamic achievements
        if (newStreak === 7 && !achievements.find(a => a.id === 'streak-7')) {
          achievements.push({ id: 'streak-7', title: '7-Day Streak', icon: '🔥', unlockedAt: new Date().toISOString() });
        }
        if (newLevel === 'Planet Hero' && !achievements.find(a => a.id === 'planet-hero')) {
          achievements.push({ id: 'planet-hero', title: 'Planet Hero Reached', icon: '🌍', unlockedAt: new Date().toISOString() });
        }

        set({
          xp: newXp,
          ecoLevel: newLevel,
          streak: newStreak,
          lastActionDate: today,
          achievements
        });
      },

      resetData: () => set(initialState)
    }),
    {
      name: 'carbon-craft-premium-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
