import { useRef, useEffect, useState } from 'react';
import { playPopSound } from '../utils/audio';

const row1Items = [
  'React.js',
  'Node.js',
  'TypeScript',
  'Next.js',
  'Express',
  'Laravel & PHP',
  'MongoDB',
  'PostgreSQL & MySQL',
  'Flutter & Dart',
  'Tailwind CSS',
  'REST APIs',
  'Git & Vercel',
];

const row2Items = [
  'UI/UX Architecture',
  'Component Systems',
  'WebGL & Three.js',
  'Motion Engineering',
  'Responsive Ergonomics',
  'Design Systems',
  'Cloud Architecture',
  'Performance Optimization',
  'Full Stack Systems',
  'Clean Code Principles',
];

export default function DualMarquee() {
  const [offset1, setOffset1] = useState(0);
  const [offset2, setOffset2] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const animRef = useRef<number | null>(null);
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    let lastTime = performance.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      scrollVelocityRef.current = delta * 0.4;
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Decay scroll velocity smoothly
      scrollVelocityRef.current *= 0.92;

      // Base autonomous speed + scroll acceleration
      const speed = isHovered ? 4 : 32 + Math.abs(scrollVelocityRef.current) * 15;
      const scrollBoost = scrollVelocityRef.current * 20;

      setOffset1((prev) => (prev + (speed + scrollBoost) * dt) % 2400);
      setOffset2((prev) => (prev + (speed - scrollBoost) * dt) % 2400);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isHovered]);

  const quadRow1 = [...row1Items, ...row1Items, ...row1Items, ...row1Items];
  const quadRow2 = [...row2Items, ...row2Items, ...row2Items, ...row2Items];

  return (
    <div
      className="relative w-full overflow-hidden py-10 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Edge gradient masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 md:w-48 bg-gradient-to-r from-[#0C0C0C] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 md:w-48 bg-gradient-to-l from-[#0C0C0C] to-transparent" />

      {/* Row 1 - Autonomous glide right with scroll speedup */}
      <div className="mb-4 overflow-hidden">
        <div
          className="flex gap-4"
          style={{
            transform: `translate3d(${-offset1}px, 0, 0)`,
            willChange: 'transform',
          }}
        >
          {quadRow1.map((item, idx) => (
            <div
              key={`row1-${idx}`}
              onMouseEnter={() => playPopSound()}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-[#111318] px-5 py-2.5 text-xs sm:text-sm font-medium text-[#E2E8F0] shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#00F0FF]/40 hover:bg-[#151922] transition-colors cursor-default"
            >
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 - Autonomous glide left with scroll speedup */}
      <div className="overflow-hidden">
        <div
          className="flex gap-4"
          style={{
            transform: `translate3d(${offset2 - 1200}px, 0, 0)`,
            willChange: 'transform',
          }}
        >
          {quadRow2.map((item, idx) => (
            <div
              key={`row2-${idx}`}
              onMouseEnter={() => playPopSound()}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-[#111318] px-5 py-2.5 text-xs sm:text-sm font-medium text-[#E2E8F0] shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#D946EF]/40 hover:bg-[#151922] transition-colors cursor-default"
            >
              <span className="h-2 w-2 rounded-full bg-[#38BDF8]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
