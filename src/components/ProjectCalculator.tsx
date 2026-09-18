import { useState, useMemo } from 'react';
import {
  Calculator,
  Check,
  Sparkles,
  MessageCircle,
  Mail,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  Smartphone,
  Globe,
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import FadeIn from './FadeIn';
import { personalInfo } from '../data/portfolio';
import { playClickSound, playPopSound } from '../utils/audio';

interface PlatformOption {
  id: string;
  title: string;
  desc: string;
  baseCost: number;
  baseWeeks: number;
  icon: any;
}

const PLATFORMS: PlatformOption[] = [
  {
    id: 'ai-agent',
    title: 'Autonomous AI Agent / RAG',
    desc: 'LangChain, Claude/GPT-4o APIs, Vector DB, autonomous multi-tool reasoning loops',
    baseCost: 2400,
    baseWeeks: 3,
    icon: Cpu,
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Web App',
    desc: 'Next.js, React 19, Node.js/Express, MongoDB/MySQL, high-speed API architecture',
    baseCost: 2000,
    baseWeeks: 3,
    icon: Layers,
  },
  {
    id: 'mobile',
    title: 'Cross-Platform Mobile App',
    desc: 'Flutter & Dart for iOS + Android, offline synchronization, Firebase backend',
    baseCost: 2200,
    baseWeeks: 4,
    icon: Smartphone,
  },
  {
    id: '3d-webgl',
    title: '3D WebGL / Interactive Brand',
    desc: 'Three.js, GSAP choreography, hardware-accelerated shaders, cinematic SPA',
    baseCost: 1800,
    baseWeeks: 2,
    icon: Globe,
  },
];

const SCALES = [
  { id: 'mvp', title: 'MVP / Validation', multiplier: 1.0, weeksBonus: 0, desc: 'Core feature set ready to pitch or launch fast.' },
  { id: 'production', title: 'Production Scale', multiplier: 1.5, weeksBonus: 2, desc: 'High traffic, optimized caching, comprehensive testing.' },
  { id: 'enterprise', title: 'Enterprise & Multi-Tenant', multiplier: 2.1, weeksBonus: 4, desc: 'Strict RBAC, audit logging, multi-region high availability.' },
];

const ADDONS = [
  { id: 'auth-rbac', label: 'OAuth & Role-Based Access (RBAC)', cost: 400, weeks: 0.5 },
  { id: 'payments', label: 'Payment Gateway (Stripe / Cards / FX)', cost: 600, weeks: 1 },
  { id: 'rag-vector', label: 'Vector Search & Pinecone Embeddings', cost: 750, weeks: 1 },
  { id: 'admin-crm', label: 'Custom Admin Dashboard & Analytics', cost: 650, weeks: 1 },
  { id: 'websockets', label: 'Live WebSockets / Real-time Sync', cost: 500, weeks: 0.5 },
];

export default function ProjectCalculator({
  onPreFillContact,
}: {
  onPreFillContact?: (message: string) => void;
}) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ai-agent');
  const [selectedScale, setSelectedScale] = useState<string>('mvp');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['rag-vector', 'admin-crm']);
  const [isFastTrack, setIsFastTrack] = useState<boolean>(false);

  const toggleAddon = (id: string) => {
    playClickSound();
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculation = useMemo(() => {
    const platform = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0];
    const scale = SCALES.find((s) => s.id === selectedScale) || SCALES[0];

    const addonsCost = selectedAddons.reduce((sum, id) => {
      const addon = ADDONS.find((a) => a.id === id);
      return sum + (addon ? addon.cost : 0);
    }, 0);

    const addonsWeeks = selectedAddons.reduce((sum, id) => {
      const addon = ADDONS.find((a) => a.id === id);
      return sum + (addon ? addon.weeks : 0);
    }, 0);

    let totalCost = (platform.baseCost + addonsCost) * scale.multiplier;
    let totalWeeks = Math.ceil((platform.baseWeeks + scale.weeksBonus + addonsWeeks) * (isFastTrack ? 0.7 : 1.0));

    if (isFastTrack) {
      totalCost *= 1.25; // Rush delivery rate
    }

    const minEstimate = Math.round(totalCost * 0.9);
    const maxEstimate = Math.round(totalCost * 1.15);

    return {
      platform,
      scale,
      minEstimate,
      maxEstimate,
      weeks: Math.max(2, totalWeeks),
    };
  }, [selectedPlatform, selectedScale, selectedAddons, isFastTrack]);

  const projectBriefText = `Hello Ali, I calculated a project estimate on your portfolio:
• Architecture: ${calculation.platform.title}
• Scope Scale: ${calculation.scale.title}
• Selected Features: ${
    selectedAddons.length > 0
      ? selectedAddons
          .map((id) => ADDONS.find((a) => a.id === id)?.label)
          .filter(Boolean)
          .join(', ')
      : 'Core standard'
  }
• Fast-Track Rush: ${isFastTrack ? 'Yes (Accelerated)' : 'No (Standard)'}
• Estimated Budget Range: $${calculation.minEstimate.toLocaleString()} - $${calculation.maxEstimate.toLocaleString()} USD
• Estimated Timeline: ~${calculation.weeks} weeks

I would like to discuss feasibility and your soonest availability.`;

  const handleSendToWhatsApp = () => {
    playPopSound();
    window.open(
      `https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent(
        projectBriefText
      )}`,
      '_blank'
    );
  };

  const handlePreFill = () => {
    playPopSound();
    if (onPreFillContact) {
      onPreFillContact(projectBriefText);
    }
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="project-calculator"
      className="site-section relative overflow-hidden bg-[#090C13] px-6 py-24 lg:px-12"
    >
      <div className="section-shell mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <FadeIn direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-950/30 px-3.5 py-1 text-xs font-semibold tracking-wider text-fuchsia-300 uppercase">
              <Calculator className="h-3.5 w-3.5 text-fuchsia-400" />
              <span>Project Estimator &amp; Scope Builder</span>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <h2 className="hero-heading mt-3 font-syne text-3xl font-bold tracking-tight md:text-5xl text-white">
              Estimate Your Next Milestone
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="mt-3 text-sm md:text-base text-gray-400 leading-relaxed">
              Transparent, engineering-first pricing. Configure your system parameters to receive an instant scope brief and estimated turnaround.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Configuration Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Platform */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                01 · Core Architecture
              </label>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PLATFORMS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = p.id === selectedPlatform;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedPlatform(p.id);
                      }}
                      className={`relative flex flex-col p-4 text-left rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                          : 'border-white/10 bg-[#0E131F]/70 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-400/20 text-cyan-300'
                              : 'border-white/10 bg-white/5 text-gray-400'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        {isSelected && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-black">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2.5 font-syne text-sm font-bold text-white">
                        {p.title}
                      </h4>
                      <p className="mt-1 text-xs text-gray-400 leading-snug">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: System Scale */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-fuchsia-400">
                02 · System Scale &amp; Maturity
              </label>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SCALES.map((s) => {
                  const isSelected = s.id === selectedScale;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedScale(s.id);
                      }}
                      className={`p-3.5 text-left rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-fuchsia-400 bg-fuchsia-950/30 shadow-[0_0_20px_rgba(217,70,239,0.15)]'
                          : 'border-white/10 bg-[#0E131F]/70 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-syne text-xs font-bold text-white">{s.title}</h4>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-fuchsia-400 stroke-[3]" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-gray-400 leading-snug">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Addon Capabilities */}
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                03 · Feature Add-ons &amp; Integrations
              </label>
              <div className="mt-3 space-y-2">
                {ADDONS.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-400/60 bg-emerald-950/20 text-white'
                          : 'border-white/10 bg-[#0E131F]/50 text-gray-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-400 text-black'
                              : 'border-white/20 bg-black/40'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="font-medium text-gray-200">{addon.label}</span>
                      </div>
                      <span className="font-mono text-[11px] text-gray-400">
                        +${addon.cost}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fast-Track Delivery Switch */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#0E131F]/90">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <div>
                  <h5 className="text-xs font-bold text-white font-syne">
                    Fast-Track Sprint Acceleration
                  </h5>
                  <p className="text-[11px] text-gray-400">
                    Prioritize development cycle for ~30% faster deployment.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setIsFastTrack(!isFastTrack);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isFastTrack ? 'bg-cyan-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isFastTrack ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Real-time Dynamic Summary Card (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <SpotlightCard
              spotlightColor="rgba(217, 70, 239, 0.15)"
              borderColor="rgba(255, 255, 255, 0.18)"
              className="bg-[#0C101A]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                    SCOPE SUMMARY
                  </span>
                  <h3 className="font-syne text-lg font-bold text-white">Estimated Investment</h3>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 text-white shadow-md">
                  <Calculator className="h-4 w-4" />
                </div>
              </div>

              {/* Price Bracket Display */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#070A10] p-5 text-center">
                <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
                  Estimated Bracket (USD)
                </span>
                <div className="mt-1 font-syne text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400">
                  ${calculation.minEstimate.toLocaleString()} – ${calculation.maxEstimate.toLocaleString()}
                </div>
                <p className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Milestone-based · 0 upfront lock-in
                </p>
              </div>

              {/* Timeline Gauge */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs">
                <span className="flex items-center gap-2 text-gray-400 font-medium">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  Delivery Timeline:
                </span>
                <span className="font-mono font-bold text-white">
                  ~{calculation.weeks} Weeks {isFastTrack && '(Accelerated)'}
                </span>
              </div>

              {/* Included Specifications */}
              <div className="mt-5 space-y-2 text-xs text-gray-300">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Architecture:</span>
                  <span className="font-medium text-white">{calculation.platform.title}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Tier:</span>
                  <span className="font-medium text-white">{calculation.scale.title}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Custom Modules:</span>
                  <span className="font-medium text-white">{selectedAddons.length} Selected</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-7 space-y-2.5">
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-xs font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] transition hover:brightness-110 active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Send Brief to WhatsApp Instant</span>
                </button>

                <button
                  onClick={handlePreFill}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/10 active:scale-98 cursor-pointer"
                >
                  <Mail className="h-4 w-4 text-cyan-400" />
                  <span>Pre-Fill Portfolio Contact Form</span>
                </button>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
