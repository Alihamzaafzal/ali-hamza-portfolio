import { useState } from 'react';
import { personalInfo, education, techStack, portfolioStats } from '../data/portfolio';
import AnimatedText from './AnimatedText';
import AnimatedCounter from './AnimatedCounter';
import FadeIn from './FadeIn';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Sparkles, CheckCircle2, Layers, Server, Database, Activity, Bot } from 'lucide-react';
import { playPopSound } from '../utils/audio';

const ARCHITECTURE_TIERS = [
  {
    id: 'client',
    tier: '01 · CLIENT TIER',
    name: 'Frontend & 3D WebGL',
    icon: Layers,
    color: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.25)',
    techs: ['React 19', 'Next.js', 'Three.js', 'Tailwind', 'GSAP'],
    metrics: 'LCP < 0.6s · 60+ FPS',
    summary: 'Optimized hydration, WebGL shaders, 3D canvases, and hardware-accelerated micro-interactions.',
  },
  {
    id: 'ai-agents',
    tier: '02 · AI ORCHESTRATOR',
    name: 'Autonomous AI Agents',
    icon: Bot,
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.25)',
    techs: ['LangChain', 'Claude & OpenAI APIs', 'RAG Pipelines', 'Function Calling', 'Python'],
    metrics: 'Context Streaming · Multi-Tool',
    summary: 'Goal-driven agentic loops, prompt engineering, structured JSON outputs, and vector RAG retrieval.',
  },
  {
    id: 'gateway',
    tier: '03 · API & COMPUTE',
    name: 'Application Gateway',
    icon: Server,
    color: '#D946EF',
    glow: 'rgba(217, 70, 239, 0.25)',
    techs: ['Node.js', 'Express', 'Laravel PHP', 'REST & GraphQL', 'JWT/OAuth'],
    metrics: 'P99 Latency < 45ms',
    summary: 'Stateless endpoints, WebSockets, resilient rate-limiting, and RBAC authentication.',
  },
  {
    id: 'storage',
    tier: '04 · DATA & DEVOPS',
    name: 'Persistence & Cloud',
    icon: Database,
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.25)',
    techs: ['MongoDB', 'MySQL', 'Redis Cache', 'Git/CI-CD', 'Vercel / Netlify'],
    metrics: '99.98% High Availability',
    summary: 'ACID-compliant schemas, document stores, sub-ms Redis cache, and automated deployment pipelines.',
  },
];

export default function About() {
  const highlights = techStack.slice(0, 10);
  const [activeTier, setActiveTier] = useState<number>(0);

  return (
    <section
      id="about"
      className="site-section relative overflow-hidden bg-[#0C0C0C] px-6 py-28 lg:px-12"
    >
      {/* Floating Corner Icons with diagonal entrance */}
      <motion.div
        initial={{ opacity: 0, x: -80, y: -40 }}
        whileInView={{ opacity: 0.2, x: 0, y: 0 }}
        viewport={{ once: true, margin: '50px' }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="pointer-events-none absolute -left-6 top-16 hidden lg:block text-[#38BDF8]"
      >
        <Terminal className="h-32 w-32 stroke-[0.8]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 80, y: 40 }}
        whileInView={{ opacity: 0.2, x: 0, y: 0 }}
        viewport={{ once: true, margin: '50px' }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="pointer-events-none absolute -right-6 bottom-16 hidden lg:block text-[#A855F7]"
      >
        <Cpu className="h-32 w-32 stroke-[0.8]" />
      </motion.div>

      <div className="section-shell mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 max-w-2xl">
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xs font-semibold tracking-[0.28em] text-[#A0AEC0] uppercase">
              Biography &amp; Philosophy
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <h2 className="hero-heading mt-3 font-syne text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Engineering with Clarity &amp; Craft
            </h2>
          </FadeIn>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Character-by-Character Scroll Reveal Bio */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="rounded-[28px] border border-white/12 bg-[#111318] p-8 md:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1 text-xs font-medium text-[#34D399]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Engineering Philosophy
              </span>

              {/* Character-by-Character Animated Scroll Reveal Paragraph */}
              <div className="mt-8 font-syne text-xl leading-[1.7] text-[#E2E8F0] md:text-2xl lg:text-3xl">
                <AnimatedText text={personalInfo.about} />
              </div>

              <div className="mt-8 border-t border-white/10 pt-6 text-sm text-[#B0BEC5] leading-[1.8]">
                Completed <span className="text-white font-medium">{education.degree}</span> at{' '}
                <span className="text-white font-medium">{education.university}</span> ({education.year}).
                Committed to clean design systems, scalable backend architectures, and delightful micro-interactions.
              </div>
            </div>
          </div>

          {/* Right Column: Key Metrics & Technical Radar */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <FadeIn direction="up" delay={0.3}>
              <div className="rounded-[28px] border border-white/12 bg-[#111318] p-8 shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-syne text-xl font-bold text-white">
                      {personalInfo.name}
                    </h3>
                    <p className="text-sm text-[#A0AEC0]">{personalInfo.title}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3 text-[#38BDF8]" /> Verified
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { value: personalInfo.experience, label: 'Experience' },
                    { value: portfolioStats.projects, label: 'Platforms' },
                    { value: portfolioStats.satisfaction, label: 'Precision' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-[#0C0C0C]/80 p-4 text-center"
                    >
                      <div className="font-syne text-xl font-bold text-white md:text-2xl">
                        <AnimatedCounter value={stat.value} />
                      </div>
                      <div className="mt-1 text-[11px] text-[#A0AEC0] uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Core Disciplines */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="mb-4 text-xs font-semibold tracking-wider text-[#A0AEC0] uppercase">
                    Core Arsenal
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0C0C0C]/60 px-3.5 py-1.5 text-xs text-[#E2E8F0] transition hover:border-white/25"
                      >
                        <CheckCircle2 className="h-3 w-3 text-[#10B981]" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ═══ #7: Interactive Architecture Dataflow Diagram ═══ */}
        <FadeIn direction="up" delay={0.4}>
          <div className="mt-12 rounded-[28px] border border-white/12 bg-[#111318] p-7 md:p-9 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono font-semibold tracking-wider text-[#00F0FF] uppercase">
                  System Architecture Dataflow
                </span>
                <h3 className="font-syne text-xl font-bold text-white md:text-2xl mt-1">
                  End-to-End Execution Pipeline
                </h3>
              </div>
              <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-400">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                <span className="font-mono">Live Circuit · 99.98% SLA</span>
              </div>
            </div>

            {/* Architecture Node Cards with Animated Signal Connectors */}
            <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Animated Connecting Signal Beam SVG (visible on desktop) */}
              <div className="pointer-events-none absolute inset-x-8 top-14 hidden lg:block z-0" aria-hidden="true">
                <svg className="w-full h-8 overflow-visible" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.85" />
                      <stop offset="33%" stopColor="#A855F7" stopOpacity="0.85" />
                      <stop offset="66%" stopColor="#D946EF" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>
                  <line
                    x1="6%"
                    y1="16"
                    x2="94%"
                    y2="16"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                  <line
                    x1="6%"
                    y1="16"
                    x2="94%"
                    y2="16"
                    stroke="url(#beamGradient)"
                    strokeWidth="2"
                    strokeDasharray="18 100"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {ARCHITECTURE_TIERS.map((tier, idx) => {
                const Icon = tier.icon;
                const isSelected = activeTier === idx;
                return (
                  <motion.div
                    key={tier.id}
                    onClick={() => {
                      playPopSound();
                      setActiveTier(idx);
                    }}
                    whileHover={{ y: -4 }}
                    className={`relative z-10 cursor-pointer rounded-2xl border p-6 transition-all duration-300 ${
                      isSelected
                        ? 'border-white/30 bg-[#161B26] shadow-xl'
                        : 'border-white/8 bg-[#0C0F16]/90 hover:border-white/20 hover:bg-[#121620]'
                    }`}
                    style={{
                      boxShadow: isSelected ? `0 0 28px ${tier.glow}` : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-widest text-[#A0AEC0]">
                        {tier.tier}
                      </span>
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300"
                        style={{
                          backgroundColor: `${tier.color}15`,
                          color: tier.color,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h4 className="font-syne mt-4 text-base font-bold text-white">
                      {tier.name}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                      {tier.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {tier.techs.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/8 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/8 pt-3 font-mono text-[11px]">
                      <span className="text-[#64748B]">Benchmark</span>
                      <span className="font-semibold" style={{ color: tier.color }}>
                        {tier.metrics}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
