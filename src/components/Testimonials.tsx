import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../data/portfolio';
import FadeIn from './FadeIn';
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { playPopSound } from '../utils/audio';

const AUTO_INTERVAL = 5000; // ms between auto-slides

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (idx: number, dir = 1) => {
      playPopSound();
      setDirection(dir);
      setActive((idx + testimonials.length) % testimonials.length);
    },
    [],
  );

  const next = useCallback(() => goTo(active + 1, 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setTimeout(() => next(), AUTO_INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, isPaused, next]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '60%' : '-60%',
      opacity: 0,
      scale: 0.94,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? '-60%' : '60%',
      opacity: 0,
      scale: 0.94,
    }),
  };

  const item = testimonials[active];

  return (
    <section
      id="testimonials"
      className="site-section relative bg-[#0C0C0C] px-6 py-28 lg:px-12"
    >
      <div className="section-shell mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <div className="mb-16 max-w-2xl text-center mx-auto flex flex-col items-center">
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xs font-semibold tracking-[0.28em] text-[#A0AEC0] uppercase">
              Endorsements
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <h2 className="hero-heading mt-3 font-syne text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Client &amp; Collaborator Voices
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <p className="mt-5 text-base leading-relaxed text-[#B0BEC5]">
              Trusted for reliability, thoughtful architecture, and rapid end-to-end execution.
            </p>
          </FadeIn>
        </div>

        {/* Carousel */}
        <FadeIn direction="up" delay={0.35}>
          <div
            className="relative mx-auto max-w-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Card viewport */}
            <div className="relative overflow-hidden rounded-[28px] min-h-[280px]" style={{ perspective: '1000px' }}>
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={active}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-[#111318] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                >
                  {/* Decorative Quote Watermark */}
                  <div
                    className="testimonial-watermark"
                    aria-hidden="true"
                  >
                    &ldquo;
                  </div>

                  <div className="relative z-10">
                    {/* Stars */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#F59E0B]">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.06, ease: 'backOut' }}
                            whileHover={{ scale: 1.3, rotate: 10 }}
                          >
                            <Star className="h-4 w-4 fill-current drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                          </motion.div>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Verified
                      </span>
                    </div>

                    {/* Quote */}
                    <p className="mt-6 text-base leading-[1.8] text-[#E2E8F0] md:text-lg">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author */}
                  <div className="relative z-10 mt-8 flex items-center gap-3.5 border-t border-white/10 pt-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#00F0FF]/30 bg-gradient-to-br from-[#7621B0] to-[#06B6D4] text-sm font-bold text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-syne text-sm font-bold text-white">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#A0AEC0]">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls row */}
            <div className="mt-8 flex items-center justify-center gap-6">
              {/* Prev button */}
              <button
                type="button"
                onClick={prev}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#111318] text-white transition-all duration-200 hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/10 active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Dot indicators */}
              <div className="flex items-center gap-2.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goTo(idx, idx > active ? 1 : -1)}
                    className="transition-all duration-300"
                    aria-label={`Go to testimonial ${idx + 1}`}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        idx === active
                          ? 'w-6 h-2 bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.7)]'
                          : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Next button */}
              <button
                type="button"
                onClick={next}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#111318] text-white transition-all duration-200 hover:border-[#00F0FF]/40 hover:bg-[#00F0FF]/10 active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Auto-play progress bar */}
            <div className="mt-4 mx-auto h-0.5 w-24 overflow-hidden rounded-full bg-white/10">
              <motion.div
                key={`progress-${active}`}
                className="h-full bg-gradient-to-r from-[#00F0FF] to-[#D946EF]"
                initial={{ width: '0%' }}
                animate={{ width: isPaused ? undefined : '100%' }}
                transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
