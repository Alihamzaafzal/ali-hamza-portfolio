import { COLORS } from './constants';

export default function CssGlobeFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-[92%] w-[92%] animate-spin-slow">
        <div
          className="absolute inset-0 rounded-full opacity-70 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${COLORS.blue}66, ${COLORS.cyan}44, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-[4%] rounded-full border border-[#32C5FF]/55"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, rgba(50,197,255,0.4), rgba(37,99,235,0.18) 45%, rgba(9,11,18,0.95) 72%)',
            boxShadow:
              '0 0 60px rgba(50,197,255,0.45), 0 0 120px rgba(37,99,235,0.25), inset 0 0 40px rgba(103,232,249,0.15)',
          }}
        />
        <div className="absolute inset-[12%] rounded-full border border-[#38BDF8]/30 opacity-60" />
        <div
          className="absolute inset-[18%] rounded-full opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(50,197,255,0.1) 18px, rgba(50,197,255,0.1) 19px), repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(103,232,249,0.08) 18px, rgba(103,232,249,0.08) 19px)',
          }}
        />
      </div>
    </div>
  );
}
