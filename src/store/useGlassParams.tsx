import { createContext, useContext, useState, ReactNode } from 'react';
import { GlassParams, DEFAULT_GLASS_PARAMS } from '@/components/LiquidGlassControls';

interface GlassParamsContextValue {
  params: GlassParams;
  setParams: (params: GlassParams) => void;
}

const GlassParamsContext = createContext<GlassParamsContextValue>({
  params: DEFAULT_GLASS_PARAMS,
  setParams: () => {},
});

export function GlassParamsProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useState<GlassParams>(DEFAULT_GLASS_PARAMS);

  return (
    <GlassParamsContext.Provider value={{ params, setParams }}>
      {children}
    </GlassParamsContext.Provider>
  );
}

export function useGlassParams() {
  return useContext(GlassParamsContext);
}
