import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { experience, education } from '../data/portfolio';
import FadeIn from './FadeIn';
import { Briefcase, GraduationCap, Calendar, Building2, CheckCircle2, Zap } from 'lucide-react';
import { playPopSound } from '../utils/audio';

export default function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 40%'],
  });
  const beamScaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      id="experience"
      className="site-section relative bg-[#0C0C0C] px-6 py-28 lg:px-12"
    >
      <div className="section-shell mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <FadeIn direction="up" delay={0.1}>
            <p className="text-xs font-semibold tracking-[0.28em] text-[#A0AEC0] uppercase">
              Career &amp; Background
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <h2 className="hero-heading mt-3 font-syne text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Experience &amp; Education
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <p className="mt-5 text-base leading-relaxed text-[#B0BEC5] md:text-lg">
              A track record of engineering full-stack platforms, developing scalable APIs, and
              delivering polished client software with quantifiable impact.
            </p>
          </FadeIn>
        </div>

        {/* Content Layout */}
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Work Experience with Illuminated Progressive Timeline (7 Cols) */}
          <div className="lg:col-span-7">
            <FadeIn direction="up" delay={0.2}>
              <div className="mb-6 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#38BDF8]" />
                <span className="text-xs font-semibold tracking-wider text-[#A0AEC0] uppercase">
                  Work History &amp; Production Track Record
                </span>
              </div>
            </FadeIn>

            {/* Timeline Wrapper with ref for scroll tracking */}
            <div ref={timelineRef} className="relative pl-6 sm:pl-8 space-y-8">
              {/* Background Dim Guide Track */}
              <div
                className="pointer-events-none absolute bottom-4 left-2.5 sm:left-3.5 top-4 w-[2px] bg-white/10"
                aria-hidden="true"
              />

              {/* Scroll-Driven Progressive Illuminated Beam */}
              <motion.div
                style={{ scaleY: beamScaleY, originY: 0 }}
                className="pointer-events-none absolute bottom-4 left-2.5 sm:left-3.5 top-4 w-[2px] bg-gradient-to-b from-[#00F0FF] via-[#D946EF] to-[#10B981] shadow-[0_0_16px_rgba(0,240,255,0.6)] z-0"
                aria-hidden="true"
              />

              {experience.map((item, idx) => (
                <FadeIn
                  key={item.period}
                  direction="up"
                  delay={0.2 + idx * 0.12}
                  className="relative group rounded-2xl border border-white/10 bg-[#111318] p-7 md:p-8 transition-all duration-300 hover:border-white/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)] cursor-pointer"
                >
                  <div onClick={() => playPopSound()}>
                    {/* Glowing Timeline Node with Double Ring Pulse */}
                    <div
                      className="absolute -left-[29px] sm:-left-[39px] top-8 z-10"
                      aria-hidden="true"
                    >
                      {/* Expanding ring 1 */}
                      <span className="timeline-node-ring" />
                      {/* Expanding ring 2 (delayed) */}
                      <span className="timeline-node-ring timeline-node-ring-2" />
                      {/* Core node */}
                      <div className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#00F0FF] bg-[#0C0C0C]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/10 px-3 py-1 text-xs font-medium text-[#38BDF8]">
                        <Calendar className="h-3 w-3" />
                        {item.period}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#A0AEC0]">
                        <Building2 className="h-3.5 w-3.5 text-white/50" />
                        <span>{item.company}</span>
                      </div>
                    </div>

                    <h3 className="mt-4 font-syne text-xl font-bold text-white md:text-2xl group-hover:text-[#00F0FF] transition-colors">
                      {item.role}
                    </h3>

                    <p className="mt-3 text-sm leading-[1.75] text-[#B0BEC5] md:text-base">
                      {item.description}
                    </p>

                    {/* Quantifiable Impact Metrics */}
                    {item.metrics && item.metrics.length > 0 && (
                      <div className="mt-5 border-t border-white/10 pt-4">
                        <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#A0AEC0] uppercase">
                          <Zap className="h-3 w-3 text-[#00F0FF]" />
                          Key Accomplishments
                        </p>
                        <ul className="space-y-2">
                          {item.metrics.map((metric) => (
                            <li
                              key={metric}
                              className="flex items-start gap-2 text-xs leading-relaxed text-[#D7E2EA]"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0 mt-0.5" />
                              <span>{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Education & Academic Credentials (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <FadeIn direction="up" delay={0.3}>
              <div className="mb-6 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#A855F7]" />
                <span className="text-xs font-semibold tracking-wider text-[#A0AEC0] uppercase">
                  Academic Foundation
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#111318] p-8 shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Completed {education.year}
                </span>

                <h3 className="mt-4 font-syne text-2xl font-bold text-white">
                  {education.degree}
                </h3>

                <p className="mt-2 text-sm font-medium text-[#38BDF8]">
                  {education.university}
                </p>

                <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm leading-[1.75] text-[#B0BEC5]">
                  <p>
                    Focused on computational complexity, distributed systems, modern database
                    architectures, and production software engineering.
                  </p>
                </div>

                {/* Coursework Badges */}
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="mb-3 text-xs font-semibold tracking-wider text-[#A0AEC0] uppercase">
                    Core Computer Science Disciplines
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {education.coursework?.map((course) => (
                      <span
                        key={course}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0C0C0C] px-3 py-1 text-xs text-[#E2E8F0]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
