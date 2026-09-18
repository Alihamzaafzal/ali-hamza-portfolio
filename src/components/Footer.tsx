import { useState, useEffect } from 'react';
import { personalInfo } from '../data/portfolio';
import { ArrowUp, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';

function LinkedInIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LiveClock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // PKT = UTC+5
      const pkt = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      setTime(
        pkt.toISOString().slice(11, 16) + ' PKT'
      );
      setDate(
        pkt.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC',
        })
      );
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="flex items-center gap-1.5 font-mono text-xs text-[#A0AEC0]">
      <Clock className="h-3 w-3 text-[#38BDF8]" />
      {date} · {time}
    </span>
  );
}

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/rai-ali-hamza-12a414386',
    icon: LinkedInIcon,
    color: '#0A66C2',
    glow: 'rgba(10,102,194,0.4)',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Alihamzaafzal',
    icon: GitHubIcon,
    color: '#E2E8F0',
    glow: 'rgba(226,232,240,0.3)',
  },
  {
    label: 'Email',
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
    color: '#D946EF',
    glow: 'rgba(217,70,239,0.4)',
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${personalInfo.whatsapp.replace(/\D/g, '')}`,
    icon: MessageCircle,
    color: '#25D366',
    glow: 'rgba(37,211,102,0.4)',
  },
];

const quickLinks = [
  { label: 'About',     href: '#about' },
  { label: 'Work',      href: '#projects' },
  { label: 'Services',  href: '#services' },
  { label: 'Skills',    href: '#skills' },
  { label: 'Contact',   href: '#contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/8 bg-[#080808]">
      {/* Ambient orbs */}
      <div
        className="footer-orb"
        style={{ width: 480, height: 480, top: '0%', left: '25%', background: 'radial-gradient(circle, rgba(118,33,176,0.28), transparent 70%)', transformOrigin: '50% 50%' }}
        aria-hidden="true"
      />
      <div
        className="footer-orb"
        style={{ width: 320, height: 320, bottom: '-10%', right: '15%', background: 'radial-gradient(circle, rgba(6,182,212,0.18), transparent 70%)', transformOrigin: '50% 50%', animationDelay: '5s' }}
        aria-hidden="true"
      />

      <div className="section-shell relative mx-auto max-w-7xl w-full px-6 pt-20 pb-8 lg:px-12">
        {/* ── CTA HEADLINE ── */}
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold tracking-[0.28em] text-[#A0AEC0] uppercase mb-4">
            Ready to collaborate?
          </p>
          <h2 className="font-syne text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            Let's build something
            <span
              className="block mt-1"
              style={{
                background: 'linear-gradient(90deg, #00F0FF 0%, #D946EF 50%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.25))',
              }}
            >
              remarkable.
            </span>
          </h2>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-2.5 rounded-full px-7 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 btn-glow-magenta text-sm"
            >
              <Mail className="h-4 w-4" />
              Email Me
            </a>
            <a
              href={`https://wa.me/${personalInfo.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              WhatsApp
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-transparent px-7 py-3 text-sm font-medium text-[#A0AEC0] transition-all duration-300 hover:text-white hover:border-white/25"
            >
              View Contact Form
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-14 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── LINKS GRID ── */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-syne text-xl font-bold tracking-tight text-white">
                {personalInfo.name}
              </span>
              <span
                className="avail-badge inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#34D399]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Open to Projects
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#A0AEC0] max-w-xs mb-5">
              Full Stack Engineer &amp; AI Agent Developer crafting high-velocity digital experiences from Lahore, Pakistan.
            </p>
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 text-xs text-[#A0AEC0]">
                <MapPin className="h-3 w-3 text-[#38BDF8]" />
                Lahore, Pakistan (PKT · UTC+5)
              </span>
              <LiveClock />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#A0AEC0] uppercase">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-2 text-sm text-[#B0BEC5] transition-all duration-200 hover:text-white"
                  >
                    <span className="h-px w-4 bg-white/20 transition-all duration-200 group-hover:w-6 group-hover:bg-[#00F0FF]" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#A0AEC0] uppercase">
              Connect
            </p>
            <ul className="space-y-3">
              {socialLinks.map(({ label, href, icon: Icon, color, glow }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 text-sm text-[#B0BEC5] transition-all duration-200 hover:text-white"
                    style={{ '--glow': glow } as React.CSSProperties}
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-[#111318] transition-all duration-200 group-hover:border-white/25 group-hover:shadow-[0_0_12px_var(--glow)]"
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── SUB-FOOTER ── */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 text-xs text-[#616E7C] md:flex-row">
          <p>&copy; {year} {personalInfo.name}. All rights reserved.</p>
          <p className="font-mono text-[11px]">Designed &amp; Engineered with React &amp; Tailwind</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-[#111318] text-white transition-all duration-200 hover:border-white/25 active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
