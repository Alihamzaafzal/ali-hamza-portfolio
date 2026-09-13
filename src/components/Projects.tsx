import { useState, useRef } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { projects, projectFilterCategories } from '../data/portfolio';
import ProjectCard, { type ProjectData } from './ProjectCard';
import ProjectModal from './ProjectModal';
import FadeIn from './FadeIn';
import { playPopSound } from '../utils/audio';

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Velocity Skew Physics
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 350 });
  const skewY = useTransform(smoothVelocity, [-2000, 2000], [-1.8, 1.8]);

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.filterCategory === activeFilter);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="site-section relative bg-[#0C0C0C] px-4 py-24 sm:px-6 lg:px-12"
    >
      <div className="section-shell mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <FadeIn direction="up" delay={0.1} distance={30} duration={0.8}>
            <p className="text-xs font-semibold tracking-[0.28em] text-[#A0AEC0] uppercase">
              WORK (09)
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.2} distance={30} duration={0.8}>
            <h2 className="hero-heading mt-3 font-syne text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Things I&apos;ve created
            </h2>
          </FadeIn>

          <FadeIn direction="up" delay={0.3} distance={30} duration={0.8}>
            <p className="mt-5 text-base leading-relaxed text-[#B0BEC5] md:text-lg">
              A physical deck of 9 production platforms, engineered with precision, live status
              telemetry, and physical scroll dynamics. Click any card to inspect architecture case studies.
            </p>
          </FadeIn>
        </div>

        {/* Category Filter Tabs */}
        <FadeIn direction="up" delay={0.35} distance={20} duration={0.6}>
          <div className="mb-14 flex flex-wrap items-center gap-2.5">
            {projectFilterCategories.map((tab) => {
              const isActive = activeFilter === tab.id;
              const count =
                tab.id === 'all'
                  ? projects.length
                  : projects.filter((p) => p.filterCategory === tab.id).length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setActiveFilter(tab.id);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer ${
                    isActive
                      ? 'border border-[#00F0FF]/60 bg-[#00F0FF]/15 text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.25)] font-semibold'
                      : 'border border-white/10 bg-[#111318] text-[#A0AEC0] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                      isActive ? 'bg-[#00F0FF]/25 text-[#00F0FF]' : 'bg-white/5 text-[#A0AEC0]'
                    }`}
                  >
                    0{count}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Sticky-Stacking Deck Container with Kinetic Scroll Velocity Skew */}
        <motion.div style={{ skewY }} className="relative space-y-12 pb-32">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={`${activeFilter}-${project.id}`}
              project={project}
              index={index}
              totalCards={filteredProjects.length}
              onSelectProject={setSelectedProject}
            />
          ))}
        </motion.div>
      </div>

      {/* Case Study Modal Lightbox */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
