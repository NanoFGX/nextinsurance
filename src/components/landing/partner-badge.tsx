"use client";

/**
 * "In collaboration with Zurich" badge — used in the hero, nav, onboarding
 * and app shell to make the NEXTGEN × Zurich partnership unmissable.
 */
export default function PartnerBadge({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";
  return (
    <span
      data-testid="zurich-partner-badge"
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
        isLight
          ? "border-[#0050d4]/25 bg-[#0050d4]/8"
          : "border-[#2e7cf6]/30 bg-[#2e7cf6]/12 backdrop-blur-sm"
      } ${className}`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[#0a2a6b] text-[0.72rem] font-black leading-none text-white shadow-[0_0_12px_rgba(46,124,246,0.5)]">
        Z
      </span>
      <span
        className={`font-kanit text-[0.6rem] font-semibold uppercase tracking-[0.2em] ${
          isLight ? "text-[#0c4cc0]" : "text-[#bcd4f5]"
        }`}
      >
        In collaboration with <span className="font-bold">Zurich</span>
      </span>
    </span>
  );
}
