"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

function Char({
  progress,
  range,
  char,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  char: string;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

/** Character-by-character scroll-driven reveal. */
export default function AnimatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const chars = text.split("");
  return (
    <p ref={ref} className={className} aria-label={text}>
      {chars.map((char, i) => (
        <Char
          key={i}
          progress={scrollYProgress}
          range={[i / chars.length, Math.min(1, (i + 1.5) / chars.length)]}
          char={char}
        />
      ))}
    </p>
  );
}
