import { Code2, Layout, Smartphone, Workflow, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { services } from '../data/portfolio';
import FadeIn from './FadeIn';
import { playPopSound } from '../utils/audio';

const serviceIcons = [Code2, Layout, Smartphone, Workflow];

const serviceDetails = [
  {
    deliverables: ['MERN Stack Platforms', 'Production Database Modeling', 'Serverless & Cloud CI/CD'],
    highlight: 'Zero-downtime architecture',
  },
  {
    deliverables: ['Custom Web Applications', 'Framer Motion Physics', 'Design System Architecture'],
    highlight: 'Pixel-perfect precision',
  },
  {
    deliverables: ['Cross-Platform Flutter Apps', 'Native Hardware Integration', 'Fluid 60fps Mobile UX'],
    highlight: 'iOS & Android parity',
  },
  {
    deliverables: ['RESTful & Real-Time APIs', 'Webhook & Third-Party Sync', 'Secure Auth & PCI Flows'],
    highlight: 'Sub-100ms latency',
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="site-section relative overflow-hidden bg-[#0C0C0C] px-6 py-28 lg:px-12 text-white"
    >
      {/* Subtle Background Radial Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-[#00F0FF]/10 via-[#D946EF]/5 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-[#7621B0]/10 via-[#06B6D4]/5 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="section-shell mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 flex flex-col justify-between gap-6 border-b border-white/10 pb-12 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <FadeIn direction="up" delay={0.1}>
              <span className="text-xs font-semibold tracking-[0.28em] text-[#A0AEC0] uppercase">
                Expertise &amp; Capabilities
              </span>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <h2 className="hero-heading mt-4 font-syne text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Services &amp; Technical Scope
              </h2>
            </FadeIn>
          </div>

          <FadeIn direction="up" delay={0.3}>
            <p className="max-w-md text-base leading-relaxed text-[#B0BEC5] md:text-lg">
              Engineering end-to-end digital experiences where architectural solidity meets
              high-touch visual interaction.
            </p>
          </FadeIn>
        </div>

        {/* Services Grid (Dark Luxury Cards with Moving Border Glow) */}
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            const details = serviceDetails[index % serviceDetails.length];
            const isFirst = index === 0;
            return (
              <FadeIn
                key={service.title}
                direction="up"
                delay={index * 0.1}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-[#111318] p-8 md:p-9 shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_20px_50px_rgba(0,240,255,0.1)] cursor-pointer ${
                  isFirst ? 'moving-border-glow border-white/20' : 'border-white/10'
                }`}
              >
                <div onClick={() => playPopSound()}>
                  {/* Top Ambient Edge Highlight */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent transition-opacity group-hover:via-[#00F0FF]/40" />

                <div>
                  {/* Top Bar: Number & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0C0C0C] text-[#00F0FF] transition-transform duration-300 group-hover:scale-110 group-hover:border-[#00F0FF]/30 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="font-mono text-2xl font-light text-white/25 transition-colors group-hover:text-[#00F0FF]">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 font-syne text-2xl font-bold tracking-tight text-white md:text-3xl">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-4 text-sm leading-[1.75] text-[#B0BEC5] md:text-base">
                    {service.description}
                  </p>

                  {/* Core Deliverables Badges */}
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="mb-3 text-[11px] font-semibold tracking-wider text-[#A0AEC0] uppercase">
                      Core Deliverables
                    </p>
                    <ul className="space-y-2">
                      {details.deliverables.map((del) => (
                        <li key={del} className="flex items-center gap-2 text-xs text-[#D7E2EA]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Highlight Pill */}
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0C0C0C] px-3 py-1 font-mono text-[#A0AEC0]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF]" />
                    {details.highlight}
                  </span>

                  <div className="flex items-center gap-1 text-[#A0AEC0] transition-colors group-hover:text-white">
                    <span className="font-medium">Scope</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
