import { useMemo, useRef, type CSSProperties } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

function LoaderSpaceBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 140 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2.2 + 0.4,
        delay: Math.random() * 5,
        duration: 1.8 + Math.random() * 3.5,
        drift: 12 + Math.random() * 28,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-ink" />

      {stars.map((star) => (
        <span
          key={star.id}
          className="loader-star absolute rounded-full bg-white"
          style={
            {
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              '--star-drift': `${star.drift}px`,
            } as CSSProperties
          }
        />
      ))}

      <div className="loader-earth absolute top-1/2 left-1/2 h-[min(88vmin,640px)] w-[min(88vmin,640px)] -translate-x-1/2 -translate-y-1/2">
        <img
          src="/earth-blue-marble.jpg"
          alt=""
          className="h-full w-full rounded-full object-cover opacity-55 shadow-[0_0_120px_rgba(56,189,248,0.45)]"
        />
        <div className="absolute inset-0 animate-spin-slow rounded-full bg-[radial-gradient(circle_at_28%_28%,rgba(186,230,253,0.2),transparent_42%)]" />
        <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.28),transparent_65%)]" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
    </div>
  );
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete,
          });
        },
      });

      tl.from('.loader-char', {
        y: 60,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power3.out',
      })
        .from(
          '.loader-sub',
          { y: 16, autoAlpha: 0, duration: 0.45, ease: 'power2.out' },
          '-=0.2',
        )
        .to('.loader-progress', {
          width: '100%',
          duration: 0.9,
          ease: 'power2.inOut',
        });
    },
    { scope: containerRef },
  );

  const name = 'ALI HAMZA';

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-ink"
    >
      <LoaderSpaceBackground />

      <div className="relative z-10 mb-6 flex overflow-hidden">
        {name.split('').map((char, i) => (
          <span
            key={i}
            className="loader-char inline-block font-syne text-5xl font-bold tracking-wider text-white md:text-7xl"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      <p className="loader-sub relative z-10 mb-8 text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] text-muted uppercase text-center px-4">
        Full Stack Engineer &amp; AI Agent Developer
      </p>
      <div className="relative z-10 h-0.5 w-48 overflow-hidden rounded-full bg-white/10 md:w-64">
        <div className="loader-progress h-full w-0 bg-gradient-to-r from-sky-light via-sky to-purple" />
      </div>
    </div>
  );
}
