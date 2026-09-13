import { personalInfo } from '../data/portfolio';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#0A0A0A] px-6 py-12 lg:px-12">
      <div className="section-shell mx-auto max-w-7xl w-full">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2">
              <span className="font-syne text-xl font-bold tracking-tight text-white">
                {personalInfo.name}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            </div>
            <p className="text-sm text-[#A0AEC0]">
              Full Stack Engineer · Crafting digital experiences with precision
            </p>
          </div>

          {/* Direct Social / Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#B0BEC5]">
            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>
            <a
              href="#projects"
              className="transition hover:text-white"
            >
              Work
            </a>
            <a
              href="#services"
              className="transition hover:text-white"
            >
              Services
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              LinkedIn
            </a>
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-white"
              >
                GitHub
              </a>
            )}
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#111318] text-white transition-all duration-200 hover:border-white/30 active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Sub-footer copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 text-xs text-[#A0AEC0] md:flex-row">
          <p>&copy; {year} {personalInfo.name}. All rights reserved.</p>
          <p className="font-mono text-[11px]">Designed &amp; Engineered with React &amp; Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
