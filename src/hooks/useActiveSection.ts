import { useEffect, useState } from 'react';

/** Tracks which section is currently in view for navbar highlighting. */
export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id.replace('#', '')))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId = 'hero';
        let bestRatio = 0;

        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestRatio > 0) setActiveId(bestId);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.55, 0.75] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
