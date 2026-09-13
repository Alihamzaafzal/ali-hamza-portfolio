import { motion } from 'framer-motion';
import { testimonials } from '../data/portfolio';
import FadeIn from './FadeIn';
import { Star, CheckCircle2 } from 'lucide-react';
import { playPopSound } from '../utils/audio';

export default function Testimonials() {
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

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, idx) => (
            <FadeIn
              key={item.name}
              direction="up"
              delay={0.1 + idx * 0.1}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111318] p-8 shadow-[0_12px_36px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_20px_48px_rgba(0,0,0,0.6)] cursor-pointer"
            >
              <div onClick={() => playPopSound()}>
                {/* Decorative Large Watermark Quote with 3D Float & Rotation */}
                <div
                  className="testimonial-watermark transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-12 group-hover:opacity-90 group-hover:translate-x-2"
                  aria-hidden="true"
                >
                  &ldquo;
                </div>

                <div className="relative z-10">
                  {/* Rating Stars with Staggered Gold Shimmer Fill Wave */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#F59E0B]">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: 0.15 + idx * 0.1 + i * 0.07,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          whileHover={{ scale: 1.3, rotate: 10 }}
                          className="transition-transform"
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

                  {/* Quote Text */}
                  <p className="mt-6 text-base leading-[1.8] text-[#E2E8F0] transition-colors group-hover:text-white">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Author Footer with Gradient Ring Avatar */}
                <div className="relative z-10 mt-8 flex items-center gap-3.5 border-t border-white/10 pt-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#00F0FF]/30 bg-gradient-to-br from-[#7621B0] to-[#06B6D4] text-sm font-bold text-white shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-transform duration-300 group-hover:scale-110">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-syne text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#A0AEC0]">{item.role}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
