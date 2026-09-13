import { type MouseEvent, useCallback } from 'react';
import { motion, type Variants, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Code2, Activity, ChevronDown } from 'lucide-react';
import { personalInfo } from '../data/portfolio';
import Magnet from './Magnet';
import HeroShineParticles from './HeroShineParticles';
import { useScrollNav } from '../hooks/useScrollNav';
import { playClickSound, playPopSound } from '../utils/audio';
import { triggerParticleBurst } from '../utils/particles';

/* Staggered character reveal variants */
const charContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.2 },
  },
};

const charVariant: Variants = {
  hidden: { y: 80, opacity: 0, rotateX: -40 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const lineSlideUp = (delay: number): Variants => ({
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  },
});

export default function Hero() {
  const { scrollTo } = useScrollNav();

  // Mouse Parallax Physics
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 90, damping: 22 });
  const springY = useSpring(rawY, { stiffness: 90, damping: 22 });

  const ring1X = useTransform(springX, [-1, 1], [-28, 28]);
  const ring1Y = useTransform(springY, [-1, 1], [-20, 20]);
  const ring2X = useTransform(springX, [-1, 1], [22, -22]);
  const ring2Y = useTransform(springY, [-1, 1], [16, -16]);
  const cardTiltX = useTransform(springY, [-1, 1], [7, -7]);
  const cardTiltY = useTransform(springX, [-1, 1], [-9, 9]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const nx = (clientX / innerWidth) * 2 - 1;
    const ny = (clientY / innerHeight) * 2 - 1;
    rawX.set(nx);
    rawY.set(ny);
  }, [rawX, rawY]);

  const onAnchor = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    playClickSound();
    triggerParticleBurst(e.clientX, e.clientY, 16);
    if (!href.startsWith('#')) return;
    e.preventDefault();
    scrollTo(href);
  };

  const nameChars = 'ALI HAMZA'.split('');

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen lg:h-screen lg:max-h-[1024px] w-full overflow-hidden bg-[#06070B] px-6 pt-20 pb-10 lg:px-16 flex items-center"
    >
      <HeroShineParticles />

      {/* Very subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Bottom horizon glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/90 to-transparent" />
        <div className="absolute bottom-0 left-[20%] w-[300px] h-16 bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.2)_0%,transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 right-[15%] w-[350px] h-16 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.2)_0%,transparent_70%)] blur-2xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      <div className="relative z-10 section-shell mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Typography & CTAs (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Live Status Pill with Timezone & Global Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-4 sm:mb-5 inline-flex flex-wrap items-center gap-2.5 rounded-full border border-white/12 bg-[#0E131F] px-3.5 py-1 text-xs text-[#E2E8F0] backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
              </span>
              <span className="tracking-wide font-medium">Available for High-Impact Projects</span>
              <span className="h-3 w-px bg-white/15" />
              <span className="font-mono text-[11px] text-[#00F0FF] tracking-wider">
                PKT · UTC+5
              </span>
            </motion.div>

            {/* ═══ #1: Cinematic Staggered Character Reveal Heading ═══ */}
            <motion.h1
              className="font-syne text-[clamp(1.75rem,2.85vw,2.9rem)] font-extrabold leading-[1.12] tracking-tight"
              initial="hidden"
              animate="visible"
            >
              {/* Line 1: ALI HAMZA — character-by-character with 3D rotateX */}
              <motion.span
                className="block text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.08)] overflow-hidden"
                variants={charContainer}
                style={{ perspective: '600px' }}
              >
                {nameChars.map((char, i) => (
                  <motion.span
                    key={i}
                    className="hero-name-char"
                    variants={charVariant}
                    style={{ transformOrigin: 'bottom center' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
                <motion.span
                  className="hero-name-char text-[#00F0FF]"
                  variants={charVariant}
                >
                  .
                </motion.span>
              </motion.span>

              {/* Line 2: FULL STACK & AI — slides up with delay */}
              <motion.span
                className="block text-white"
                variants={lineSlideUp(0.5)}
              >
                FULL STACK &amp; AI
              </motion.span>

              {/* Line 3: AGENT DEVELOPER — gradient shimmer with delay */}
              <motion.span
                className="block hero-dev-gradient"
                variants={lineSlideUp(0.7)}
              >
                AGENT DEVELOPER
              </motion.span>
            </motion.h1>

            {/* Hero Subtext with Keywords Highlighted */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-3.5 sm:mt-4 max-w-lg text-sm sm:text-[15px] leading-[1.65] text-[#B0BEC5]"
            >
              Architecting <span className="text-white font-medium">autonomous AI agents</span> and high-performance <span className="text-white font-medium">full-stack web applications</span> with cinematic 3D interfaces, resilient architectures, and <span className="hero-keyword-shimmer">fluid micro-interactions</span>.
            </motion.p>

            {/* Action Buttons Row with Tactile Magnetic Attraction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3.5"
            >
              <Magnet proximityPadding={60} dampingFactor={3.5}>
                <a
                  href="#contact"
                  onClick={(e) => onAnchor(e, '#contact')}
                  className="btn-glow-magenta group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold text-white active:scale-95 cursor-pointer"
                >
                  <span>Initiate Contact</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </Magnet>

              <Magnet proximityPadding={60} dampingFactor={3.5}>
                <a
                  href="#projects"
                  onClick={(e) => onAnchor(e, '#projects')}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0F131D] px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/10 active:scale-95 shadow-lg cursor-pointer"
                >
                  <span>Explore 9 Projects</span>
                  <ArrowUpRight className="h-4 w-4 text-white/70" />
                </a>
              </Magnet>
            </motion.div>

            {/* Bottom Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-6 sm:mt-8 flex items-center gap-5 sm:gap-6 text-xs text-[#E2E8F0]"
            >
              <span className="flex items-center gap-2 font-medium">
                <Code2 className="h-4 w-4 text-[#00F0FF]" /> Enterprise-Grade Code
                <span className="h-1 w-1 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
              </span>
              <span className="h-4 w-px bg-white/15" />
              <span className="flex items-center gap-2 font-medium">
                <Activity className="h-4 w-4 text-[#00F0FF]" /> Modern Motion Physics
                <span className="h-1 w-1 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
              </span>
            </motion.div>
          </div>

          {/* Right Column: Holographic Floating Card (5 Cols) with 3D Parallax */}
          <div className="lg:col-span-5 flex justify-center items-center relative [perspective:1000px]">
            {/* 3D Elliptical Orbit Ring 1 - Cyan */}
            <motion.div
              style={{ x: ring1X, y: ring1Y, willChange: 'transform' }}
              className="pointer-events-none absolute -inset-6 sm:-inset-10 rounded-[50%] border border-[#00F0FF]/25 shadow-[0_0_30px_rgba(0,240,255,0.15)] [transform:rotateX(68deg)_rotateY(-12deg)] transition-opacity duration-300"
              aria-hidden="true"
            />
            {/* 3D Elliptical Orbit Ring 2 - Magenta */}
            <motion.div
              style={{ x: ring2X, y: ring2Y, willChange: 'transform' }}
              className="pointer-events-none absolute -inset-8 sm:-inset-12 rounded-[50%] border border-[#D946EF]/20 shadow-[0_0_35px_rgba(217,70,239,0.12)] [transform:rotateX(72deg)_rotateY(10deg)] transition-opacity duration-300"
              aria-hidden="true"
            />

            {/* ═══ #2: Portrait Card with 3D Tilt & Floating Animation ═══ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ rotateX: cardTiltX, rotateY: cardTiltY, willChange: 'transform' }}
              className="relative z-10 hero-card-float"
            >
              <Magnet proximityPadding={150} dampingFactor={3}>
                <div 
                  onClick={() => playPopSound()}
                  className="holo-card-ref cursor-pointer p-4 sm:p-5 w-[290px] sm:w-[330px] lg:w-[340px]"
                >
                  {/* Top Specular Edge */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[32px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                  {/* Photo Viewport */}
                  <div className="relative overflow-hidden rounded-[22px] aspect-[4/4.2] w-full border border-white/15 bg-[#05070D] shadow-inner">
                    <img
                      src="/ali-hamza.jpg"
                      alt={personalInfo.name}
                      className="h-full w-full object-cover object-[center_16%] transition-transform duration-700 ease-out hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/5" />
                  </div>

                  {/* Identification Pill */}
                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/12 bg-[#0B0F19] px-4 py-3 backdrop-blur-md shadow-lg">
                    <div>
                      <h3 className="font-syne text-sm font-bold tracking-wide text-white">
                        {personalInfo.name}<span className="text-[#00F0FF]">.</span>
                      </h3>
                      <p className="text-[11px] text-[#A0AEC0]">
                        Full Stack &amp; AI Agent Developer
                      </p>
                    </div>
                    <div className="flex items-center justify-center h-5 w-5">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_12px_#10B981]" />
                      </span>
                    </div>
                  </div>
                </div>
              </Magnet>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══ #5: Scroll Down Indicator ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1 opacity-75 hover:opacity-100 transition-opacity pointer-events-none"
      >
        <span className="text-[9px] font-medium tracking-[0.25em] text-[#A0AEC0] uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4 text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
        </motion.div>
      </motion.div>

      {/* Lower Left HUD */}
      <div className="pointer-events-none absolute bottom-5 left-6 sm:left-12 hidden md:flex items-center gap-2 opacity-70" aria-hidden="true">
        <div className="w-10 h-0.5 bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] rounded-full" />
        <div className="w-4 h-0.5 bg-white/20 rounded-full" />
        <div className="w-1.5 h-0.5 bg-white/20 rounded-full" />
      </div>

      {/* Lower Right Status Dots */}
      <div className="pointer-events-none absolute bottom-5 right-6 sm:right-12 hidden md:flex items-center gap-2 opacity-70" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_6px_#00F0FF]" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      </div>
    </section>
  );
}
