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

const R = 18;
const CIRCUMFERENCE = 2 * Math.PI * R;
const ARC_RATIO = 0.75; // 270° arc
const ARC_LENGTH = CIRCUMFERENCE * ARC_RATIO;
const GAP = CIRCUMFERENCE * (1 - ARC_RATIO);

/** Premium radial arc gauge per skill */
function ArcGauge({
  level,
  inView,
  color = 'url(#arc-grad)',
}: {
  level: number;
  inView: boolean;
  color?: string;
}) {
  const offset = inView
    ? ARC_LENGTH * (1 - level / 100)
    : ARC_LENGTH;

  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      className="shrink-0"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle
        cx="22"
        cy="22"
        r={R}
        className="arc-gauge-track"
        strokeWidth="3"
        strokeDasharray={`${ARC_LENGTH} ${GAP}`}
        strokeDashoffset={0}
        style={{ transform: 'rotate(135deg)', transformOrigin: '22px 22px' }}
      />
      {/* Fill */}
      <circle
        cx="22"
        cy="22"
        r={R}
        className="arc-gauge-fill"
        strokeWidth="3"
        stroke={color}
        strokeDasharray={`${ARC_LENGTH} ${GAP}`}
        strokeDashoffset={offset}
        style={{
          transform: 'rotate(135deg)',
          transformOrigin: '22px 22px',
          transitionDelay: inView ? '0.1s' : '0s',
          filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.6))',
        }}
      />
      {/* Percentage label */}
      <text
        x="22"
        y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="8"
        fontWeight="600"
        fontFamily="Space Grotesk, monospace"
      >
        {level}
      </text>
    </svg>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

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
        <ul className="mt-5 space-y-4 border-t border-white/10 pt-4">
          {category.skills.map((skill) => (
            <li key={skill.name} className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#D7E2EA] flex-1 min-w-0 truncate">{skill.name}</span>
              <ArcGauge level={skill.level} inView={isInView} />
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}
