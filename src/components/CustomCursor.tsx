import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorType = 'default' | 'pointer' | 'view';

/* Color palette for each cursor state */
const CURSOR_COLORS: Record<CursorType, { dot: string; ring: string }> = {
  default: { dot: '#00F0FF', ring: 'rgba(0,240,255,0.35)' },
  pointer: { dot: '#E879F9', ring: 'rgba(232,121,249,0.45)' },
  view:    { dot: '#10B981', ring: 'rgba(16,185,129,0.4)' },
};

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>('default');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Primary ring — follows closely
  const primarySpring = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, primarySpring);
  const smoothY = useSpring(mouseY, primarySpring);

  // Trailing ring — follows with deliberate spring lag
  const trailSpring = { damping: 18, stiffness: 120, mass: 0.8 };
  const trailX = useSpring(mouseX, trailSpring);
  const trailY = useSpring(mouseY, trailSpring);

  const isVisibleRef = useRef(false);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

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

  const colors = CURSOR_COLORS[cursorType];

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">

      {/* ── Slow trailing outer ring (spring lagged) ── */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        animate={{
          width: cursorType === 'view' ? 56 : cursorType === 'pointer' ? 48 : 38,
          height: cursorType === 'view' ? 56 : cursorType === 'pointer' ? 48 : 38,
          borderColor: colors.ring,
          opacity: 0.6,
        }}
        transition={{ duration: 0.25 }}
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          border: `1.5px solid ${colors.ring}`,
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Primary ring / pill (smooth follow) ── */}
      <motion.div
        className="pointer-events-none absolute flex items-center justify-center transition-[width,height,border-radius] duration-200 ease-out"
        animate={{
          width: cursorType === 'view' ? 68 : cursorType === 'pointer' ? 44 : 22,
          height: cursorType === 'view' ? 26 : cursorType === 'pointer' ? 44 : 22,
          borderRadius: 999,
          borderColor: cursorType === 'view' ? 'rgba(16,185,129,0.9)' : cursorType === 'pointer' ? 'rgba(232,121,249,0.8)' : 'rgba(0,240,255,0.5)',
          backgroundColor: cursorType === 'view' ? 'rgba(16,185,129,0.15)' : cursorType === 'pointer' ? 'rgba(232,121,249,0.08)' : 'rgba(0,240,255,0.04)',
        }}
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          border: '1px solid',
          mixBlendMode: 'screen',
        }}
      >
        {cursorType === 'view' && (
          <span className="font-mono text-[9px] font-bold tracking-widest text-emerald-400 uppercase">
            VIEW
          </span>
        )}
      </motion.div>

      {/* ── Center pinpoint dot — snaps instantly to mouse ── */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="pointer-events-none absolute rounded-full"
        animate={{
          width: cursorType === 'view' ? 0 : 5,
          height: cursorType === 'view' ? 0 : 5,
          backgroundColor: colors.dot,
          boxShadow: `0 0 6px ${colors.dot}, 0 0 12px ${colors.dot}`,
          scale: cursorType === 'pointer' ? 1.4 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
