import { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import ExperienceSection from './components/ExperienceSection';
import Projects from './components/Projects';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import ScrollProgress from './components/ScrollProgress';
import SmoothScroll from './components/SmoothScroll';
import SectionDivider from './components/SectionDivider';

function App() {
  const [loading, setLoading] = useState(true);
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
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
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      
      <div
        className={`transition-opacity duration-700 ease-out ${
          loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <SmoothScroll>
          <ScrollProgress />
          <Navbar onOpenCommandPalette={() => setCmdOpen(true)} />
          <main>
            <Hero />
            <SectionDivider />
            <About />
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
            <Contact />
          </main>
          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}

export default App;
