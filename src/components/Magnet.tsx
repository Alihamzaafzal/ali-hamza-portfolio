import { useRef, useState, useEffect, type ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  proximityPadding?: number;
  dampingFactor?: number;
  className?: string;
}

export default function Magnet({
  children,
  proximityPadding = 150,
  dampingFactor = 3,
  className = '',
}: MagnetProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      const halfWidth = rect.width / 2 + proximityPadding;
      const halfHeight = rect.height / 2 + proximityPadding;

      if (
        Math.abs(distX) <= halfWidth &&
        Math.abs(distY) <= halfHeight
      ) {
        setIsHovered(true);
        setPosition({
          x: distX / dampingFactor,
          y: distY / dampingFactor,
        });
      } else {
        if (isHovered) {
          setIsHovered(false);
          setPosition({ x: 0, y: 0 });
        }
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [proximityPadding, dampingFactor, isHovered]);

  return (
    <div
      ref={elementRef}
      className={`relative inline-block ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered
          ? 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
          : 'transform 0.6s ease-in-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
