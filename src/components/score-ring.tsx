"use client";

/**
 * Match-score donut. Renders its true value immediately (no rAF/Intersection
 * dependency) so it is reliable in headless / background tabs, with a CSS
 * transition adding a subtle draw for real visitors.
 */
export default function ScoreRing({
  score,
  size = 76,
  stroke = 6,
  label = "match",
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const mix = Math.max(0, Math.min(100, score));
  const ringColor = `color-mix(in oklch, var(--accent), var(--signal) ${Math.round((mix / 100) * 70)}%)`;

  return (
    <div
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score} out of 100 ${label} score`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - mix / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="tnum font-(family-name:--font-display-var) font-bold leading-none text-ink"
          style={{ fontSize: size * 0.3 }}
        >
          {score}
        </span>
        <span className="text-[0.55rem] font-semibold uppercase tracking-wider text-ink-3">
          {label}
        </span>
      </div>
    </div>
  );
}
