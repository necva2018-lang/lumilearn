import React, { createContext, useContext, useState, useEffect } from 'react';

export interface HeroCoverConfig {
  badgeText: string;
  headlinePrefix: string;
  headlineHighlight: string;
  headlineSuffix: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

const DEFAULT_HERO: HeroCoverConfig = {
  badgeText: '全新的學習方式',
  headlinePrefix: '學習對您 ',
  headlineHighlight: '至關重要的',
  headlineSuffix: '技能。',
  description: '由行業專家教授的高品質個人課程。按照自己的步調探索創意、商業、科技等領域。',
  primaryButtonText: '探索課程',
  secondaryButtonText: '在 LumiLearn 上教學',
};

const STORAGE_KEY = 'lumilearn_hero_cover';

interface HeroCoverContextType {
  config: HeroCoverConfig;
  setConfig: (c: HeroCoverConfig) => void;
  updateConfig: (partial: Partial<HeroCoverConfig>) => void;
}

const HeroCoverContext = createContext<HeroCoverContextType | undefined>(undefined);

export function HeroCoverProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<HeroCoverConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<HeroCoverConfig>;
        return { ...DEFAULT_HERO, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse hero cover config', e);
    }
    return DEFAULT_HERO;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const setConfig = (c: HeroCoverConfig) => setConfigState(c);
  const updateConfig = (partial: Partial<HeroCoverConfig>) =>
    setConfigState(prev => ({ ...prev, ...partial }));

  return (
    <HeroCoverContext.Provider value={{ config, setConfig, updateConfig }}>
      {children}
    </HeroCoverContext.Provider>
  );
}

export function useHeroCover() {
  const ctx = useContext(HeroCoverContext);
  if (!ctx) throw new Error('useHeroCover must be used within HeroCoverProvider');
  return ctx;
}

export { DEFAULT_HERO };
