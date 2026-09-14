import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, Layers, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import type { ProjectData } from './ProjectCard';

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-10"
          onWheel={(e) => {
            e.stopPropagation();
            if (modalCardRef.current && !modalCardRef.current.contains(e.target as Node)) {
              modalCardRef.current.scrollTop += e.deltaY;
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            ref={modalCardRef}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            data-lenis-prevent="true"
            className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0C0E14] shadow-[0_32px_80px_rgba(0,0,0,0.85)] custom-scrollbar overscroll-contain"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Specular Edge Highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {/* Modal Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0C0E14]/90 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-3 py-0.5 text-xs font-medium text-[#00F0FF]">
                  <Sparkles className="h-3 w-3" />
                  {project.category}
                </span>
                <span className="font-mono text-xs text-[#A0AEC0]">
                  https://{project.domain}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* High-Res Preview Screenshot */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover object-top"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0E14] via-transparent to-transparent opacity-40" />
              </div>

              {/* Title & Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="font-syne text-2xl font-bold text-white sm:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-sm text-[#A0AEC0]">
                    Architectural Deep-Dive &amp; Production Metrics
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-glow-magenta inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold text-white shadow-md active:scale-95"
                    >
                      <span>Visit Live Platform</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}

                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/10"
                    >
                      <span>GitHub Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : project.isPrivate ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium text-amber-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {project.privateReason || 'Proprietary Commercial Code (NDA)'}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Overview Narrative */}
              <div>
                <h3 className="font-syne text-lg font-bold text-white mb-2">
                  System Architecture &amp; Objectives
                </h3>
                <p className="text-sm leading-[1.8] text-[#B0BEC5] md:text-base">
                  {project.overview}
                </p>
              </div>

              {/* Problem & Solution Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#111318] p-5">
                  <h4 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0AEC0] uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    The Challenge
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#D7E2EA]">
                    {project.problem || project.challenges || 'Designing a scalable user journey and reliable data model.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#111318] p-5">
                  <h4 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0AEC0] uppercase">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                    Engineered Solution
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#D7E2EA]">
                    {project.solution || project.results || 'Delivered a resilient production platform with performant state sync.'}
                  </p>
                </div>
              </div>

              {/* Key Capabilities */}
              <div>
                <h3 className="font-syne text-base font-bold text-white mb-3">
                  Production Highlights
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {project.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-xs text-[#E2E8F0]"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#00F0FF] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies Deployed */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#A0AEC0] uppercase mb-3">
                  <Layers className="h-3.5 w-3.5" />
                  Deployed Stack &amp; Libraries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-white/10 bg-[#0C0C0C] px-3 py-1 text-xs font-mono text-[#00F0FF]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
