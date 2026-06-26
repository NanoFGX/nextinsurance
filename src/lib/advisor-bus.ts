"use client";

/**
 * Tiny event bus so any part of the app can open NEXTAdvisor,
 * optionally with a question that gets asked immediately.
 */
export const ASK_EVENT = "nxt:ask";

export interface AskDetail {
  question?: string;
}

export function askAdvisor(question?: string) {
  window.dispatchEvent(new CustomEvent<AskDetail>(ASK_EVENT, { detail: { question } }));
}
