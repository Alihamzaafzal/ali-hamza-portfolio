import { useRef, useEffect, useState } from 'react';
import { playPopSound } from '../utils/audio';

/* Tech icons as inline SVGs — color-matched per technology */
const TECH_ICONS: Record<string, { svg: string; color: string }> = {
  'React.js':           { color: '#61DAFB', svg: '<circle cx="12" cy="12" r="2.05"/><ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" stroke-width="1.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" stroke-width="1.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" stroke-width="1.2" transform="rotate(120 12 12)"/>' },
  'Node.js':            { color: '#68A063', svg: '<path stroke="currentColor" stroke-width="1.4" fill="none" d="M12 2 L20 6.5 L20 17.5 L12 22 L4 17.5 L4 6.5 Z"/><path stroke="currentColor" stroke-width="1.4" fill="none" d="M9 14.5c0 1.1.9 1.5 2 1.5s2.5-.5 2.5-2c0-2.8-4.5-1.5-4.5-4 0-1.3 1-2 2.5-2 1.2 0 2.2.5 2.5 1.5"/>' },
  'TypeScript':         { color: '#3178C6', svg: '<rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.3"/><path stroke="currentColor" stroke-width="1.4" fill="none" d="M7 10h10M12 10v7"/><path stroke="currentColor" stroke-width="1.4" fill="none" d="M15 14.5c0 1.4-1.1 2.5-2.5 2.5"/>' },
  'Next.js':            { color: '#E2E8F0', svg: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.3"/><path stroke="currentColor" stroke-width="1.5" fill="none" d="M9 8l7 8"/><path stroke="currentColor" stroke-width="1.3" fill="none" d="M9 8v8"/>' },
  'Express':            { color: '#D7E2EA', svg: '<path stroke="currentColor" stroke-width="1.3" fill="none" d="M3 6h18M3 12h12M3 18h15"/>' },
  'Laravel & PHP':      { color: '#FF2D20', svg: '<path stroke="currentColor" stroke-width="1.3" fill="none" d="M12 2l8 4.5v11L12 22 4 17.5V6.5L12 2z"/><path stroke="currentColor" stroke-width="1.3" fill="none" d="M12 2v20M4 6.5l8 5.5 8-5.5"/>' },
  'MongoDB':            { color: '#47A248', svg: '<path stroke="currentColor" stroke-width="1.4" fill="none" d="M12 2c-2 0-5 3-5 9s3 10 5 11c2-1 5-5 5-11S14 2 12 2z"/><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="1.4"/>' },
  'PostgreSQL & MySQL': { color: '#336791', svg: '<ellipse cx="12" cy="7" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="1.3"/><path stroke="currentColor" stroke-width="1.3" fill="none" d="M5 7v10a7 3 0 0014 0V7"/>' },
  'Flutter & Dart':     { color: '#54C5F8', svg: '<path stroke="currentColor" stroke-width="1.4" fill="none" d="M5 20L15 10 10 5l-5 5 5 5-5 5z"/><path stroke="currentColor" stroke-width="1.4" fill="none" d="M10 15l5 5"/>' },
  'Tailwind CSS':       { color: '#38BDF8', svg: '<path stroke="currentColor" stroke-width="1.4" fill="none" d="M6 9c.5-3 2.5-4 5-4 4 0 4.5 3 7 3.5-1.5.5-3 1-4 3C13 15 11 16 8 16c-3.5 0-5-3-5-3.5 1.5 0 2.5-.5 3-3.5z"/>' },
  'REST APIs':          { color: '#A855F7', svg: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.4"/><path stroke="currentColor" stroke-width="1.3" fill="none" d="M12 2v4M12 18v4M2 12h4M18 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>' },
  'Git & Vercel':       { color: '#E2E8F0', svg: '<circle cx="6" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="18" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="6" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path stroke="currentColor" stroke-width="1.4" fill="none" d="M6 8v8M8 6h8M8 18L16 6"/>' },
};

const ROW2_ICON_COLORS: Record<string, string> = {
  'UI/UX Architecture':      '#E879F9',
  'Component Systems':       '#38BDF8',
  'WebGL & Three.js':        '#F59E0B',
  'Motion Engineering':      '#10B981',
  'Responsive Ergonomics':   '#A855F7',
  'Design Systems':          '#06B6D4',
  'Cloud Architecture':      '#38BDF8',
  'Performance Optimization':'#F59E0B',
  'Full Stack Systems':      '#00F0FF',
  'Clean Code Principles':   '#10B981',
};

const row1Items = [
  'React.js', 'Node.js', 'TypeScript', 'Next.js', 'Express',
  'Laravel & PHP', 'MongoDB', 'PostgreSQL & MySQL', 'Flutter & Dart',
  'Tailwind CSS', 'REST APIs', 'Git & Vercel',
];

const row2Items = [
  'UI/UX Architecture', 'Component Systems', 'WebGL & Three.js',
  'Motion Engineering', 'Responsive Ergonomics', 'Design Systems',
  'Cloud Architecture', 'Performance Optimization', 'Full Stack Systems',
  'Clean Code Principles',
];

function TechIcon({ item, color }: { item: string; color: string }) {
  const icon = TECH_ICONS[item];
  if (!icon) return <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />;
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0"
      style={{ color: icon.color }}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
      aria-hidden="true"
    />
  );
}

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

      setOffset1((prev) => (prev + (speed + scrollBoost) * dt) % 2800);
      setOffset2((prev) => (prev + (speed - scrollBoost) * dt) % 2800);

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

      {/* Row 1 — glide right */}
      <div className="mb-4 overflow-hidden">
        <div
          className="flex gap-3"
          style={{ transform: `translate3d(${-offset1}px, 0, 0)`, willChange: 'transform' }}
        >
          {quadRow1.map((item, idx) => (
            <div
              key={`row1-${idx}`}
              onMouseEnter={() => playPopSound()}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-[#111318] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#E2E8F0] shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#00F0FF]/40 hover:bg-[#151922] transition-colors cursor-default"
            >
              <TechIcon item={item} color="#10B981" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — glide left */}
      <div className="overflow-hidden">
        <div
          className="flex gap-3"
          style={{ transform: `translate3d(${offset2 - 1400}px, 0, 0)`, willChange: 'transform' }}
        >
          {quadRow2.map((item, idx) => {
            const color = ROW2_ICON_COLORS[item] ?? '#38BDF8';
            return (
              <div
                key={`row2-${idx}`}
                onMouseEnter={() => playPopSound()}
                className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-[#111318] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#E2E8F0] shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-[#D946EF]/40 hover:bg-[#151922] transition-colors cursor-default"
              >
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
