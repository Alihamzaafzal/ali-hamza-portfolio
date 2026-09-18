import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import AgentWorkflowPlayground from './components/AgentWorkflowPlayground';
import Skills from './components/Skills';
import ExperienceSection from './components/ExperienceSection';
import Projects from './components/Projects';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import ProjectCalculator from './components/ProjectCalculator';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import DevTerminal from './components/DevTerminal';
import AiCopilot from './components/AiCopilot';
import ScrollProgress from './components/ScrollProgress';
import SmoothScroll from './components/SmoothScroll';
import SectionDivider from './components/SectionDivider';
import { getInitialTheme, applyTheme, type Theme } from './utils/theme';

function App() {
  const [loading, setLoading] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [contactPrefill, setContactPrefill] = useState('');
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (!isInput && (e.key === '`' || ((e.ctrlKey || e.metaKey) && e.key === '\\'))) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <div className="page-bg" aria-hidden="true" />
      <div className="noise-overlay" aria-hidden="true" />
      <CursorGlow />
      <CustomCursor />
      
      {/* Interactive Command Palette & Developer Terminal */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onOpenTerminal={() => setTerminalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <DevTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      {/* Floating Grounded AI Copilot */}
      <AiCopilot />
      
      <div
        className={`transition-opacity duration-700 ease-out ${
          loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <SmoothScroll>
          <ScrollProgress />
          <Navbar
            onOpenCommandPalette={() => setCmdOpen(true)}
            onOpenTerminal={() => setTerminalOpen(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
          <main>
            {/* Hero Section preserved completely intact as requested */}
            <Hero />
            <SectionDivider />
            <About />
            <SectionDivider />
            <AgentWorkflowPlayground />
            <SectionDivider />
            <Skills />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <ExperienceSection />
            <SectionDivider />
            <Services />
            <SectionDivider />
            <Testimonials />
            <SectionDivider />
            <ProjectCalculator onPreFillContact={(msg) => setContactPrefill(msg)} />
            <SectionDivider />
            <Contact prefillMessage={contactPrefill} />
          </main>
          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}

export default App;
