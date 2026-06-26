import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-baseline gap-1 font-kanit text-lg font-black uppercase tracking-tight text-ink transition-opacity duration-200 hover:opacity-80"
    >
      <span>
        Next<span className="text-accent">insurance</span>
      </span>
      <span className="ml-1 hidden text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink-3 sm:inline">
        by NEXTGEN
      </span>
    </Link>
  );
}
