"use client";

import { askAdvisor } from "@/lib/advisor-bus";

export default function AskAdvisorButton({
  question,
  label = "Ask NEXTAdvisor",
  className = "btn btn-ghost text-sm",
}: {
  question?: string;
  label?: string;
  className?: string;
}) {
  return (
    <button type="button" className={className} onClick={() => askAdvisor(question)}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z" />
      </svg>
      {label}
    </button>
  );
}
