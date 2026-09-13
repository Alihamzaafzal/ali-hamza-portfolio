import { useRef, type MouseEvent } from 'react';
import {
  Monitor,
  Server,
  Smartphone,
  Database,
  Cloud,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { skillCategories } from '../data/portfolio';
import DualMarquee from './DualMarquee';
import FadeIn from './FadeIn';
import { useInView } from 'framer-motion';
import { playPopSound } from '../utils/audio';
import { triggerParticleBurst } from '../utils/particles';

const iconMap = {
  Monitor,
  Server,
  Smartphone,
  Database,
  Cloud,
  Sparkles,
} as const;

/* ═══ #7: Animated Progress Bar ═══ */
function ProgressBar({ level, inView }: { level: number; inView: boolean }) {
  return (
    <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#06B6D4] to-[#A855F7] transition-all duration-1000 ease-out"
        style={{ width: inView ? `${level}%` : '0%' }}
      />
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  /* ═══ #13: Spotlight mouse glow handler ═══ */
  const handleSpotlight = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="site-section relative bg-[#0C0C0C] px-6 py-28 lg:px-12"
    >
      <div className="section-shell mx-auto max-w-7xl">
        <div className="section-header text-center max-w-2xl mx-auto mb-14">
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xs font-semibold tracking-[0.28em] text-[#A0AEC0] uppercase">
              Technical Disciplines
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <h2 className="hero-heading mt-3 font-syne text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Technologies &amp; Architecture
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="mt-5 text-base leading-relaxed text-[#B0BEC5] lg:text-lg">
              Modern web platforms engineered with a full-stack production toolkit.
            </p>
          </FadeIn>
        </div>

        {/* Dual-Directional Scroll Velocity Marquee */}
        <DualMarquee />

        {/* Category breakdown */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] ?? Sparkles;
            return (
              <SkillCard
                key={category.name}
                category={category}
                Icon={Icon}
                index={index}
                onSpotlight={handleSpotlight}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Separated card component so useInView works per-card */
function SkillCard({
  category,
  Icon,
  index,
  onSpotlight,
}: {
  category: (typeof skillCategories)[number];
  Icon: LucideIcon;
  index: number;
  onSpotlight: (e: MouseEvent<HTMLDivElement>) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '0px 0px -30px 0px' });

  return (
    <FadeIn
      direction="up"
      delay={0.1 + index * 0.08}
    >
      <div
        ref={cardRef}
        onClick={(e) => {
          playPopSound();
          triggerParticleBurst(e.clientX, e.clientY, 10);
        }}
        className="spotlight-card cursor-pointer rounded-[24px] border border-white/10 bg-[#111318] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
        onMouseMove={onSpotlight}
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#0C0C0C] text-[#38BDF8]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="font-syne text-xl font-bold text-white">
          {category.name}
        </h3>
        <ul className="mt-5 space-y-3.5 border-t border-white/10 pt-4">
          {category.skills.map((skill) => (
            <li key={skill.name}>
              <div className="flex items-center justify-between text-sm text-[#D7E2EA] mb-1.5">
                <span>{skill.name}</span>
                <span className="font-mono text-xs text-[#A0AEC0]">
                  {skill.level}%
                </span>
              </div>
              {/* ═══ #7: Animated Progress Bar ═══ */}
              <ProgressBar level={skill.level} inView={isInView} />
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}
