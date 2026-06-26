"use client";

import Link from "next/link";

/**
 * The concept's gradient pill CTA, recolored to the NEXTGEN blue/mint
 * identity. White offset outline + inner glow per spec.
 */
export default function CtaButton({
  label = "Find my cover",
  href = "/onboard",
  onClick,
}: {
  label?: string;
  href?: string;
  onClick?: () => void;
}) {
  const style: React.CSSProperties = {
    background:
      "linear-gradient(123deg, #001233 7%, #0050d4 37%, #2e7cf6 72%, #00c28e 100%)",
    boxShadow:
      "0px 4px 4px rgba(46, 124, 246, 0.25), 4px 4px 12px #0050d4 inset",
    outline: "2px solid #ffffff",
    outlineOffset: "-3px",
  };
  const cls =
    "inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white transition-transform duration-150 hover:scale-[1.04] active:scale-[0.97] sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base font-kanit";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls} style={style}>
        {label}
      </button>
    );
  }
  return (
    <Link href={href} className={cls} style={style}>
      {label}
    </Link>
  );
}
