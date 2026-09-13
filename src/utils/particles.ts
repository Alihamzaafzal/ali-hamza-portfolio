// Lightweight particle shimmer burst generator

interface BurstOptions {
  count?: number;
  colors?: string[];
  spread?: number;
}

export function triggerParticleBurst(
  x: number,
  y: number,
  options: BurstOptions | number = {}
): void {
  if (typeof document === 'undefined') return;

  const opts: BurstOptions = typeof options === 'number' ? { count: options } : options;
  const count = opts.count ?? 18;
  const colors = opts.colors ?? ['#00F0FF', '#D946EF', '#38BDF8', '#10B981', '#FFFFFF'];
  const spread = opts.spread ?? 60;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const distance = spread * (0.5 + Math.random() * 0.8);
    const destX = x + Math.cos(angle) * distance;
    const destY = y + Math.sin(angle) * distance;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 3 + Math.random() * 4;

    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 8px ${color}`;
    particle.style.transition = 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
    particle.style.transform = 'translate(-50%, -50%) scale(1)';
    particle.style.opacity = '1';

    container.appendChild(particle);

    requestAnimationFrame(() => {
      particle.style.left = `${destX}px`;
      particle.style.top = `${destY}px`;
      particle.style.transform = 'translate(-50%, -50%) scale(0)';
      particle.style.opacity = '0';
    });
  }

  setTimeout(() => {
    container.remove();
  }, 700);
}
