import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  X,
  Send,
  FileDown,
  MessageCircle,
  FolderGit2,
  Copy,
  Check,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { personalInfo, projects, techStack } from '../data/portfolio';
import { playClickSound, playPopSound, playChimeSound } from '../utils/audio';
import { triggerParticleBurst } from '../utils/particles';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    action: () => void;
    icon?: 'resume' | 'whatsapp' | 'project' | 'copy';
  }[];
}

const INITIAL_SUGGESTIONS = [
  'What AI agents has Ali built?',
  'Recommend a project for fintech/payments',
  'Is Ali available for hire right now?',
  'Give me a summary of Ali’s core skills',
  'How do I get in touch with Ali directly?',
];

export default function AiCopilot({
  onOpenProject,
}: {
  onOpenProject?: (projectId: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'agent',
      text: `Hello! I'm **Hamza AI**, Ali's autonomous portfolio copilot. I'm trained on Ali's engineering track record, AI agent architectures, and 9 production applications. How can I assist your team or project today?`,
      timestamp: 'Just now',
      actions: [
        {
          label: 'View SimpliFi Go (Fintech)',
          action: () => {
            const p = projects.find((x) => x.id === 1);
            if (p && onOpenProject) onOpenProject(p.id);
            const el = document.getElementById('projects');
            el?.scrollIntoView({ behavior: 'smooth' });
          },
          icon: 'project',
        },
        {
          label: 'Download Resume',
          action: () => {
            window.open('/resume/Ali-Hamza-Resume.txt', '_blank');
          },
          icon: 'resume',
        },
        {
          label: 'WhatsApp Direct',
          action: () => {
            window.open(
              `https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent(
                'Hi Ali, I was exploring your portfolio with Hamza AI and would like to discuss a project.'
              )}`,
              '_blank'
            );
          },
          icon: 'whatsapp',
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateAgentResponse = (query: string): Omit<Message, 'id' | 'timestamp'> => {
    const q = query.toLowerCase();

    // Fintech / SimpliFi Go
    if (q.includes('fintech') || q.includes('payment') || q.includes('card') || q.includes('simplifi')) {
      return {
        sender: 'agent',
        text: `For fintech and cross-border payments, Ali engineered **SimpliFi Go** (https://simplifigo.com/). It's a high-performance Next.js corporate card and multi-currency spend management platform built for GCC enterprises, featuring PCI-DSS compliant workflows, real-time analytics, and instant card freezing.`,
        actions: [
          {
            label: 'Explore SimpliFi Go Details',
            action: () => {
              if (onOpenProject) onOpenProject(1);
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'project',
          },
          {
            label: 'Discuss Fintech Project',
            action: () => {
              window.open(`https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Ali, I want to discuss a Fintech project.')}`, '_blank');
            },
            icon: 'whatsapp',
          },
        ],
      };
    }

    // AI Agents / RAG / LLM
    if (q.includes('ai agent') || q.includes('agent') || q.includes('rag') || q.includes('llm') || q.includes('claude') || q.includes('openai') || q.includes('langchain')) {
      return {
        sender: 'agent',
        text: `Ali specializes as an **AI Agent Architect & Developer**. His core AI stack includes **LangChain, OpenAI & Claude APIs, Vector Databases (Pinecone/Chroma), Function Calling, RAG pipelines, and Autonomous Agentic Loops**. He designs multi-tool reasoning agents that autonomously decompose goals, query internal knowledge bases, and trigger self-correcting validation flows.`,
        actions: [
          {
            label: 'Inspect Agent Workflow Simulator',
            action: () => {
              document.getElementById('agent-playground')?.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'project',
          },
          {
            label: 'Hire Ali for AI Agents',
            action: () => {
              window.open(`https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Ali, I need an Autonomous AI Agent architected.')}`, '_blank');
            },
            icon: 'whatsapp',
          },
        ],
      };
    }

    // Availability / Rates / Hire
    if (q.includes('available') || q.includes('hire') || q.includes('rate') || q.includes('cost') || q.includes('full time') || q.includes('contract') || q.includes('freelance')) {
      return {
        sender: 'agent',
        text: `Ali is **currently available** for high-impact full-stack engineering, contract roles, and autonomous AI agent systems. Based in PKT (UTC+5), he seamlessly overlaps with US, European, and Gulf (GCC) working hours. Flexible on hourly, milestone, or full-time engagements.`,
        actions: [
          {
            label: 'Calculate Project Scope & Budget',
            action: () => {
              document.getElementById('project-calculator')?.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'project',
          },
          {
            label: 'Direct WhatsApp Chat',
            action: () => {
              window.open(`https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Ali, are you available for an upcoming project?')}`, '_blank');
            },
            icon: 'whatsapp',
          },
        ],
      };
    }

    // Skills / Stack
    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('react') || q.includes('node') || q.includes('python')) {
      const topSkills = techStack.slice(0, 8).join(', ');
      return {
        sender: 'agent',
        text: `Ali is a senior full-stack engineer and AI architect with 4+ years of shipping enterprise production systems. His primary stack: **${topSkills}**, plus Three.js WebGL, Tailwind CSS, Flutter, MySQL, and Docker/CI-CD.`,
        actions: [
          {
            label: 'View Detailed Skills Matrix',
            action: () => {
              document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'project',
          },
          {
            label: 'Download Resume',
            action: () => window.open('/resume/Ali-Hamza-Resume.txt', '_blank'),
            icon: 'resume',
          },
        ],
      };
    }

    // Contact / Email / Phone
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('whatsapp') || q.includes('reach') || q.includes('talk')) {
      return {
        sender: 'agent',
        text: `You can reach Ali directly:\n• **Email**: ${personalInfo.email}\n• **WhatsApp**: ${personalInfo.whatsappDisplay}\n• **LinkedIn**: /in/rai-ali-hamza-12a414386\n• **GitHub**: github.com/Alihamzaafzal\nHe typically responds within 1–2 hours.`,
        actions: [
          {
            label: 'Copy Email to Clipboard',
            action: copyEmail,
            icon: 'copy',
          },
          {
            label: 'Instant WhatsApp',
            action: () => {
              window.open(`https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Ali, reaching out from your portfolio!')}`, '_blank');
            },
            icon: 'whatsapp',
          },
        ],
      };
    }

    // Real estate / Real Software
    if (q.includes('real estate') || q.includes('crm') || q.includes('real software')) {
      return {
        sender: 'agent',
        text: `Ali built **Real Software** (https://testreal-olive.vercel.app/), an all-in-one real estate automation and CRM platform with dynamic agent sites, domain hosting, listing social syndication, and interactive property analytics.`,
        actions: [
          {
            label: 'View Real Software Project',
            action: () => {
              if (onOpenProject) onOpenProject(2);
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            },
            icon: 'project',
          },
        ],
      };
    }

    // Default fallback
    return {
      sender: 'agent',
      text: `Thanks for asking! Ali Hamza brings 4+ years of end-to-end expertise in modern web systems, high-speed MERN/Next.js architectures, and autonomous AI agents. Would you like to review his 9 featured projects, check his availability, or initiate a direct chat on WhatsApp?`,
      actions: [
        {
          label: 'Browse All 9 Projects',
          action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }),
          icon: 'project',
        },
        {
          label: 'Launch WhatsApp',
          action: () => {
            window.open(`https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Ali, would love to connect.')}`, '_blank');
          },
          icon: 'whatsapp',
        },
      ],
    };
  };

  const handleSend = (userText?: string) => {
    const query = userText || inputQuery;
    if (!query.trim() || isTyping) return;

    playClickSound();
    const newMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: query.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate AI cognitive stream delay
    setTimeout(() => {
      const resp = generateAgentResponse(query);
      const agentMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'agent',
        text: resp.text,
        timestamp: 'Just now',
        actions: resp.actions,
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
      playPopSound();
    }, 650);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      {/* Floating Launcher Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                playChimeSound();
                triggerParticleBurst(e.clientX, e.clientY, 12);
                setIsOpen(true);
                setIsMinimized(false);
              }}
              className="group relative flex items-center gap-3 rounded-full border border-cyan-400/30 bg-[#090D16]/95 px-4 py-3 shadow-[0_10px_35px_rgba(0,240,255,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_10px_45px_rgba(0,240,255,0.4)]"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 text-white shadow-md">
                <Bot className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]" />
                </span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wide text-white">Hamza AI</span>
                  <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-cyan-300">COPILOT</span>
                </div>
                <p className="text-[10px] text-gray-400">Ask anything · Instant answer</p>
              </div>

              {hasUnread && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-fuchsia-500 text-[9px] font-bold text-white shadow-lg animate-bounce">
                  1
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? '64px' : '540px',
            }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2.5rem)] sm:w-[420px] max-w-full overflow-hidden rounded-3xl border border-white/15 bg-[#0A0D15]/95 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0F1422]/90 px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 text-white shadow-md">
                  <Bot className="h-4 w-4" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-white">Hamza AI Copilot</h4>
                    <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono">Model: Grounded Portfolio Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setIsOpen(false);
                  }}
                  className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                            : 'border border-white/10 bg-[#121726] text-gray-200 shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      {/* Action Chips */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.actions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                playClickSound();
                                act.action();
                              }}
                              className="group inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-950/40 px-2.5 py-1 text-[11px] font-medium text-cyan-300 transition-all hover:border-cyan-400 hover:bg-cyan-500/20 active:scale-95"
                            >
                              {act.icon === 'resume' && <FileDown className="h-3 w-3" />}
                              {act.icon === 'whatsapp' && <MessageCircle className="h-3 w-3 text-emerald-400" />}
                              {act.icon === 'project' && <FolderGit2 className="h-3 w-3 text-fuchsia-400" />}
                              {act.icon === 'copy' && (copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />)}
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <span className="mt-1 px-1 text-[9px] text-gray-500">{msg.timestamp}</span>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs px-2">
                      <Bot className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                      <span>Hamza AI is thinking...</span>
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                      </span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Quick Questions */}
                <div className="border-t border-white/8 bg-[#0B0F19]/90 px-3 py-2">
                  <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-gray-400">Suggested queries:</p>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                    {INITIAL_SUGGESTIONS.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(sug)}
                        className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-gray-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <form
                  onSubmit={onSubmit}
                  className="flex items-center gap-2 border-t border-white/10 bg-[#0C111E] p-2.5"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Ask about projects, AI agents, stack..."
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition focus:border-cyan-400/50 focus:bg-white/10"
                  />
                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isTyping}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 text-white shadow transition-all hover:opacity-90 disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
