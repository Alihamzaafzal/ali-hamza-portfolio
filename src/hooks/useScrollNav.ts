import { createContext, useContext } from 'react';

type ScrollContextValue = {
  scrollTo: (target: string, offset?: number) => void;
};

export const ScrollContext = createContext<ScrollContextValue | null>(null);

export function useScrollNav() {
  const ctx = useContext(ScrollContext);
  if (!ctx) {
    return {
      scrollTo: (target: string) => {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    };
  }
  return ctx;
}
