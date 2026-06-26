"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import PartnerBadge from "./landing/partner-badge";
import { useProfile } from "@/lib/profile-store";
import { SEGMENT_LABELS } from "@/lib/types";
import type { ReactNode } from "react";

const NAV = [
  { href: "/onboard", label: "Find my cover" },
  { href: "/results", label: "Top matches" },
  { href: "/dashboard", label: "My policies" },
] as const;

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { profile } = useProfile();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-[oklch(0.145_0.025_255/0.85)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
          <Logo />
          <nav className="flex items-center gap-1" aria-label="Main">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ${
                    active
                      ? "bg-accent-soft text-ink"
                      : "text-ink-2 hover:bg-panel hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {profile ? (
            <div className="flex items-center gap-3">
              <PartnerBadge className="hidden lg:inline-flex" />
              <span className="chip hidden cursor-default md:inline-flex" data-on="true">
                {SEGMENT_LABELS[profile.segment]} · RM {profile.budget}/mo
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <PartnerBadge className="hidden lg:inline-flex" />
              <span className="hidden text-xs text-ink-3 md:block">Not onboarded yet</span>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-8">{children}</main>
    </div>
  );
}
