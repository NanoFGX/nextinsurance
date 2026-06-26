"use client";

import { useEffect, useRef, useState } from "react";

interface Blob {
  hue: number;
  chroma: number;
  light: number;
  radius: number;
  speed: number;
  phase: number;
  cx: number;
  cy: number;
  ampX: number;
  ampY: number;
}

const BLOBS: Blob[] = [
  { hue: 252, chroma: 0.16, light: 0.45, radius: 0.55, speed: 0.10, phase: 0.0, cx: 0.22, cy: 0.30, ampX: 0.10, ampY: 0.08 },
  { hue: 258, chroma: 0.18, light: 0.35, radius: 0.62, speed: 0.07, phase: 2.1, cx: 0.78, cy: 0.25, ampX: 0.08, ampY: 0.10 },
  { hue: 230, chroma: 0.14, light: 0.40, radius: 0.48, speed: 0.13, phase: 4.0, cx: 0.55, cy: 0.72, ampX: 0.12, ampY: 0.06 },
  { hue: 165, chroma: 0.10, light: 0.45, radius: 0.34, speed: 0.09, phase: 1.2, cx: 0.85, cy: 0.78, ampX: 0.06, ampY: 0.09 },
  { hue: 285, chroma: 0.12, light: 0.32, radius: 0.40, speed: 0.06, phase: 5.3, cx: 0.10, cy: 0.85, ampX: 0.07, ampY: 0.07 },
];

// Probed once per session so a missing file doesn't 404 on every visit.
let heroVideoAvailable: boolean | null = null;

/**
 * Cinematic animated background: aurora blobs rendered to a low-res canvas
 * scaled up by the browser (cheap softness, no blur filter). If a video file
 * exists at /hero.mp4 (e.g. a Higgsfield render dropped into /public), it
 * automatically fades in over the canvas.
 */
export default function Aurora({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoOk, setVideoOk] = useState(false);
  const [videoExists, setVideoExists] = useState(heroVideoAvailable === true);

  useEffect(() => {
    if (heroVideoAvailable !== null) {
      setVideoExists(heroVideoAvailable);
      return;
    }
    fetch("/hero.mp4", { method: "HEAD" })
      .then((res) => {
        heroVideoAvailable = res.ok;
        setVideoExists(res.ok);
      })
      .catch(() => {
        heroVideoAvailable = false;
      });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 260;
    const H = 150;
    canvas.width = W;
    canvas.height = H;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      // deep base
      const base = ctx.createLinearGradient(0, 0, 0, H);
      base.addColorStop(0, "oklch(0.16 0.03 256)");
      base.addColorStop(1, "oklch(0.12 0.025 252)");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "lighter";
      for (const b of BLOBS) {
        const x = (b.cx + Math.sin(t * b.speed + b.phase) * b.ampX) * W;
        const y = (b.cy + Math.cos(t * b.speed * 0.9 + b.phase) * b.ampY) * H;
        const r = b.radius * W * (1 + Math.sin(t * b.speed * 0.6 + b.phase) * 0.08);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `oklch(${b.light} ${b.chroma} ${b.hue} / 0.32)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    if (reduced) {
      draw(8); // single static frame
      return;
    }

    const start = performance.now();
    const loop = () => {
      if (!running) return;
      draw((performance.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) loop();
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ imageRendering: "auto" }}
      />
      {/* Drop a Higgsfield-generated /public/hero.mp4 and it takes over. */}
      {videoExists && (
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoOk ? "opacity-60" : "opacity-0"}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setVideoOk(true)}
          onError={(e) => {
            setVideoOk(false);
            e.currentTarget.style.display = "none";
          }}
          src="/hero.mp4"
        />
      )}
      {/* readability scrim */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.145_0.025_255/0.25),oklch(0.145_0.025_255/0.55)_60%,var(--bg))]" />
    </div>
  );
}
