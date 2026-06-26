import type { CSSProperties, ReactNode } from "react";

/**
 * Entrance reveal driven by a pure CSS animation (not framer-motion). CSS
 * animations are immune to requestAnimationFrame throttling in background /
 * headless tabs, so content reliably ends visible everywhere — while still
 * giving a staggered fade-and-rise for real visitors. Honors reduced-motion.
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  const style = {
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    "--ni-fx": `${x}px`,
    "--ni-fy": `${y}px`,
  } as CSSProperties;
  return (
    <div className={`ni-fade-in ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}
