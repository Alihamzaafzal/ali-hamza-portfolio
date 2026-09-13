import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  FolderGit2,
  FileText,
  Mail,
  MessageCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Briefcase,
  X,
} from 'lucide-react';
import { projects, personalInfo } from '../data/portfolio';
import { useScrollNav } from '../hooks/useScrollNav';
import { playClickSound, playChimeSound, toggleAudioMute, isAudioMuted } from '../utils/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { scrollTo } = useScrollNav();

  useEffect(() => {
    setMuted(isAudioMuted());
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      playChimeSound();
      setQuery('');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Command items
  const items = useMemo(() => {
    const navItems = [
      { id: 'nav-hero', label: 'Go to Hero & Overview', category: 'Navigation', icon: Sparkles, action: () => scrollTo('#hero') },
      { id: 'nav-about', label: 'Go to Biography & Philosophy', category: 'Navigation', icon: FileText, action: () => scrollTo('#about') },
      { id: 'nav-skills', label: 'Explore Technical Disciplines & Stack', category: 'Navigation', icon: Layers, action: () => scrollTo('#skills') },
      { id: 'nav-work', label: 'View 9 Production Platforms', category: 'Navigation', icon: FolderGit2, action: () => scrollTo('#projects') },
      { id: 'nav-experience', label: 'Inspect Career Experience & Education', category: 'Navigation', icon: Briefcase, action: () => scrollTo('#experience') },
      { id: 'nav-contact', label: 'Initiate Project Discussion', category: 'Navigation', icon: Mail, action: () => scrollTo('#contact') },
    ];

    const projectItems = projects.map((p) => ({
      id: `proj-${p.id}`,
      label: `${p.title} · ${p.category}`,
      category: 'Projects',
      icon: FolderGit2,
      action: () => {
        scrollTo('#projects');
      },
    }));

    const actionItems = [
      {
        id: 'act-whatsapp',
        label: `WhatsApp Direct (${personalInfo.whatsappDisplay})`,
        category: 'Quick Actions',
        icon: MessageCircle,
        action: () => window.open(`https://wa.me/${personalInfo.whatsapp.replace('+', '')}`, '_blank'),
      },
      {
        id: 'act-email',
        label: `Email (${personalInfo.email})`,
        category: 'Quick Actions',
        icon: Mail,
        action: () => {
          navigator.clipboard.writeText(personalInfo.email);
        },
      },
      {
        id: 'act-sound',
        label: muted ? 'Unmute UI Sound Effects' : 'Mute UI Sound Effects',
        category: 'Quick Actions',
        icon: muted ? VolumeX : Volume2,
        action: () => {
          const next = toggleAudioMute();
          setMuted(next);
        },
      },
    ];

    return [...navItems, ...projectItems, ...actionItems];
  }, [scrollTo, muted]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((it) => it.label.toLowerCase().includes(q) || it.category.toLowerCase().includes(q));
  }, [items, query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
        playClickSound();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
        playClickSound();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          playClickSound();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center pt-20 px-4 sm:px-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#0D1017] shadow-[0_24px_70px_rgba(0,0,0,0.85)]"
          >
            {/* Top Search Input */}
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search className="h-5 w-5 text-[#00F0FF] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type to search sections, 9 platforms, or actions..."
                className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#A0AEC0] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#A0AEC0]">
                  No matching commands or projects found.
                </div>
              ) : (
                filtered.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        item.action();
                        playClickSound();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-white'
                          : 'text-[#D7E2EA] hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isSelected ? 'bg-[#00F0FF] text-[#0C0C0C]' : 'bg-[#111318] text-[#38BDF8]'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <span className="font-medium">{item.label}</span>
                          <span className="ml-2 font-mono text-[10px] uppercase text-[#A0AEC0]">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <ArrowRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? 'translate-x-0.5 text-[#00F0FF]' : 'opacity-20'
                        }`}
                      />
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Hint Footer */}
            <div className="flex items-center justify-between border-t border-white/8 bg-[#090C12] px-4 py-2.5 text-[11px] text-[#A0AEC0]">
              <div className="flex items-center gap-2">
                <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono">↑↓</span>
                <span>to navigate</span>
                <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono">↵</span>
                <span>to select</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono">ESC</span>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
