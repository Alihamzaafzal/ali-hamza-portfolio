import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

/** Renders a single digit column that rolls from 0→target with slot-machine animation */
function OdometerDigit({ target, delay = 0 }: { target: string; delay?: number }) {
  const [active, setActive] = useState(false);
  const isNumeric = /^\d$/.test(target);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  if (!isNumeric) {
    // Non-numeric characters ("+", "%", etc.) just fade in
    return (
      <span
        className="inline-block transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0, transitionDelay: `${delay}s` }}
      >
        {target}
      </span>
    );
  }

  const digits = Array.from({ length: parseInt(target, 10) + 1 }, (_, i) => i);
  const itemH = 1; // em
  const translateY = active ? -(digits.length - 1) * itemH : 0;

  return (
    <span
      className="odometer-digit"
      style={{ height: `${itemH}em`, fontSize: 'inherit' }}
      aria-hidden="true"
    >
      <span
        className="odometer-column"
        style={{
          transform: `translateY(${translateY}em)`,
          transitionDuration: `${0.7 + parseInt(target, 10) * 0.05}s`,
          transitionDelay: `${delay}s`,
        }}
      >
        {digits.map((d) => (
          <span key={d} style={{ display: 'block', height: `${itemH}em`, lineHeight: `${itemH}em` }}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function AnimatedCounter({ value, className = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -50px 0px' });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !triggered) setTriggered(true);
  }, [isInView, triggered]);

  // Parse value into characters — each digit gets its own odometer column
  const chars = value.split('');

  return (
    <span
      ref={ref}
      className={`inline-flex items-end leading-none ${className}`}
      style={{ overflow: 'hidden' }}
    >
      {triggered
        ? chars.map((ch, i) => (
            <OdometerDigit key={i} target={ch} delay={i * 0.04} />
          ))
        : // Before triggered: render invisible placeholder to hold size
          chars.map((ch, i) => (
            <span key={i} style={{ opacity: 0 }}>
              {ch}
            </span>
          ))}
      {/* Screen-reader accessible value */}
      <span className="sr-only">{value}</span>
    </span>
  );
}
