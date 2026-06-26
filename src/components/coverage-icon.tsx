import type { CoverageType } from "@/lib/types";

const PATHS: Record<CoverageType, string> = {
  // shield + cross
  health: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zm-1 6v2H9v2h2v2h2v-2h2v-2h-2V9h-2z",
  // heart in hands simplified -> heart
  life: "M12 21c-4.8-3.5-8-6.4-8-10a4.6 4.6 0 0 1 8-3.1A4.6 4.6 0 0 1 20 11c0 3.6-3.2 6.5-8 10z",
  // car
  motor: "M5 11l1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1zm2.2 0h9.6l-1-3H8.2l-1 3z",
  // pulse shield
  critical: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zm-4.5 8.5h2l1-2 2 4 1.5-2h2.5",
};

export default function CoverageIcon({
  type,
  size = 22,
  className = "",
}: {
  type: CoverageType;
  size?: number;
  className?: string;
}) {
  const stroked = type === "critical";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill={stroked ? "none" : "currentColor"}
      stroke={stroked ? "currentColor" : "none"}
      strokeWidth={stroked ? 1.8 : 0}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[type]} />
    </svg>
  );
}
