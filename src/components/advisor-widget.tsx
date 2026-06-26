"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ASK_EVENT, type AskDetail } from "@/lib/advisor-bus";
import { mdLite } from "@/lib/md-lite";
import { useProfile } from "@/lib/profile-store";
import type { ChatMessage } from "@/lib/types";
import { EASE_OUT } from "./motion-primitives";

const CHAT_KEY = "nxt.chat";
const HINT_KEY = "nxt.advisor.hint";

function suggestionsFor(pathname: string): string[] {
  if (pathname.startsWith("/results"))
    return [
      "Why is my top match ranked first?",
      "What does co-payment mean?",
      "How do match scores work?",
    ];
  if (pathname.startsWith("/plan"))
    return [
      "What is a waiting period?",
      "What's the catch in plans like this?",
      "Explain betterment in motor plans",
    ];
  if (pathname.startsWith("/dashboard"))
    return [
      "Which coverage gap should I close first?",
      "How can I lower my total premium?",
      "What is a grace period?",
    ];
  if (pathname.startsWith("/onboard"))
    return [
      "What budget is realistic for me?",
      "Health vs critical illness, what's the difference?",
      "What does B40 / M40 / T20 mean?",
    ];
  return [
    "What is a co-payment?",
    "Cheapest health plan?",
    "How do match scores work?",
    "Best cover for gig riders",
  ];
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.97, y: 6, transition: { duration: 0.15, ease: EASE_OUT } },
};

export default function AdvisorWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const { profile } = useProfile();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => suggestionsFor(pathname), [pathname]);

  // Restore conversation across navigations (session-scoped).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CHAT_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {
      sessionStorage.removeItem(CHAT_KEY);
    }
  }, []);

  useEffect(() => {
    if (messages.length) sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }, [messages]);

  // First-visit nudge so the bot from the slides is impossible to miss.
  useEffect(() => {
    if (localStorage.getItem(HINT_KEY)) return;
    const show = setTimeout(() => setHint(true), 1400);
    const hide = setTimeout(() => setHint(false), 9000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setHint(false);
      localStorage.setItem(HINT_KEY, "1");
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || busy) return;
      setInput("");
      const history: ChatMessage[] = [...messages, { role: "user", content }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setBusy(true);
      try {
        const res = await fetch("/api/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, profile, page: pathname }),
        });
        setMode(res.headers.get("X-Advisor-Mode"));
        if (!res.ok || !res.body) throw new Error("advisor unavailable");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const snapshot = acc;
          setMessages([...history, { role: "assistant", content: snapshot }]);
        }
      } catch {
        setMessages([
          ...history,
          {
            role: "assistant",
            content: "I couldn't reach the advisor service — give it another try in a moment.",
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, profile, pathname]
  );

  // Let any page open the bot, optionally pre-asking a question.
  const sendRef = useRef(send);
  sendRef.current = send;
  useEffect(() => {
    const onAsk = (e: Event) => {
      const detail = (e as CustomEvent<AskDetail>).detail;
      setOpen(true);
      if (detail?.question) {
        // Let the panel mount before streaming starts.
        setTimeout(() => sendRef.current(detail.question!), 220);
      }
    };
    window.addEventListener(ASK_EVENT, onAsk);
    return () => window.removeEventListener(ASK_EVENT, onAsk);
  }, []);

  return (
    <>
      {/* First-visit hint */}
      <AnimatePresence>
        {hint && !open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            className="fixed bottom-7 right-22 z-50 rounded-2xl rounded-br-md border border-line bg-elevated px-4 py-2.5 text-left text-sm shadow-[0_12px_36px_oklch(0_0_0/0.45)]"
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <span className="block font-bold text-ink">Meet NEXTAdvisor</span>
            <span className="text-ink-2">Your AI guide — ask it anything</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        type="button"
        aria-label={open ? "Close NEXTAdvisor chat" : "Open NEXTAdvisor chat"}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[oklch(0.13_0.03_255)] shadow-[0_8px_32px_oklch(0.72_0.17_252/0.45)]"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.06, transition: { duration: 0.15, ease: EASE_OUT } }}
      >
        {!open && hint && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-accent motion-reduce:hidden"
            animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
          />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="x"
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.14 }}
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </motion.svg>
          ) : (
            <motion.svg
              key="spark"
              width="22" height="22" viewBox="0 0 24 24" fill="currentColor"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.14 }}
            >
              <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="NEXTAdvisor chat"
            className="fixed bottom-22 right-5 z-50 flex max-h-[70dvh] w-[min(24rem,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line bg-elevated shadow-[0_24px_64px_oklch(0_0_0/0.5)]"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
                  </svg>
                </span>
                <div>
                  <p className="font-(family-name:--font-display-var) text-sm font-bold text-ink">
                    NEXTAdvisor
                  </p>
                  <p className="text-xs text-ink-3">
                    Your AI guide · commission-free
                    {mode && (
                      <span className="ml-1.5 rounded-full border border-line px-1.5 py-px text-[0.6rem] uppercase tracking-wide">
                        {mode === "claude" ? "Claude" : "offline"}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-ghost !px-2 !py-1 text-xs"
                    onClick={() => {
                      setMessages([]);
                      sessionStorage.removeItem(CHAT_KEY);
                    }}
                  >
                    Clear chat
                  </button>
                )}
                <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-ink-2">
                    I can decode any clause, compare the catalog, or sanity-check a decision. I
                    earn nothing from what you pick.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((s) => (
                      <button key={s} type="button" className="chip" onClick={() => send(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                    className="ml-8 rounded-2xl rounded-br-md bg-accent-soft px-3.5 py-2.5 text-sm text-ink"
                  >
                    {m.content}
                  </motion.div>
                ) : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                    className="mr-4 rounded-2xl rounded-bl-md bg-panel px-3.5 py-2.5 text-sm leading-relaxed text-ink-2"
                  >
                    {m.content ? (
                      <span dangerouslySetInnerHTML={{ __html: mdLite(m.content) }} />
                    ) : busy && i === messages.length - 1 ? (
                      <span className="inline-flex gap-1" aria-label="NEXTAdvisor is thinking">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            className="h-1.5 w-1.5 rounded-full bg-ink-3"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: d * 0.18 }}
                          />
                        ))}
                      </span>
                    ) : null}
                  </motion.div>
                )
              )}
            </div>

            <form
              className="flex items-center gap-2 border-t border-line p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                ref={inputRef}
                className="input"
                placeholder="Ask about any plan or term…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Message NEXTAdvisor"
              />
              <button type="submit" className="btn btn-primary !px-3.5" disabled={busy || !input.trim()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                <span className="sr-only">Send message</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
