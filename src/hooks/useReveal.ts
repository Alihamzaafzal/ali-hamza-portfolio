import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

/** Scroll-driven reveals: fade-up, stagger, clip headings, directional cards, counters */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      gsap.utils.toArray<HTMLElement>('.reveal-up', root).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.reveal-heading', root).forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0, y: 24 },
          {
            clipPath: 'inset(0 0 0% 0)',
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.reveal-stagger', root).forEach((group) => {
        const items = group.querySelectorAll('.reveal-item');
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.reveal-stagger-x', root).forEach((group) => {
        const items = group.querySelectorAll('.reveal-item');
        items.forEach((item, i) => {
          const fromX = i % 2 === 0 ? -48 : 48;
          gsap.fromTo(
            item,
            { autoAlpha: 0, x: fromX, y: 20 },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: { trigger: item, start: 'top 88%', once: true },
            },
          );
        });
      });

      gsap.utils.toArray<HTMLElement>('.reveal-count', root).forEach((el) => {
        const target = parseInt(el.dataset.count ?? '0', 10);
        const pad = el.dataset.pad === '2';
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            const n = Math.round(counter.val);
            el.textContent = pad ? String(n).padStart(2, '0') : String(n);
          },
        });
      });
    },
    { scope },
  );
}
