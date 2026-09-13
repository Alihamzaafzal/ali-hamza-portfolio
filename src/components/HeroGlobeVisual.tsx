import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiTailwindcss,
  SiLaravel,
  SiFlutter,
} from 'react-icons/si';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { personalInfo, portfolioStats } from '../data/portfolio';
import HolographicGlobeCanvas from './globe/HolographicGlobeCanvas';
import CssGlobeFallback from './globe/CssGlobeFallback';

const orbitTech = [
  { Icon: SiReact, color: '#61DAFB', delay: 0 },
  { Icon: SiNodedotjs, color: '#68A063', delay: 0.4 },
  { Icon: SiMongodb, color: '#47A248', delay: 0.8 },
  { Icon: SiTailwindcss, color: '#38BDF8', delay: 1.2 },
  { Icon: SiLaravel, color: '#FF2D20', delay: 1.6 },
  { Icon: SiFlutter, color: '#54C5F8', delay: 2 },
];

function TechBadges() {
  return (
    <div className="hero-tech-rail hidden lg:flex">
      {orbitTech.map(({ Icon, color, delay }, i) => (
        <motion.div
          key={i}
          className="hero-orbit-badge"
          initial={{ opacity: 0, x: 16, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.5 + delay * 0.12, duration: 0.45 }}
        >
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-black/55 shadow-[0_8px_28px_rgba(0,0,0,0.5)] backdrop-blur-xl transition hover:scale-110"
            style={{ boxShadow: `0 0 22px ${color}33` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ProfileCard() {
  return (
    <motion.div
      className="hero-profile-on-globe hidden lg:block"
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-profile-card">
        <div className="flex items-center gap-3">
          <img
            src="https://github.com/Alihamzaafzal.png"
            alt={personalInfo.name}
            className="h-[52px] w-[52px] rounded-full border-2 border-[#8B5CF6]/50 object-cover"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1 font-space text-[15px] font-semibold text-white">
              {personalInfo.name}
              <BadgeCheck className="h-4 w-4 shrink-0 text-[#32C5FF]" aria-hidden="true" />
            </p>
            <p className="text-xs text-white/50">Full Stack Engineer</p>
          </div>
        </div>
        <div className="mt-3.5 grid grid-cols-3 gap-1 border-t border-white/10 pt-3">
          {[
            { value: portfolioStats.projects, label: 'Projects' },
            { value: portfolioStats.years, label: 'Years' },
            { value: portfolioStats.satisfaction, label: 'Satisfaction' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-space text-sm font-bold text-white">{s.value}</p>
              <p className="text-[9px] text-white/45">{s.label}</p>
            </div>
          ))}
        </div>
        <a
          href="#projects"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF2E88] to-[#8B5CF6] py-2 text-xs font-semibold text-white transition hover:brightness-110"
        >
          View My Work <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}

function CodeSnippet() {
  return (
    <motion.div
      className="hero-code-on-globe hidden md:block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.55 }}
    >
      <div className="hero-code-card font-mono text-[9px] leading-relaxed">
        <code>
          <span className="text-white/40">{'{'}</span>
          <br />
          <span className="text-[#32C5FF]"> name</span>
          <span className="text-white/40">: </span>
          <span className="text-[#FF2E88]">&quot;Ali Hamza&quot;</span>
          <span className="text-white/40">,</span>
          <br />
          <span className="text-[#32C5FF]"> stack</span>
          <span className="text-white/40">: [</span>
          <span className="text-[#FF2E88]">&quot;React&quot;</span>
          <span className="text-white/40">, ...],</span>
          <br />
          <span className="text-[#32C5FF]"> passion</span>
          <span className="text-white/40">: </span>
          <span className="text-[#FF2E88]">&quot;premium UX&quot;</span>
          <br />
          <span className="text-white/40">{'}'}</span>
        </code>
      </div>
    </motion.div>
  );
}

export default function HeroGlobeVisual() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <div className="hero-globe-bg" aria-hidden="true">
      <div className="hero-globe-wrap">
        <div className="hero-globe-ring" aria-hidden="true" />
        <div className="hero-globe-canvas absolute inset-0">
          {reducedMotion ? (
            <CssGlobeFallback />
          ) : (
            <Suspense fallback={<CssGlobeFallback />}>
              <HolographicGlobeCanvas transparent />
            </Suspense>
          )}
        </div>

        <TechBadges />
        <ProfileCard />
        <CodeSnippet />
      </div>
    </div>
  );
}
