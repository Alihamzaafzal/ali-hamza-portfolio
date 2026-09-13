import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  speed: number;
};

export default function HeroShineParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    const count = 180;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    const init = () => {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        size: Math.random() * 2.8 + 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
      }));
    };

    // Pre-render particle glow sprite once for zero GC and hardware-accelerated GPU drawImage
    const sprite = document.createElement('canvas');
    const spriteSize = 64;
    sprite.width = spriteSize;
    sprite.height = spriteSize;
    const sCtx = sprite.getContext('2d');
    if (sCtx) {
      const half = spriteSize / 2;
      const glow = sCtx.createRadialGradient(half, half, 0, half, half, half);
      glow.addColorStop(0, 'rgba(103, 232, 249, 1)');
      glow.addColorStop(0.35, 'rgba(50, 197, 255, 0.45)');
      glow.addColorStop(1, 'rgba(50, 197, 255, 0)');
      sCtx.fillStyle = glow;
      sCtx.beginPath();
      sCtx.arc(half, half, half, 0, Math.PI * 2);
      sCtx.fill();
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.001 * p.speed + p.phase));
        const glowRadius = p.size * 4;

        ctx.globalAlpha = twinkle * 0.85;
        ctx.drawImage(sprite, p.x - glowRadius, p.y - glowRadius, glowRadius * 2, glowRadius * 2);

        ctx.globalAlpha = twinkle;
        ctx.fillStyle = '#E0F2FE';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    resize();
    init();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      resize();
      init();
    });
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-shine-particles pointer-events-none absolute inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
