import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Sparkles } from 'lucide-react';
import { personalInfo, projects } from '../data/portfolio';
import { playClickSound, playChimeSound } from '../utils/audio';
import { triggerParticleBurst } from '../utils/particles';

interface HistoryEntry {
  command: string;
  output: string | React.ReactNode;
}

export default function DevTerminal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: 'system.init',
      output: `Ali Hamza Terminal CLI [Version 4.2.0]\n(c) 2026 Ali Hamza. All rights reserved.\nType 'help' to inspect available commands.`,
    },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }, [isOpen, history]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    playClickSound();
    setCmdHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const parts = cmd.split(' ');
    const main = parts[0].toLowerCase();

    let output: string | React.ReactNode = '';

    switch (main) {
      case 'help':
        output = (
          <div className="space-y-1 text-gray-300">
            <p className="text-cyan-400 font-bold">AVAILABLE COMMANDS:</p>
            <p><span className="text-emerald-400 font-mono">bio</span> - Read Ali&apos;s background and engineering philosophy</p>
            <p><span className="text-emerald-400 font-mono">skills</span> - Inspect technical disciplines and competencies</p>
            <p><span className="text-emerald-400 font-mono">projects</span> - List all 9 live production platforms</p>
            <p><span className="text-emerald-400 font-mono">calc</span> - Jump to interactive project budget calculator</p>
            <p><span className="text-emerald-400 font-mono">contact</span> - Show direct email, WhatsApp, and social channels</p>
            <p><span className="text-emerald-400 font-mono">resume</span> - Open Ali&apos;s resume in a new tab</p>
            <p><span className="text-emerald-400 font-mono">clear</span> - Clear terminal buffer</p>
            <p><span className="text-fuchsia-400 font-mono">sudo hire</span> - Superuser authorization protocol</p>
          </div>
        );
        break;

      case 'bio':
        output = `${personalInfo.name} — Full Stack Engineer & AI Agent Architect.\n${personalInfo.tagline}\n\nExperience: 4+ years shipping production web, mobile, and intelligent multi-tool AI systems. Specialized in MERN, Next.js, LangChain, RAG pipelines, and Three.js.`;
        break;

      case 'skills':
        output = (
          <div className="space-y-1 text-gray-300">
            <p className="text-cyan-400 font-bold">PRIMARY TECH STACK:</p>
            <p><span className="text-white font-semibold">AI &amp; LLM:</span> LangChain, Claude 3.5 &amp; OpenAI APIs, Vector Databases, RAG, Python</p>
            <p><span className="text-white font-semibold">Frontend &amp; 3D:</span> React 19, Next.js, TypeScript, Tailwind CSS, Three.js, GSAP</p>
            <p><span className="text-white font-semibold">Backend &amp; Cloud:</span> Node.js, Express, Laravel PHP, MongoDB, MySQL, WebSockets</p>
            <p><span className="text-white font-semibold">Mobile:</span> Flutter &amp; Dart (iOS/Android), Firebase</p>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-1 text-gray-300">
            <p className="text-cyan-400 font-bold">PRODUCTION PLATFORMS (9):</p>
            {projects.map((p) => (
              <p key={p.id} className="text-xs">
                <span className="text-emerald-400 font-mono">[{p.id}]</span> <span className="text-white font-semibold">{p.title}</span> — <span className="text-gray-400">{p.domain}</span>
              </p>
            ))}
          </div>
        );
        break;

      case 'contact':
        output = `Direct Communication Channels:\n• Email: ${personalInfo.email}\n• WhatsApp: ${personalInfo.whatsappDisplay}\n• LinkedIn: ${personalInfo.linkedin}\n• GitHub: ${personalInfo.github}`;
        break;

      case 'resume':
        window.open('/resume/Ali-Hamza-Resume.txt', '_blank');
        output = `Opening official resume file... [SUCCESS]`;
        break;

      case 'calc':
        onClose();
        document.getElementById('project-calculator')?.scrollIntoView({ behavior: 'smooth' });
        return;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'sudo':
        if (parts[1]?.toLowerCase() === 'hire') {
          playChimeSound();
          if (typeof window !== 'undefined') {
            triggerParticleBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
          }
          output = (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-emerald-300">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                [SUPERUSER ACCESS GRANTED]
              </p>
              <p className="text-xs mt-1">Ali Hamza is currently ready for high-impact contracts &amp; full-time positions. Dispatching WhatsApp chat session...</p>
            </div>
          );
          setTimeout(() => {
            window.open(`https://wa.me/${personalInfo.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi Ali, I ran sudo hire on your terminal!')}`, '_blank');
          }, 1200);
        } else {
          output = `sudo: ${parts.slice(1).join(' ')}: command not found. Try 'sudo hire'.`;
        }
        break;

      default:
        output = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
        break;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInputVal('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#070A10]/95 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-2xl font-mono text-xs flex flex-col h-[480px]"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#0B0F19] px-4 py-3 select-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block cursor-pointer hover:opacity-80" onClick={onClose} />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="ml-3 flex items-center gap-1.5 text-gray-300 font-semibold text-[11px]">
                  <TerminalIcon className="h-3.5 w-3.5 text-cyan-400" />
                  ali@hamza-portfolio:~$
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500">ESC to exit</span>
                <button
                  onClick={onClose}
                  className="rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Logs & Output */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-gray-300 leading-relaxed">
              {history.map((h, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span className="text-gray-500">➜</span>
                    <span className="font-bold">{h.command}</span>
                  </div>
                  <div className="pl-4 whitespace-pre-line text-gray-300">{h.output}</div>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Prompt */}
            <div className="border-t border-white/10 bg-[#090D15] p-3 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">➜</span>
              <span className="text-cyan-400">~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type 'help', 'skills', 'projects', 'sudo hire'..."
                className="flex-1 bg-transparent text-white outline-none placeholder-gray-600 font-mono text-xs"
                autoFocus
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
