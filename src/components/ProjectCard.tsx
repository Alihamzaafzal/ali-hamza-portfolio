import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ExternalLink,
  Lock,
  Sparkles,
  Layers,
  ArrowUpRight,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { playPopSound } from '../utils/audio';
import { triggerParticleBurst } from '../utils/particles';

export interface ProjectData {
  id: number;
  title: string;
  featured?: boolean;
  category: string;
  filterCategory?: string;
  domain: string;
  overview: string;
  problem?: string;
  solution?: string;
  features: string[];
  challenges?: string;
  results?: string;
  tech: string[];
  link: string;
  github?: string;
  isPrivate?: boolean;
  privateReason?: string;
  image: string;
}

const statusToneConfig: Record<number, { color: string; label: string; bg: string; border: string }> = {
  1: { color: '#06B6D4', label: 'PCI-DSS & Live Sync', bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.3)' },
  2: { color: '#F59E0B', label: 'Real Estate CRM Active', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  3: { color: '#8B5CF6', label: 'WebGL Shader Engine', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)' },
  4: { color: '#F87171', label: 'Laravel Controller Active', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
  5: { color: '#3B82F6', label: 'MySQL Enterprise Flow', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  6: { color: '#FB923C', label: 'Breaking News Feed', bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)' },
  7: { color: '#0EA5E9', label: 'Enterprise Marketing', bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.3)' },
  8: { color: '#38BDF8', label: 'Flight Radar Connected', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)' },
  9: { color: '#D97706', label: 'Culinary Menu Live', bg: 'rgba(217,119,6,0.12)', border: 'rgba(217,119,6,0.3)' },
};

export default function ProjectCard({
  project,
  index,
  totalCards,
  onSelectProject,
}: {
  project: ProjectData;
  index: number;
  totalCards: number;
  onSelectProject?: (project: ProjectData) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgHovered, setImgHovered] = useState(false);
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 3.5}deg) rotateX(${-y * 3.5}deg)`;
  };

  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  };

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(1.5px)']);

  const tone = statusToneConfig[project.id] || {
    color: '#34D399',
    label: 'Production Deployed',
    bg: 'rgba(52,211,153,0.12)',
    border: 'rgba(52,211,153,0.3)',
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '50px' }}
      transition={{
        duration: 0.8,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="sticky w-full"
      style={{
        top: `calc(5.5rem + ${index * 28}px)`,
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{ scale, opacity, filter: blur, transformOrigin: 'top center', willChange: 'transform, opacity' }}
        className="will-change-transform"
      >
        <div
          onMouseMove={handleTiltMove}
          onMouseLeave={handleTiltLeave}
          className="group relative overflow-hidden rounded-[28px] md:rounded-[36px] border border-white/12 bg-[#111318] shadow-[0_24px_64px_rgba(0,0,0,0.7)] transition-transform duration-200 ease-out"
        >
        {/* Top specular edge highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* macOS Browser Window Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0A0C12] px-6 py-3.5">
          {/* macOS 3-dot traffic lights */}
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-[0_0_6px_rgba(255,95,86,0.4)]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_rgba(255,189,46,0.4)]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-[0_0_6px_rgba(39,201,63,0.4)]" />
          </div>

          {/* SSL Lock & Verified Domain Pill */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0C0C0C] px-4 py-1 text-xs shadow-inner">
            <Lock className="h-3 w-3 text-[#10B981]" />
            <span className="font-mono text-[11px] tracking-wide text-[#D7E2EA]">
              https://{project.domain || 'ali-hamza.dev'}
            </span>
          </div>

          {/* Live Status Pill in Header */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: tone.color }}
              />
              {tone.label}
            </span>
          </div>
        </div>

        {/* Card Content Grid */}
        <div className="grid grid-cols-1 gap-8 p-6 md:p-9 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Details & Live Project CTA (5 Cols) */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-[#A0AEC0]">0{index + 1} / 0{totalCards}</span>
                <span
                  className="rounded-full px-3 py-0.5 text-xs font-medium tracking-wide uppercase"
                  style={{ backgroundColor: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}
                >
                  {project.category}
                </span>
                {project.featured && (
                  <span className="flex items-center gap-1 rounded-full border border-[#BE4C00]/40 bg-[#BE4C00]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF9E40]">
                    <Sparkles className="h-2.5 w-2.5" /> Featured
                  </span>
                )}
              </div>

              <h3 className="mt-4 font-syne text-2xl font-bold tracking-tight text-white md:text-3xl">
                {project.title}
              </h3>

              <p className="mt-4 text-sm leading-[1.75] text-[#B0BEC5] md:text-base">
                {project.overview}
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <p className="text-[11px] font-semibold tracking-wider text-[#A0AEC0] uppercase">
                Core Capabilities
              </p>
              <ul className="grid grid-cols-1 gap-1.5 text-sm text-[#D7E2EA]">
                {project.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: tone.color }}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-white/10 bg-[#0C0C0C]/80 px-2.5 py-1 text-xs text-[#D7E2EA] shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Action Buttons: Live Project, GitHub / NDA, & Case Study Modal */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all duration-200 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #18011F 0%, #7621B0 50%, #BE4C00 100%)',
                    boxShadow: '0 4px 14px rgba(118, 33, 176, 0.35)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <span>Live Project</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </a>
              ) : (
                <span className="text-xs text-[#A0AEC0]">Deployment in progress</span>
              )}

              {/* Case Study Details Button */}
              <button
                type="button"
                onClick={(e) => {
                  playPopSound();
                  triggerParticleBurst(e.clientX, e.clientY, 12);
                  onSelectProject?.(project);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/10 active:scale-95"
              >
                <Eye className="h-3.5 w-3.5 text-[#00F0FF]" />
                <span>Case Study</span>
              </button>

              {/* GitHub vs NDA Pill */}
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0C0C0C] px-3.5 py-2 text-xs font-medium text-[#A0AEC0] transition hover:border-white/25 hover:text-white"
                >
                  <span>Code</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : project.isPrivate ? (
                <span
                  title={project.privateReason || 'Proprietary Commercial Code (NDA Protected)'}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[11px] font-medium text-amber-300/90 cursor-help"
                >
                  <ShieldCheck className="h-3 w-3 text-amber-400" />
                  <span>Enterprise NDA</span>
                </span>
              ) : null}

              {project.domain && (
                <a
                  href={`https://${project.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A0AEC0] transition hover:text-white"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>{project.domain}</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Screenshot (7 Cols) */}
          <div className="relative lg:col-span-7">
            <div
              data-cursor="view"
              className="group/screenshot relative aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
              onClick={(e) => {
                playPopSound();
                triggerParticleBurst(e.clientX, e.clientY, 14);
                onSelectProject?.(project);
              }}
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
            >
              {/* Click to expand overlay hover badge */}
              <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-250 group-hover/screenshot:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0C0E14]/90 px-4 py-2 text-xs font-semibold text-white shadow-2xl">
                  <Eye className="h-3.5 w-3.5 text-[#00F0FF]" />
                  <span>Inspect Case Study</span>
                </span>
              </div>
              {/* Continuous UI Element Animations Inside the Mockups */}
              
              {/* SimpliFi Go: Live Sync Pulse Badge */}
              {project.id === 1 && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2 rounded-full border border-[#10B981]/40 bg-[#0C0C0C]/90 px-3 py-1.5 backdrop-blur-md shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-[#34D399] tracking-wider uppercase">
                    Live Sync
                  </span>
                </div>
              )}

              {/* Real Software: Live Market Feed Pulse */}
              {project.id === 2 && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2 rounded-full border border-[#F59E0B]/40 bg-[#0C0C0C]/90 px-3 py-1.5 backdrop-blur-md shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E0B] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F59E0B]" />
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-[#F59E0B] tracking-wider uppercase">
                    MLS Real-Time
                  </span>
                </div>
              )}

              {/* Insight 3D: Continuous 3D Wireframe Orbit */}
              {project.id === 3 && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2.5 rounded-full border border-[#8B5CF6]/40 bg-[#0C0C0C]/90 px-3 py-1.5 backdrop-blur-md shadow-lg">
                  <div className="relative h-4 w-4 animate-spin [animation-duration:12s]">
                    <svg viewBox="0 0 24 24" className="h-full w-full stroke-[#8B5CF6] fill-none stroke-[1.75]">
                      <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
                      <ellipse cx="12" cy="12" rx="9" ry="3.5" className="opacity-90" />
                      <ellipse cx="12" cy="12" rx="3.5" ry="9" className="opacity-70" />
                    </svg>
                  </div>
                  <span className="font-mono text-[10px] font-semibold text-[#A855F7] tracking-wider uppercase">
                    Wireframe Orbit
                  </span>
                </div>
              )}

              {/* Johnstown Courier: Breaking News Live Pulse Alert */}
              {project.id === 6 && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2 rounded-full border border-red-500/40 bg-[#0C0C0C]/90 px-3 py-1.5 backdrop-blur-md shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  <span className="font-mono text-[10px] font-bold text-red-400 tracking-wider uppercase">
                    Breaking News
                  </span>
                </div>
              )}

              {/* Skybound Flights: Flight Radar Live Pulse */}
              {project.id === 8 && (
                <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2 rounded-full border border-[#38BDF8]/40 bg-[#0C0C0C]/90 px-3 py-1.5 backdrop-blur-md shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#38BDF8]" />
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-[#38BDF8] tracking-wider uppercase">
                    Flight Radar
                  </span>
                </div>
              )}

              {/* Screenshot Image */}
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover object-top transition-all duration-700 ease-out group-hover/screenshot:scale-[1.03]"
                style={{
                  filter: imgHovered ? 'grayscale(0%) contrast(105%)' : 'grayscale(50%) contrast(95%)',
                }}
                loading="lazy"
              />

              {/* Vignette glass overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/70 via-transparent to-black/15" />

              {/* Secondary Viewport / Floating Live Node Bar */}
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/15 bg-[#0C0C0C]/90 px-4 py-2.5 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ backgroundColor: tone.bg }}
                  >
                    <Layers className="h-3.5 w-3.5" style={{ color: tone.color }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-white tracking-wide">
                      {project.title} Production Viewport
                    </p>
                    <p className="text-[9px] text-[#A0AEC0]">
                      Global Edge Infrastructure
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-mono font-bold text-white">99.9%</p>
                    <p className="text-[8px] text-[#A0AEC0] uppercase tracking-wider">Uptime</p>
                  </div>
                  <div
                    className="h-2 w-2 rounded-full animate-ping"
                    style={{ backgroundColor: tone.color }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
