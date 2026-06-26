export type CoverageType = "health" | "life" | "motor" | "critical";
export type Segment = "novice" | "gig" | "family" | "expat";
export type IncomeBracket = "B40" | "M40" | "T20";
export type Priority = "price" | "coverage" | "flexibility" | "cashless" | "support";

export interface Provider {
  id: string;
  name: string;
  short: string;
  trustScore: number; // 0–100, regulator + claims-settlement composite
  tagline: string;
  hue: number; // brand hue used for the provider chip
  country: string; // home market, shown on provider chips
  takaful?: boolean; // Shariah-compliant operator
  featured?: boolean; // headline collaboration partner (Zurich)
}

export interface FinePrintClause {
  term: string;
  original: string;
  plain: string;
}

export interface Plan {
  id: string;
  providerId: string;
  name: string;
  type: CoverageType;
  monthlyPremium: number; // RM
  annualLimit: number | null; // RM (health / critical)
  coverAmount: number | null; // RM sum assured (life) or agreed value (motor)
  deductible: number; // RM
  rating: number; // 0–5 policyholder rating
  highlights: string[];
  segments: Segment[];
  flexible: boolean; // pause / adjust cover month-to-month
  multilingual: boolean; // EN / BM / 中文 support + expat onboarding
  familyBundle: boolean;
  beginnerFriendly: boolean;
  cashless: boolean; // cashless admission / panel workshops
  panelCount: number; // hospitals or workshops
  roomBoard: number | null; // RM/day (health only)
  features: Record<string, string | number | boolean>;
  fineprint: FinePrintClause[];
}

export interface Profile {
  uid: string;
  name?: string;
  age: number;
  segment: Segment;
  income: IncomeBracket;
  coverageTypes: CoverageType[];
  budget: number; // RM / month, total
  dependents: number;
  preexisting: boolean;
  priorities: Priority[];
}

export interface ScorePart {
  label: string;
  points: number;
  max: number;
  note: string;
}

export interface Match {
  plan: Plan;
  provider: Provider;
  score: number; // 0–100
  parts: ScorePart[];
  why: string; // one-sentence deterministic rationale
}

export interface Policy {
  id: string;
  uid: string;
  planId: string;
  planName: string;
  providerName: string;
  type: CoverageType;
  premium: number;
  startDate: string; // ISO
  renewalDate: string; // ISO
  status: "active" | "lapsed";
  paymentRef: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** Shape returned by POST /api/recommend (mirrors engine.Recommendation). */
export interface RecommendationDTO {
  byType: Partial<Record<CoverageType, Match[]>>;
  portfolio: Match[];
  totalPremium: number;
  budget: number;
  allocations: Partial<Record<CoverageType, number>>;
}

export const COVERAGE_LABELS: Record<CoverageType, string> = {
  health: "Health & medical",
  life: "Life",
  motor: "Motor",
  critical: "Critical illness",
};

export const SEGMENT_LABELS: Record<Segment, string> = {
  novice: "First-time buyer",
  gig: "Gig worker / freelancer",
  family: "Family & assets",
  expat: "Expat / nomad",
};
