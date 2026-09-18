import { useMemo, useRef, useState, type CSSProperties } from 'react';
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

/* Luxury straight loading progress line */
function StraightProgressBar({ progress }: { progress: number }) {
  const rounded = Math.round(progress);

  let statusText = 'INITIALIZING SYSTEM ARCHITECTURE...';
  if (rounded > 35 && rounded <= 70) {
    statusText = 'COMPILING NEURAL INTERFACES...';
  } else if (rounded > 70 && rounded < 100) {
    statusText = 'CALIBRATING QUANTUM RENDERING...';
  } else if (rounded >= 100) {
    statusText = 'SYSTEM OPERATIONAL · WELCOME';
  }

  return (
    <div className="relative z-10 w-72 sm:w-96 max-w-[85vw] flex flex-col gap-2.5">
      {/* Top Meta HUD: Status Label & Percentage */}
      <div className="flex items-center justify-between font-mono text-[11px] tracking-wider text-[#A0AEC0]">
        <span className="flex items-center gap-1.5 truncate pr-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] animate-pulse shrink-0" />
          <span className="text-white/80">{statusText}</span>
        </span>
        <span className="font-semibold text-[#00F0FF] tabular-nums shrink-0">
          {rounded}%
        </span>
      </div>

      {/* Progress Track & Bar */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        {/* Glow fill bar */}
        <div
          className="h-full rounded-full transition-all duration-100 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00F0FF 0%, #38BDF8 35%, #A855F7 70%, #E879F9 100%)',
            boxShadow: '0 0 16px rgba(0, 240, 255, 0.8), 0 0 30px rgba(232, 121, 249, 0.4)',
          }}
        />
        {/* Leading laser spark */}
        <div
          className="absolute top-0 bottom-0 w-8 -translate-x-full rounded-full bg-white/80 blur-[2px]"
          style={{
            left: `${progress}%`,
            transition: 'left 100ms ease-out',
          }}
        />
      </div>

      {/* Bottom Subtext */}
      <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#616E7C] uppercase">
        <span>ALI HAMZA // PORTFOLIO</span>
        <span>v2.6 // PROD</span>
      </div>
    </div>
  );
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      // Animate progress value 0 → 100 over ~1.8s
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate() {
          setProgress(obj.val);
        },
        onComplete() {
          // Brief pause at 100% then fade out
          gsap.to(containerRef.current, {
            autoAlpha: 0,
            duration: 0.5,
            delay: 0.15,
            ease: 'power2.inOut',
            onComplete,
          });
        },
      });

      // Letter stagger — 3D flip-in
      gsap.from('.loader-char', {
        y: 48,
        rotateX: -90,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: 'back.out(1.4)',
        transformOrigin: '50% 100%',
      });

      gsap.from('.loader-sub', {
        y: 14,
        autoAlpha: 0,
        duration: 0.45,
        delay: 0.5,
        ease: 'power2.out',
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

      {/* Name letters */}
      <div className="relative z-10 mb-5 flex overflow-hidden" style={{ perspective: '600px' }}>
        {name.split('').map((char, i) => (
          <span
            key={i}
            className="loader-char inline-block font-syne text-5xl font-bold tracking-wider text-white md:text-7xl"
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      <p className="loader-sub relative z-10 mb-8 text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] text-muted uppercase text-center px-4">
        Full Stack Engineer &amp; AI Agent Developer
      </p>

      {/* Straight line progress bar */}
      <StraightProgressBar progress={progress} />
    </div>
  );
}
