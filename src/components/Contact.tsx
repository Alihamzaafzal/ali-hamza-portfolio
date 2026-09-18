import { useState, useEffect, type ReactNode, type FormEvent } from 'react';
import { Mail, MessageCircle, FileDown, Copy, Check, type LucideIcon, ArrowUpRight, Send, Clock, Sparkles } from 'lucide-react';
import { personalInfo } from '../data/portfolio';
import FadeIn from './FadeIn';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export default function Contact({
  prefillMessage,
}: {
  prefillMessage?: string;
} = {}) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    if (prefillMessage) {
      setFormData((prev) => ({ ...prev, message: prefillMessage }));
    }
  }, [prefillMessage]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Pakistan Standard Time (UTC+5)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setLocalTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyTemplate = (templateType: 'ai-agent' | 'fullstack' | 'mobile' | 'consulting') => {
    let msg = '';
    if (templateType === 'ai-agent') {
      msg = `Hi Ali,\nI am looking to architect an autonomous AI agent system.\n• Domain / Problem:\n• Integrations (APIs / Vector DB / LLM):\n• Target Timeline:\n• Approximate Budget:`;
    } else if (templateType === 'fullstack') {
      msg = `Hi Ali,\nWe are planning to build a modern full-stack web platform.\n• Tech Preferences (React / Next.js / Node):\n• Core Features Needed:\n• Target Launch Date:`;
    } else if (templateType === 'mobile') {
      msg = `Hi Ali,\nWe need a cross-platform mobile application built with Flutter.\n• Target Platforms (iOS + Android):\n• Key Features (Offline Sync / Auth / Payments):\n• Timeline:`;
    } else {
      msg = `Hi Ali,\nI would like to book you for technical advisory / full-time role discussion.\n• Organization:\n• Role / Scope:\n• Timezone & Availability needed:`;
    }
    setFormData((prev) => ({ ...prev, message: msg }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Construct mailto link
    const subject = encodeURIComponent(`Project Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Hi Ali,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nProject Overview:\n${formData.message}`
    );
    window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  const contactMethods: {
    label: string;
    value: string;
    href: string;
    icon: LucideIcon | ((props: { className?: string }) => ReactNode);
    color: string;
  }[] = [
    {
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      icon: Mail,
      color: '#38BDF8',
    },
    {
      label: 'WhatsApp Direct',
      value: personalInfo.whatsappDisplay,
      href: `https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent(
        'Hi Ali, I saw your portfolio and would like to discuss a project.'
      )}`,
      icon: MessageCircle,
      color: '#10B981',
    },
    {
      label: 'LinkedIn Profile',
      value: 'Rai Ali Hamza',
      href: personalInfo.linkedin,
      icon: LinkedInIcon,
      color: '#06B6D4',
    },
    {
      label: 'GitHub Codebase',
      value: 'Alihamzaafzal',
      href: personalInfo.github,
      icon: GitHubIcon,
      color: '#A855F7',
    },
  ];

  return (
    <section
      id="contact"
      className="site-section relative bg-[#0C0C0C] px-6 py-28 lg:px-12"
    >
      <div className="section-shell mx-auto max-w-7xl w-full">
        {/* Main CTA Banner */}
        <FadeIn direction="up" delay={0.1}>
          <div className="profile-card relative overflow-hidden rounded-3xl bg-[#111318] p-8 text-center md:p-14 shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
            <div className="profile-card-illumination" />
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-gradient-to-r from-[#B600A8]/15 via-[#7621B0]/15 to-[#06B6D4]/15 blur-3xl" />

            {/* Local Timezone HUD */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0C0C0C]/80 px-4 py-1.5 text-xs text-[#E2E8F0]">
              <Clock className="h-3.5 w-3.5 text-[#00F0FF]" />
              <span>PKT (UTC+5)</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="font-mono text-[#00F0FF]">{localTime || '11:00 AM'}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[#10B981] font-medium">Active &amp; Ready</span>
            </div>

            <p className="text-xs font-semibold tracking-[0.28em] text-[#A0AEC0] uppercase">
              Start a Project
            </p>

            <h2 className="hero-heading mt-3 font-syne text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Let&apos;s Build Something Extraordinary
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-[1.75] text-[#B0BEC5] md:text-lg">
              Open for full-stack engineering, custom web applications, and technical consulting.
              Reach out directly for rapid turnaround.
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                  'Hi Ali, I would like to get in touch regarding a project.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cosmic-berry inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-xl active:scale-95"
              >
                <span>WhatsApp Instant</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0C0C0C] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/30 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-[#10B981]" />
                    <span>Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              {personalInfo.resumeUrl && (
                <a
                  href={personalInfo.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-5 py-3.5 text-sm font-medium text-[#A0AEC0] transition hover:text-white"
                >
                  <FileDown className="h-4 w-4" />
                  <span>Resume</span>
                </a>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Minimalist Glassmorphic Direct Inquiry Form */}
        <FadeIn direction="up" delay={0.2}>
          <div className="mt-12 rounded-3xl border border-white/10 bg-[#111318] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <span className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#00F0FF] uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  Quick Direct Inquiry
                </span>
                <h3 className="font-syne text-2xl font-bold text-white mt-1">
                  Send a Direct Message
                </h3>
              </div>
              <p className="text-xs text-[#A0AEC0] max-w-sm">
                Prefer email over WhatsApp? Drop your project overview below for a prioritized technical reply within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-[#10B981]">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="font-syne text-lg font-bold text-white">Inquiry Prepared!</h4>
                <p className="mt-1 text-sm text-[#D7E2EA]">
                  Your mail client has been opened with your inquiry. Ali will review your requirements promptly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-[#A0AEC0] uppercase tracking-wider mb-2">
                      Your Name / Company
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. John Doe / Acme Inc."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#0C0C0C] px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#00F0FF] focus:outline-none focus:ring-1 focus:ring-[#00F0FF]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-[#A0AEC0] uppercase tracking-wider mb-2">
                      Your Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#0C0C0C] px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#00F0FF] focus:outline-none focus:ring-1 focus:ring-[#00F0FF]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label htmlFor="contact-message" className="block text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">
                      Project Scope &amp; Deliverables
                    </label>
                    <div className="flex items-center gap-1.5 overflow-x-auto text-[10px]">
                      <span className="text-gray-500 hidden sm:inline">Templates:</span>
                      <button
                        type="button"
                        onClick={() => applyTemplate('ai-agent')}
                        className="rounded-md border border-cyan-500/30 bg-cyan-950/30 px-2 py-0.5 text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer"
                      >
                        🤖 AI Agent
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplate('fullstack')}
                        className="rounded-md border border-fuchsia-500/30 bg-fuchsia-950/30 px-2 py-0.5 text-fuchsia-300 hover:bg-fuchsia-500/20 transition cursor-pointer"
                      >
                        🌐 Full-Stack
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplate('mobile')}
                        className="rounded-md border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 text-emerald-300 hover:bg-emerald-500/20 transition cursor-pointer"
                      >
                        📱 Mobile App
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplate('consulting')}
                        className="rounded-md border border-amber-500/30 bg-amber-950/30 px-2 py-0.5 text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
                      >
                        ⚡ Advisory
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Tell me about your product, tech stack requirements, timeline, or objectives..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0C0C0C] px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#00F0FF] focus:outline-none focus:ring-1 focus:ring-[#00F0FF] font-sans"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <p className="text-[11px] text-[#A0AEC0]">
                    🔒 All communications and technical IP remain strictly confidential.
                  </p>
                  <button
                    type="submit"
                    className="btn-glow-magenta inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-xl active:scale-95"
                  >
                    <span>Send Project Inquiry</span>
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </FadeIn>

        {/* Contact Methods Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <FadeIn
                key={method.label}
                direction="up"
                delay={0.2 + idx * 0.08}
              >
                <a
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111318] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.5)]"
                  aria-label={method.label}
                >
                  <div>
                    <div
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#0C0C0C] transition-transform duration-300 group-hover:scale-110"
                      style={{ color: method.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="block text-xs font-semibold tracking-wide text-[#A0AEC0] uppercase">
                      {method.label}
                    </span>
                    <p className="mt-1 break-all font-syne text-base font-bold text-white">
                      {method.value}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center gap-1 text-xs font-medium text-[#A0AEC0] transition-colors group-hover:text-white">
                    <span>Direct Outreach</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
