import { useState, useEffect, useCallback, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { FileDown, ArrowUpRight, Command, Volume2, VolumeX } from 'lucide-react';
import { navLinks, personalInfo } from '../data/portfolio';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrollNav } from '../hooks/useScrollNav';
import { isAudioMuted, toggleAudioMute, playClickSound } from '../utils/audio';

const SECTION_IDS = ['hero', ...navLinks.map((l) => l.href.replace('#', ''))];

export default function Navbar({
  onOpenCommandPalette,
}: {
  onOpenCommandPalette?: () => void;
} = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pktTime, setPktTime] = useState('');
  const [soundMuted, setSoundMuted] = useState(() => isAudioMuted());
  const activeId = useActiveSection(SECTION_IDS);
  const { scrollTo } = useScrollNav();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setPktTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) return;
      e.preventDefault();
      scrollTo(href);
      setMenuOpen(false);
    },
    [scrollTo],
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 right-0 left-0 z-50 px-4 transition-all duration-500 md:px-8 ${
        scrolled ? 'pt-3' : 'pt-6'
      }`}
    >
      <nav
        className={`mx-auto max-w-6xl w-full transition-all duration-500 ${
          scrolled || menuOpen
            ? 'rounded-full border border-white/12 bg-[#0A0A0A]/95 px-6 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl'
            : 'rounded-full border border-white/8 bg-[#0A0A0A]/80 px-6 py-2.5 backdrop-blur-xl'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand with vibrant cyan dot */}
          <a
            href="#hero"
            className="font-syne text-base font-bold tracking-tight text-white transition hover:opacity-80"
            onClick={(e) => handleNavClick(e, '#hero')}
          >
            ALI HAMZA<span className="text-[#00F0FF]">.</span>
          </a>

          {/* Nav Links */}
          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeId === link.href.replace('#', '');
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`relative text-xs font-medium tracking-wide transition-opacity duration-200 hover:opacity-80 ${
                      isActive ? 'text-white' : 'text-[#B0BEC5]'
                    }`}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-[#00F0FF] to-[#D946EF]" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Action Buttons: Search, Sound Toggle, Timezone, Resume & Contact */}
          <div className="hidden items-center gap-2.5 md:flex">
            {/* Ctrl+K Search Trigger */}
            <button
              type="button"
              onClick={() => {
                onOpenCommandPalette?.();
                playClickSound();
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs text-[#A0AEC0] transition hover:border-[#00F0FF]/40 hover:text-white active:scale-95"
              title="Search & Command Menu (Ctrl+K)"
            >
              <Command className="h-3 w-3 text-[#00F0FF]" />
              <span className="font-mono text-[10px]">Ctrl K</span>
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = toggleAudioMute();
                setSoundMuted(next);
                playClickSound();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#A0AEC0] transition hover:border-white/25 hover:text-white active:scale-95"
              title={soundMuted ? 'Unmute UI Audio' : 'Mute UI Audio'}
            >
              {soundMuted ? (
                <VolumeX className="h-3.5 w-3.5 text-red-400" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#00F0FF]" />
              )}
            </button>

            {pktTime && (
              <div className="hidden xl:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-[#A0AEC0]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                </span>
                <span className="font-mono text-white/90">{pktTime} PKT</span>
              </div>
            )}

            {personalInfo.resumeUrl && (
              <a
                href={personalInfo.resumeUrl}
                download
                onClick={() => playClickSound()}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <FileDown className="h-3.5 w-3.5 text-white/70" />
                Resume
              </a>
            )}

            <a
              href="#contact"
              className="btn-glow-magenta inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold text-white active:scale-95"
              onClick={(e) => {
                handleNavClick(e, '#contact');
                playClickSound();
              }}
            >
              <span>Contact</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="flex flex-col gap-1.5 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="mt-4 border-t border-white/10 pt-4 lg:hidden">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:bg-white/5"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 border-t border-white/10 pt-3">
                <a
                  href="#contact"
                  className="btn-cosmic-berry block w-full rounded-full py-2.5 text-center text-sm font-semibold text-white"
                  onClick={(e) => handleNavClick(e, '#contact')}
                >
                  Contact Me
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </motion.header>
  );
}
