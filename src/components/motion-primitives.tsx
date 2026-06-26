"use client";

import { Children, cloneElement, isValidElement } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/**
 * Entrance reveals driven by CSS (see .ni-fade-in in globals.css) rather than
 * framer-motion mount animations — reliable even when the tab's rAF loop is
 * throttled (background / headless), while honoring reduced-motion.
 */
export function FadeRise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const style = { animationDelay: `${delay}s`, "--ni-fy": "16px" } as CSSProperties;
  return (
    <div className={`ni-fade-in ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}

export function StaggerList({
  children,
  className,
  gap = 0.06,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<{ style?: CSSProperties }>, {
              style: {
                animationDelay: `${i * gap}s`,
                ...((child as ReactElement<{ style?: CSSProperties }>).props.style ?? {}),
              },
            })
          : child
      )}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const merged = { "--ni-fy": "12px", ...style } as CSSProperties;
  return (
    <div className={`ni-fade-in ${className ?? ""}`} style={merged}>
      {children}
    </div>
  );
}
