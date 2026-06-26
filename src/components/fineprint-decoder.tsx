"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { FinePrintClause } from "@/lib/types";
import { EASE_OUT } from "./motion-primitives";

interface Decoded {
  plain: string;
  mode: string;
}

export default function FinePrintDecoder({
  planId,
  clauses,
}: {
  planId: string;
  clauses: FinePrintClause[];
}) {
  const [decoded, setDecoded] = useState<Record<string, Decoded>>({});
  const [loading, setLoading] = useState<string | null>(null);

  async function decode(term: string) {
    if (decoded[term] || loading) return;
    setLoading(term);
    try {
      const res = await fetch("/api/simplify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, term }),
      });
      const data = await res.json();
      if (res.ok) {
        setDecoded((d) => ({ ...d, [term]: { plain: data.plain, mode: data.mode } }));
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      {clauses.map((clause) => {
        const d = decoded[clause.term];
        const isLoading = loading === clause.term;
        return (
          <div key={clause.term} className="card overflow-hidden">
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-(family-name:--font-display-var) text-base font-bold text-ink">
                  {clause.term}
                </h3>
                {!d && (
                  <button
                    type="button"
                    className="btn btn-secondary !py-1.5 text-sm"
                    onClick={() => decode(clause.term)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.span
                        className="inline-block h-3.5 w-3.5 rounded-full border-2 border-accent border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                        aria-label="Decoding"
                      />
                    ) : (
                      <>Decode this clause</>
                    )}
                  </button>
                )}
              </div>
              <p className="mt-3 border-l-0 text-[0.85rem] italic leading-relaxed text-ink-3">
                "{clause.original}"
              </p>
            </div>
            <AnimatePresence initial={false}>
              {d && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-line bg-signal-soft/60 px-5 py-4 sm:px-6">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-signal">
                      In plain words
                      <span className="rounded-full border border-line bg-bg px-1.5 py-px text-[0.6rem] normal-case tracking-normal text-ink-3">
                        {d.mode === "claude" ? "Claude AI" : "curated decode"}
                      </span>
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                      {d.plain}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
