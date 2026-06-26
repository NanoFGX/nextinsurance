import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-baseline gap-0.5 font-(family-name:--font-display-var) text-[1.05rem] font-bold tracking-tight text-ink"
    >
      <span>NEXT</span>
      <span className="text-accent">INSURANCE</span>
      <span className="ml-2 hidden text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-3 sm:inline">
        by NEXTGEN Co.
      </span>
    </Link>
  );
}
