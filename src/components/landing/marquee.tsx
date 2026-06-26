"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* ---------- tile content variants (all real product content) ---------- */

function Tile({ children, glow = false }: { children: ReactNode; glow?: boolean }) {
  return (
    <div
      className="relative flex h-[214px] w-[340px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-[#D7E2EA]/10 p-6 md:h-[270px] md:w-[420px]"
      style={{
        background: glow
          ? "radial-gradient(120% 140% at 20% 0%, #10203f 0%, #0e1118 55%, #0c0c0c 100%)"
          : "linear-gradient(135deg, #12151d 0%, #0c0c0c 100%)",
      }}
    >
      {children}
    </div>
  );
}

function ScoreTile({ name, provider, rm, score }: { name: string; provider: string; rm: number; score: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <Tile glow>
      <div className="flex items-center justify-between">
        <span className="font-kanit text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/50">
          Top match
        </span>
        <span className="rounded-full border border-[#00c28e]/40 px-2.5 py-0.5 font-kanit text-[0.6rem] uppercase tracking-widest text-[#00c28e]">
          ranked by score
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-kanit text-2xl font-semibold uppercase leading-none text-[#D7E2EA] md:text-3xl">
            {name}
          </p>
          <p className="mt-1.5 text-sm text-[#D7E2EA]/55">
            {provider} · RM {rm}/mo
          </p>
        </div>
        <div className="relative h-[68px] w-[68px] shrink-0">
          <svg width="68" height="68" className="-rotate-90">
            <circle cx="34" cy="34" r={r} fill="none" stroke="#D7E2EA" strokeOpacity="0.12" strokeWidth="5" />
            <circle
              cx="34" cy="34" r={r} fill="none" stroke="#2e7cf6" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-kanit text-xl font-bold text-[#D7E2EA]">
            {score}
          </span>
        </div>
      </div>
    </Tile>
  );
}

function ChatTile({ q, a }: { q: string; a: string }) {
  return (
    <Tile>
      <p className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-[#2e7cf6]/15 px-3.5 py-2 text-sm text-[#D7E2EA]">
        {q}
      </p>
      <div>
        <p className="w-fit max-w-[92%] rounded-2xl rounded-bl-md bg-[#D7E2EA]/8 px-3.5 py-2 text-sm leading-snug text-[#D7E2EA]/75">
          {a}
        </p>
        <p className="mt-2.5 font-kanit text-[0.6rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/40">
          NEXTAdvisor · commission-free
        </p>
      </div>
    </Tile>
  );
}

function ClauseTile({ term, plain }: { term: string; plain: string }) {
  return (
    <Tile>
      <div>
        <span className="font-kanit text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#00c28e]">
          Fine print, decoded
        </span>
        <p className="mt-2 font-kanit text-xl font-semibold uppercase text-[#D7E2EA] md:text-2xl">{term}</p>
      </div>
      <p className="text-sm leading-snug text-[#D7E2EA]/60">{plain}</p>
    </Tile>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <Tile glow>
      <span className="font-kanit text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/45">
        {label}
      </span>
      <p className="hero-heading font-kanit text-6xl font-black uppercase leading-none md:text-7xl">{value}</p>
    </Tile>
  );
}

function ProviderTile({ name, trust, tagline }: { name: string; trust: number; tagline: string }) {
  return (
    <Tile>
      <div className="flex items-center justify-between">
        <p className="font-kanit text-2xl font-semibold uppercase text-[#D7E2EA]">{name}</p>
        <span className="font-kanit text-lg font-bold text-[#2e7cf6]">{trust}<span className="text-xs text-[#D7E2EA]/40">/100</span></span>
      </div>
      <div>
        <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-[#D7E2EA]/10">
          <div className="h-full rounded-full bg-[#2e7cf6]" style={{ width: `${trust}%` }} />
        </div>
        <p className="text-sm text-[#D7E2EA]/55">{tagline}</p>
      </div>
    </Tile>
  );
}

function PayTile() {
  return (
    <Tile>
      <span className="font-kanit text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#D7E2EA]/45">
        Pay your way
      </span>
      <div className="flex flex-wrap gap-2">
        {["FPX", "Maybank2u", "CIMB", "TnG eWallet", "GrabPay", "Card"].map((p) => (
          <span key={p} className="rounded-full border border-[#D7E2EA]/20 px-3.5 py-1.5 font-kanit text-xs uppercase tracking-wider text-[#D7E2EA]/80">
            {p}
          </span>
        ))}
      </div>
      <p className="text-sm text-[#D7E2EA]/55">Covered in minutes, straight from the app.</p>
    </Tile>
  );
}

/* ---------- rows ---------- */

const ROW_1 = [
  <ScoreTile key="s1" name="Zurich MedicalCare" provider="Zurich" rm={312} score={94} />,
  <StatTile key="t1" value="RM 0" label="paid in commissions, ever" />,
  <ChatTile key="c1" q="What's a co-payment?" a="You pay a small share of each hospital bill, capped per stay. The insurer covers the rest." />,
  <ProviderTile key="p1" name="Zurich" trust={94} tagline="Global protection, local expertise — our partner" />,
  <ClauseTile key="f1" term="Waiting period" plain="For the first 30 days only accidents are covered, not illness. Then everything applies." />,
  <ScoreTile key="s2" name="A-Life Med Regular" provider="AIA" rm={95} score={90} />,
  <StatTile key="t2" value="27" label="plans scored per scan" />,
  <ChatTile key="c2" q="Best cover for gig riders?" a="Takaful myMotor covers e-hailing by default — standard policies void claims on the job." />,
  <ProviderTile key="p2" name="AIA" trust={93} tagline="Healthier, longer, better lives" />,
  <ClauseTile key="f2" term="Betterment" plain="Old car, new parts: you pay a share of repairs. The older the car, the bigger the share." />,
  <ScoreTile key="s3" name="PRUMillion Med" provider="Prudential" rm={268} score={88} />,
];

const ROW_2 = [
  <ChatTile key="c3" q="Is takaful halal?" a="Yes — contributors pool funds, surpluses are shared back, payouts skip probate via hibah." />,
  <StatTile key="t3" value="3 min" label="from clueless to covered" />,
  <ScoreTile key="s4" name="Takaful myMotor" provider="Takaful Malaysia" rm={64} score={92} />,
  <ProviderTile key="p3" name="Prudential" trust={92} tagline="Always listening, always understanding" />,
  <ClauseTile key="f3" term="Room & board cap" plain="Pick a pricier room and EVERY part of your claim gets cut proportionally. Stay in limit." />,
  <PayTile key="pay" />,
  <ScoreTile key="s5" name="CI Income Guard" provider="Etiqa" rm={34} score={87} />,
  <StatTile key="t4" value="10" label="insurers, one ranking" />,
  <ProviderTile key="p4" name="Allianz" trust={91} tagline="We secure your future" />,
  <ChatTile key="c4" q="What's the catch?" a="Three clauses bite most: waiting periods, room caps, betterment. We decode all of them." />,
];

/**
 * Two rows of product tiles that translate horizontally with page scroll —
 * row 1 drifts right, row 2 drifts left.
 */
export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const offset = (window.scrollY - section.offsetTop + window.innerHeight) * 0.3;
      if (row1Ref.current) row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
      if (row2Ref.current) row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40" aria-label="Product highlights">
      <div className="flex flex-col gap-3">
        <div ref={row1Ref} className="flex w-max gap-3" style={{ willChange: "transform", marginLeft: "-1400px" }}>
          {[0, 1, 2].map((copy) => (
            <div key={copy} className="flex gap-3">
              {ROW_1}
            </div>
          ))}
        </div>
        <div ref={row2Ref} className="flex w-max gap-3" style={{ willChange: "transform", marginLeft: "-2200px" }}>
          {[0, 1, 2].map((copy) => (
            <div key={copy} className="flex gap-3">
              {ROW_2}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
