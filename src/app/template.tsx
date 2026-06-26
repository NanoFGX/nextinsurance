import type { CSSProperties, ReactNode } from "react";

/**
 * Soft page transition on every route change — driven by CSS (see .ni-fade-in
 * in globals.css) rather than a framer-motion mount animation, so the whole
 * page reliably ends visible even when the tab's requestAnimationFrame loop is
 * throttled (background / headless rendering).
 */
export default function Template({ children }: { children: ReactNode }) {
  const style = { animationDuration: "0.3s", "--ni-fy": "8px" } as CSSProperties;
  return (
    <div className="ni-fade-in flex min-h-0 flex-1 flex-col" style={style}>
      {children}
    </div>
  );
}
