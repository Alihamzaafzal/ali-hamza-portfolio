import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'view'>('default');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isViewable = target.closest('[data-cursor="view"]') || target.closest('.group\\/screenshot');
      const isClickable = target.closest('a, button, [role="button"], input, textarea');

      if (isViewable) {
        setCursorType('view');
      } else if (isClickable) {
        setCursorType('pointer');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Spring Follower Ring / Pill */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none absolute flex items-center justify-center transition-[width,height,border-radius,background-color] duration-200 ease-out"
        animate={{
          width: cursorType === 'view' ? 68 : cursorType === 'pointer' ? 44 : 28,
          height: cursorType === 'view' ? 26 : cursorType === 'pointer' ? 44 : 28,
          borderRadius: cursorType === 'view' ? 999 : 999,
          borderColor: cursorType === 'view' ? 'rgba(0, 240, 255, 0.8)' : 'rgba(255, 255, 255, 0.4)',
          backgroundColor: cursorType === 'view' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
          backdropFilter: cursorType === 'view' ? 'blur(4px)' : 'none',
        }}
      >
        {cursorType === 'view' && (
          <span className="font-mono text-[9px] font-bold tracking-widest text-[#00F0FF] uppercase">
            VIEW
          </span>
        )}
      </motion.div>

      {/* Center Pinpoint Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]"
        animate={{
          scale: cursorType === 'view' ? 0 : cursorType === 'pointer' ? 1.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
