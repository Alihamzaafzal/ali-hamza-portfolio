import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Play,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Database,
  Search,
  Sparkles,
  Terminal,
  Layers,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import SpotlightCard from './SpotlightCard';
import FadeIn from './FadeIn';
import { playClickSound, playPopSound, playChimeSound } from '../utils/audio';

interface WorkflowScenario {
  id: string;
  name: string;
  tag: string;
  domain: string;
  goal: string;
  steps: {
    title: string;
    icon: any;
    engine: string;
    action: string;
    telemetry: string;
    codeSnippet?: string;
  }[];
  finalOutput: string;
  metrics: {
    latency: string;
    tokens: string;
    confidence: string;
  };
}

const SCENARIOS: WorkflowScenario[] = [
  {
    id: 'fintech-agent',
    name: 'Autonomous Cross-Border FX & Compliance Agent',
    tag: 'Fintech & Risk',
    domain: 'SimpliFi Go Architecture',
    goal: 'Audit $120,000 USD to AED supplier transfer, evaluate liquidity pools, verify AML sanction lists, and execute route.',
    steps: [
      {
        title: 'Goal Parsing & Decomposition',
        icon: Bot,
        engine: 'Claude 3.5 Sonnet · Planner Loop',
        action: 'Extracted intent: Transfer verification, AML sanctions check, FX rate comparison across 3 liquidity pools.',
        telemetry: 'Intent Conf: 99.8% · Structured Schema validated',
      },
      {
        title: 'Tool Execution: Vector AML Screening',
        icon: Database,
        engine: 'ChromaDB + Embedding Similarity',
        action: 'Screening beneficiary entity against international sanctions & PEP database with cosine distance < 0.12.',
        telemetry: '0 hits found · Risk Score: 0.02 (Low)',
      },
      {
        title: 'Dynamic Liquidity Provider Query',
        icon: Search,
        engine: 'REST Tool Calling · WebSocket Rates',
        action: 'Querying liquidity providers. Provider B offers best spot rate with 0.04% slippage tolerance.',
        telemetry: 'Latency: 38ms · Optimal Route: Provider B (AED 3.6725)',
      },
      {
        title: 'Self-Correction & Policy Guardrails',
        icon: ShieldCheck,
        engine: 'Guardrails AI + Rule Verification',
        action: 'Asserting compliance threshold, corporate daily spending limit, and two-party signoff requirement.',
        telemetry: 'All 4 compliance constraints passed',
      },
      {
        title: 'Execution & Multi-Currency Ledger Sync',
        icon: Zap,
        engine: 'Transactional MongoDB + Redis Queue',
        action: 'Generated signed transaction payload, locked exchange rate, and dispatched webhook to enterprise ERP.',
        telemetry: 'TxHash: 0x9f4a...8b1c · Settled in 420ms',
      },
    ],
    finalOutput: `{\n  "status": "EXECUTED",\n  "amount_usd": 120000,\n  "settled_aed": 440700,\n  "effective_rate": 3.6725,\n  "compliance_verified": true,\n  "aml_risk_score": 0.02,\n  "route": "SimpliFi-Liquidity-B",\n  "audit_trail_id": "AUD-2026-FX-9941"\n}`,
    metrics: {
      latency: '458ms',
      tokens: '842 tokens',
      confidence: '99.8%',
    },
  },
  {
    id: 'rag-agent',
    name: 'Multi-Source Document Synthesis & Vector RAG Agent',
    tag: 'Enterprise AI & RAG',
    domain: 'Knowledge Retrieval Architecture',
    goal: 'Extract legal covenants, SLA breaches, and financial liabilities from a 140-page enterprise PDF contract.',
    steps: [
      {
        title: 'Document Chunking & Vector Ingestion',
        icon: Layers,
        engine: 'Recursive Splitter + OpenAI text-3-large',
        action: 'Chunked 140 pages into 512-token semantic segments with 20% overlap and metadata tagging.',
        telemetry: 'Ingested 284 chunks · Pinecone Vector Index populated',
      },
      {
        title: 'Hybrid Keyword + Dense Vector Retrieval',
        icon: Search,
        engine: 'BM25 + Dense Cosine Vector Search',
        action: 'Retrieved top-15 relevant clauses matching "termination without cause", "SLA downtime penalties", and "liability cap".',
        telemetry: 'Reciprocal Rank Fusion score: 0.942',
      },
      {
        title: 'Context Re-ranking & Deduplication',
        icon: Cpu,
        engine: 'Cohere Rerank v3 API',
        action: 'Filtered out boilerplate text, prioritizing operational clauses in Section 8.4 and Exhibit C.',
        telemetry: 'Top 5 synthesized passages passed to LLM context',
      },
      {
        title: 'Reasoning & Hallucination Guardrail Check',
        icon: ShieldCheck,
        engine: 'G-Eval + Hallucination Detector',
        action: 'Verified citations against raw PDF coordinates; eliminated ungrounded claims.',
        telemetry: 'Faithfulness Score: 100% · 0 Hallucinations',
      },
      {
        title: 'Structured Synthesis & Citation Generation',
        icon: Sparkles,
        engine: 'GPT-4o Structured JSON Mode',
        action: 'Compiled audit matrix with exact page numbers, risk categories, and clause summaries.',
        telemetry: 'Exported JSON & PDF Brief ready',
      },
    ],
    finalOutput: `{\n  "contract_id": "MSA-2026-ENT",\n  "liability_cap": "12 months trailing fees ($450,000)",\n  "sla_penalty_rate": "5% credit per 30m downtime",\n  "termination_notice": "60 days written notice",\n  "governing_law": "Delaware, USA",\n  "grounded_citations": ["Page 24, §8.4", "Page 89, Ex-C"]\n}`,
    metrics: {
      latency: '1.24s',
      tokens: '2,140 tokens',
      confidence: '99.4%',
    },
  },
  {
    id: 'crm-agent',
    name: 'Autonomous Real Estate CRM & Lead Outreach Agent',
    tag: 'Full-Stack Agentic Automation',
    domain: 'Real Software Architecture',
    goal: 'Qualify inbound buyer leads, match MLS listings in Miami, and draft personalized WhatsApp & Email outreach.',
    steps: [
      {
        title: 'Inbound Webhook Trigger & Parsing',
        icon: Bot,
        engine: 'FastAPI / Express Webhook Listener',
        action: 'Received lead submission: Budget $1.2M - $1.8M, 3+ beds, waterfront preference, pre-approved mortgage.',
        telemetry: 'Lead Enriched · Clear intent profile established',
      },
      {
        title: 'MLS Database Geospatial Query',
        icon: Database,
        engine: 'PostgreSQL PostGIS / MySQL Spatial',
        action: 'Filtered active properties within 5-mile radius of Brickell/Miami Beach matching strict criteria.',
        telemetry: 'Found 4 matching off-market and active listings',
      },
      {
        title: 'Valuation & Price Variance Calculation',
        icon: Search,
        engine: 'Predictive Price Model / RAG Stats',
        action: 'Calculated 12-month historical comp trend; highlighted unit #1402 priced 4.2% below median square-foot price.',
        telemetry: 'Identified prime value proposition for buyer',
      },
      {
        title: 'Multi-Channel Outreach Synthesis',
        icon: Sparkles,
        engine: 'Claude 3.5 Sonnet Persona Orchestrator',
        action: 'Generated high-conversion tailored message referencing specific property attributes and schedule link.',
        telemetry: 'Formatted for WhatsApp Instant and HTML Email',
      },
      {
        title: 'CRM State Update & Auto-Scheduling',
        icon: Zap,
        engine: 'CRM Pipeline Automation Engine',
        action: 'Logged interaction to agent dashboard, tagged as High-Intent, and set follow-up reminder if unread in 24h.',
        telemetry: 'Lead Status: STAGE_OUTREACH_ACTIVE',
      },
    ],
    finalOutput: `{\n  "lead_name": "Marcus Vance",\n  "budget_bracket": "$1.5M - $1.8M",\n  "top_listing": "1000 Brickell Plaza #1402",\n  "discount_to_comp": "4.2%",\n  "outreach_channel": "WhatsApp + Email",\n  "follow_up_scheduled": "2026-09-19 10:00 AM EST"\n}`,
    metrics: {
      latency: '620ms',
      tokens: '980 tokens',
      confidence: '99.6%',
    },
  },
];

export default function AgentWorkflowPlayground() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const scenario = SCENARIOS[activeScenarioIndex];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isRunning) {
      if (currentStep < scenario.steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          playPopSound();
        }, 1100);
      } else {
        setIsRunning(false);
        playChimeSound();
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep, scenario.steps.length]);

  const handleSelectScenario = (index: number) => {
    playClickSound();
    setActiveScenarioIndex(index);
    setCurrentStep(0);
    setIsRunning(false);
  };

  const handleRun = () => {
    playClickSound();
    setCurrentStep(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    playClickSound();
    setCurrentStep(0);
    setIsRunning(false);
  };

  return (
    <section
      id="agent-playground"
      className="site-section relative overflow-hidden bg-[#080B11] px-6 py-24 lg:px-12"
    >
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-[120px]" />

      <div className="section-shell mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <FadeIn direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1 text-xs font-semibold tracking-wider text-cyan-300 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Interactive Architecture Lab</span>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <h2 className="hero-heading mt-3 font-syne text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl text-white">
              Autonomous AI Agent Workflows
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <p className="mt-4 text-base text-gray-400 leading-relaxed max-w-2xl">
              I don&apos;t just write prompts; I architect resilient, multi-tool agentic loops. Select an enterprise scenario below and run the live autonomous reasoning simulator.
            </p>
          </FadeIn>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="mb-8 flex flex-wrap gap-2.5">
          {SCENARIOS.map((s, index) => {
            const isSelected = index === activeScenarioIndex;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectScenario(index)}
                className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-cyan-400/60 bg-[#121A2B] text-white shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                    : 'border-white/10 bg-[#0C101A] text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    isSelected ? 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]' : 'bg-gray-600'
                  }`}
                />
                <span className="font-syne">{s.name}</span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-gray-400">
                  {s.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Simulator Card */}
        <SpotlightCard
          spotlightColor="rgba(0, 240, 255, 0.15)"
          borderColor="rgba(255, 255, 255, 0.14)"
          className="bg-[#0B0F19]/90 backdrop-blur-xl p-6 md:p-8 shadow-2xl"
        >
          {/* Top Bar: Goal Description & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Terminal className="h-3.5 w-3.5" />
                <span>OBJECTIVE · {scenario.domain}</span>
              </div>
              <p className="mt-1.5 text-sm md:text-base font-medium text-gray-200">
                &ldquo;{scenario.goal}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(0,240,255,0.3)] transition hover:brightness-110 disabled:opacity-50 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isRunning ? 'Agent Reasoning...' : 'Run Simulation'}</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setShowJson(!showJson)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-2.5 text-xs font-mono text-gray-300 transition hover:bg-white/10 hover:text-white"
                title="Toggle JSON Output"
              >
                {showJson ? 'View Pipeline' : '{ } JSON'}
              </button>
            </div>
          </div>

          {/* Body: Animated Pipeline or Raw JSON */}
          {!showJson ? (
            <div className="mt-8 space-y-4">
              {scenario.steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isPassed = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
                      isCurrent
                        ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_30px_rgba(0,240,255,0.15)]'
                        : isPassed
                        ? 'border-emerald-500/30 bg-[#0E1524]'
                        : 'border-white/5 bg-[#0A0D15]/50 opacity-40'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start md:items-center gap-3.5">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                            isCurrent
                              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 animate-pulse'
                              : isPassed
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                              : 'border-white/10 bg-white/5 text-gray-500'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <IconComponent className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-gray-500">
                              STEP 0{idx + 1}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-gray-600" />
                            <h4 className="font-syne text-sm font-bold text-white">
                              {step.title}
                            </h4>
                            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono text-cyan-400">
                              {step.engine}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-gray-300">{step.action}</p>
                        </div>
                      </div>

                      {/* Right Telemetry Badge */}
                      <div className="shrink-0 font-mono text-[11px] text-gray-400 bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        {isCurrent && (
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                          </span>
                        )}
                        <span>{step.telemetry}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8">
              <div className="rounded-2xl border border-white/10 bg-[#06090F] p-5 font-mono text-xs text-cyan-300">
                <div className="mb-2 flex items-center justify-between text-gray-500 text-[11px] border-b border-white/10 pb-2">
                  <span>FINAL_STRUCTURED_PAYLOAD.json</span>
                  <span className="text-emerald-400 font-bold">STATE: 200 OK</span>
                </div>
                <pre className="whitespace-pre-wrap overflow-x-auto text-emerald-300 leading-relaxed">
                  {scenario.finalOutput}
                </pre>
              </div>
            </div>
          )}

          {/* Telemetry Metrics Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                Pipeline Latency
              </span>
              <p className="mt-1 text-base font-bold text-cyan-400 font-mono">
                {scenario.metrics.latency}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                Token Consumption
              </span>
              <p className="mt-1 text-base font-bold text-fuchsia-400 font-mono">
                {scenario.metrics.tokens}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                Constraint Verification
              </span>
              <p className="mt-1 text-base font-bold text-emerald-400 font-mono">
                {scenario.metrics.confidence} Validated
              </p>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
