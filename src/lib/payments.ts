export const FPX_BANKS = [
  "Maybank2u",
  "CIMB Clicks",
  "Public Bank",
  "RHB Now",
  "Bank Islam",
  "Hong Leong Connect",
] as const;

export const EWALLETS = ["Touch 'n Go eWallet", "GrabPay", "Boost"] as const;

export type PaymentMethod = "card" | "fpx" | "ewallet";
