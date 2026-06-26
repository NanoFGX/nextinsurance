import type { FinePrintClause, Plan, Provider } from "./types";

export const PROVIDERS: Provider[] = [
  { id: "amanah", name: "AmanahShield Takaful", short: "AmanahShield", trustScore: 92, tagline: "Shariah-compliant protection since 1994", hue: 165 },
  { id: "merdeka", name: "MerdekaCare Insurance", short: "MerdekaCare", trustScore: 88, tagline: "Malaysia's everyday insurer", hue: 252 },
  { id: "tigersure", name: "TigerSure", short: "TigerSure", trustScore: 83, tagline: "Built for the gig economy", hue: 35 },
  { id: "hornbill", name: "HornbillLife", short: "HornbillLife", trustScore: 90, tagline: "Protecting Malaysian families for 60 years", hue: 305 },
  { id: "nusa", name: "NusaProtect", short: "NusaProtect", trustScore: 80, tagline: "Honest cover at honest prices", hue: 205 },
  { id: "zenith", name: "ZenithGuard International", short: "ZenithGuard", trustScore: 86, tagline: "Coverage that travels with you", hue: 85 },
];

function waitingPeriod(days: number, specified: number): FinePrintClause {
  return {
    term: "Waiting period",
    original: `No benefit shall be payable in respect of any disability which manifests itself within the first ${days} days from the policy effective date, save and except for injuries arising from accidental causes, and within the first ${specified} days in respect of specified illnesses as enumerated in Schedule II hereof.`,
    plain: `For the first ${days} days after you sign up, the plan only covers accidents, not illness. A short list of "specified illnesses" (like cataracts or hernia) is only covered after ${specified} days. After that, everything in the plan applies normally.`,
  };
}

function coPay(percent: number, cap: number | null): FinePrintClause {
  return {
    term: "Co-payment",
    original: `The Policyholder shall bear ${percent}% of all eligible hospitalisation and surgical expenses incurred${cap ? `, subject to a maximum co-payment of RM${cap.toLocaleString()} per admission` : ""}, with the balance payable by the Company subject always to the limits specified in the Benefit Schedule.`,
    plain: `You pay ${percent}% of each hospital bill yourself${cap ? `, but never more than RM${cap.toLocaleString()} per hospital stay` : ""}. The insurer pays the rest, up to your plan's limits. Example: on a RM10,000 bill you'd pay RM${((percent / 100) * 10000).toLocaleString()}${cap && (percent / 100) * 10000 > cap ? ` — capped to RM${cap.toLocaleString()}` : ""}.`,
  };
}

function preExisting(months: number): FinePrintClause {
  return {
    term: "Pre-existing conditions",
    original: `Pre-existing conditions, whether known or unknown to the Life Assured, for which the Life Assured received or was recommended medical treatment, diagnosis, consultation or prescribed drugs preceding the effective date, shall be excluded from coverage for a period of ${months} consecutive months.`,
    plain: `Any health problem you already had before buying this plan isn't covered for the first ${months / 12 >= 1 ? `${months / 12} year${months > 12 ? "s" : ""}` : `${months} months`}. After that, it becomes covered as long as you declared it honestly when applying.`,
  };
}

function suicideClause(months: number): FinePrintClause {
  return {
    term: "Suicide exclusion",
    original: `In the event the Life Assured, whether sane or insane, dies by their own hand within ${months} months from the Issue Date or date of any reinstatement, the liability of the Company shall be limited to a refund of premiums paid without interest, less any indebtedness.`,
    plain: `If death is by suicide within the first ${months} months, the plan doesn't pay the full amount — only the premiums paid so far are returned. After ${months} months, the full sum is paid like any other death.`,
  };
}

function betterment(years: number): FinePrintClause {
  return {
    term: "Betterment",
    original: `Where the Vehicle exceeds ${years} years of age, the Company shall apply a scale of betterment to the cost of replacement of new franchise parts, such contribution to be borne by the Insured in accordance with the Schedule of Betterment rates gazetted by PIAM.`,
    plain: `If your car is older than ${years} years and a repair uses brand-new original parts, you pay a share of the parts cost (because new parts make your old car "better"). The older the car, the bigger your share — typically 15% to 40%.`,
  };
}

function namedDriver(amount: number): FinePrintClause {
  return {
    term: "Compulsory excess",
    original: `An excess of RM${amount} shall apply to each and every claim where the Vehicle is being driven by a driver not named in the Schedule, or a driver under the age of 21 years, or the holder of a provisional driving licence.`,
    plain: `If someone not listed on your policy (or under 21, or on a P licence) drives your car and crashes, you pay the first RM${amount} of the claim yourself. Add regular drivers to your policy to avoid this.`,
  };
}

function survivalPeriod(days: number): FinePrintClause {
  return {
    term: "Survival period",
    original: `The benefit shall be payable only if the Life Assured survives for a period of not less than ${days} days following the date of diagnosis of the Covered Critical Illness, as certified by a Registered Medical Practitioner.`,
    plain: `You must survive at least ${days} days after the diagnosis for the payout to be made. This is standard across critical illness plans — compare this number; shorter is better for your family.`,
  };
}

function earlyStage(percent: number): FinePrintClause {
  return {
    term: "Early-stage payout",
    original: `Upon diagnosis of a Covered Illness at early or intermediate stage as defined in the Severity Classification Table, the Company shall advance ${percent}% of the Sum Assured, and the policy shall continue in force with the Sum Assured reduced accordingly.`,
    plain: `If your illness is caught early, the plan pays out ${percent}% of your cover amount immediately, and the rest stays available for later stages. Plans without this clause pay nothing until late-stage diagnosis.`,
  };
}

function roomBoardCap(): FinePrintClause {
  return {
    term: "Room & board cap",
    original: `Where the Life Assured is admitted to a room with a published rate exceeding the Room & Board benefit specified in the Schedule, all other eligible benefits shall be subject to a proportionate adjustment factor equal to the ratio of the eligible Room & Board benefit to the actual room rate charged.`,
    plain: `If you choose a hospital room that costs more per night than your plan's room allowance, the insurer doesn't just bill you the room difference — it cuts EVERY part of your claim by the same ratio. Staying within your room limit protects your whole claim.`,
  };
}

function gigPause(): FinePrintClause {
  return {
    term: "Cover pause",
    original: `The Policyholder may elect to suspend coverage for complete calendar months by written notice no later than 7 days prior to the next premium due date, provided that no more than 3 such suspensions are exercised within any 12-month period, during which no benefits shall accrue or be payable.`,
    plain: `You can pause your plan (and stop paying) for full months when work is slow — up to 3 months per year. Just tell them 7 days before your next payment. While paused, you're not covered, so time it carefully.`,
  };
}

const p = (
  id: string,
  providerId: string,
  name: string,
  type: Plan["type"],
  monthlyPremium: number,
  opts: Partial<Plan>
): Plan => ({
  id,
  providerId,
  name,
  type,
  monthlyPremium,
  annualLimit: null,
  coverAmount: null,
  deductible: 0,
  rating: 4.0,
  highlights: [],
  segments: [],
  flexible: false,
  multilingual: false,
  familyBundle: false,
  beginnerFriendly: false,
  cashless: false,
  panelCount: 0,
  roomBoard: null,
  features: {},
  fineprint: [],
  ...opts,
});

export const PLANS: Plan[] = [
  // ---------- HEALTH ----------
  p("h-medicore-starter", "merdeka", "MediCore Starter", "health", 89, {
    annualLimit: 600_000, roomBoard: 150, deductible: 0, rating: 4.4,
    beginnerFriendly: true, cashless: true, panelCount: 142,
    segments: ["novice", "gig"],
    highlights: ["No medical check-up below age 35", "Cashless admission at 142 panel hospitals", "Guided claims via app in under 10 minutes"],
    features: { "Annual limit": "RM 600k", "Room & board": "RM 150/day", "Cashless admission": true, "Panel hospitals": 142, "Co-payment": "5%, cap RM 800", "Outpatient cover": false, "Worldwide cover": false },
    fineprint: [waitingPeriod(30, 120), coPay(5, 800), preExisting(24)],
  }),
  p("h-amanah-essential", "amanah", "Amanah Medic Essential", "health", 119, {
    annualLimit: 800_000, roomBoard: 200, rating: 4.6,
    beginnerFriendly: true, cashless: true, multilingual: true, panelCount: 168,
    segments: ["novice", "family"],
    highlights: ["Shariah-compliant with annual surplus sharing", "BM, English & Mandarin support line", "No co-payment on follow-up visits"],
    features: { "Annual limit": "RM 800k", "Room & board": "RM 200/day", "Cashless admission": true, "Panel hospitals": 168, "Co-payment": "10%, cap RM 1,000", "Outpatient cover": false, "Worldwide cover": false },
    fineprint: [waitingPeriod(30, 120), coPay(10, 1000), roomBoardCap()],
  }),
  p("h-fleximed-gig", "tigersure", "FlexiMed Gig", "health", 76, {
    annualLimit: 500_000, roomBoard: 150, deductible: 500, rating: 4.2,
    flexible: true, cashless: true, panelCount: 96,
    segments: ["gig"],
    highlights: ["Pause cover up to 3 months a year", "Daily hospital income RM 80 while you can't work", "Covers e-hailing & delivery riding accidents"],
    features: { "Annual limit": "RM 500k", "Room & board": "RM 150/day", "Cashless admission": true, "Panel hospitals": 96, "Co-payment": "RM 500 deductible", "Outpatient cover": false, "Hospital income": "RM 80/day" },
    fineprint: [gigPause(), waitingPeriod(30, 120), preExisting(24)],
  }),
  p("h-hornbill-prime", "hornbill", "Hornbill Health Prime", "health", 248, {
    annualLimit: 1_500_000, roomBoard: 300, rating: 4.7,
    familyBundle: true, cashless: true, panelCount: 203,
    segments: ["family"],
    highlights: ["Add spouse & kids at 40% discount", "Full annual health screening included", "Covers outpatient cancer & kidney dialysis"],
    features: { "Annual limit": "RM 1.5M", "Room & board": "RM 300/day", "Cashless admission": true, "Panel hospitals": 203, "Co-payment": "None", "Outpatient cover": true, "Family discount": "40%" },
    fineprint: [waitingPeriod(30, 120), roomBoardCap(), preExisting(12)],
  }),
  p("h-nusacare-value", "nusa", "NusaCare Value", "health", 64, {
    annualLimit: 400_000, roomBoard: 120, rating: 4.0,
    beginnerFriendly: true, cashless: false, panelCount: 0,
    segments: ["novice", "gig"],
    highlights: ["Lowest entry price for a medical card", "Premiums locked for 3 years", "Simple one-page policy wording"],
    features: { "Annual limit": "RM 400k", "Room & board": "RM 120/day", "Cashless admission": false, "Panel hospitals": "Pay & claim", "Co-payment": "10%, cap RM 600", "Outpatient cover": false, "Worldwide cover": false },
    fineprint: [coPay(10, 600), waitingPeriod(30, 120), preExisting(24)],
  }),
  p("h-zenith-global", "zenith", "Zenith Global Health", "health", 392, {
    annualLimit: 2_500_000, roomBoard: 450, rating: 4.5,
    multilingual: true, cashless: true, panelCount: 310,
    segments: ["expat", "family"],
    highlights: ["Worldwide cover incl. Singapore & Thailand", "Direct billing at 310 hospitals in 14 countries", "English, BM, Mandarin & Japanese helplines"],
    features: { "Annual limit": "RM 2.5M", "Room & board": "RM 450/day", "Cashless admission": true, "Panel hospitals": 310, "Co-payment": "None", "Outpatient cover": true, "Worldwide cover": true },
    fineprint: [preExisting(12), roomBoardCap(), waitingPeriod(30, 90)],
  }),
  p("h-medicore-family", "merdeka", "MediCore Family 360", "health", 310, {
    annualLimit: 2_000_000, roomBoard: 250, rating: 4.5,
    familyBundle: true, cashless: true, panelCount: 142,
    segments: ["family"],
    highlights: ["One shared RM 2M limit for the whole household", "Kids covered free after the second child", "Includes dental & optical allowance"],
    features: { "Annual limit": "RM 2M shared", "Room & board": "RM 250/day", "Cashless admission": true, "Panel hospitals": 142, "Co-payment": "5%, cap RM 1,200", "Outpatient cover": true, "Family discount": "Kids 3+ free" },
    fineprint: [coPay(5, 1200), waitingPeriod(30, 120), roomBoardCap()],
  }),

  // ---------- LIFE ----------
  p("l-hornbill-term500", "hornbill", "Hornbill Term 500", "life", 58, {
    coverAmount: 500_000, rating: 4.6,
    segments: ["family", "novice"],
    highlights: ["RM 500k payout for under RM 2/day", "Premiums never rise for 20 years", "Double payout for accidental death"],
    features: { "Sum assured": "RM 500k", "Term": "20 years, level premium", "Accidental death": "2× payout", "Critical illness rider": "Optional +RM 28/mo", "Cash value": false },
    fineprint: [suicideClause(12), {
      term: "Contestability",
      original: "The Company reserves the right to contest the validity of this Policy within 2 years from the Issue Date on grounds of material misrepresentation or non-disclosure in the proposal form.",
      plain: "For the first 2 years, the insurer can cancel the policy if you hid important facts when applying (like a smoking habit or an illness). Answer the application honestly and this clause can't touch you.",
    }, {
      term: "Grace period",
      original: "A grace period of 31 days from each premium due date shall be allowed, during which the Policy shall remain in force. If the premium remains unpaid upon expiry of the grace period, the Policy shall lapse without value.",
      plain: "If you miss a payment, you have 31 days to catch up while staying fully covered. Miss that too and the policy ends with no refund — set up auto-debit to be safe.",
    }],
  }),
  p("l-amanah-legacy", "amanah", "Amanah Legacy Takaful", "life", 88, {
    coverAmount: 600_000, rating: 4.5,
    multilingual: true, familyBundle: true,
    segments: ["family"],
    highlights: ["Hibah structure pays family directly, bypassing probate", "Annual surplus returned to contributors", "Badal Hajj benefit included"],
    features: { "Sum assured": "RM 600k", "Term": "To age 70", "Accidental death": "2× payout", "Structure": "Takaful (hibah)", "Cash value": "Surplus sharing" },
    fineprint: [suicideClause(12), preExisting(24), {
      term: "Nomination (hibah)",
      original: "Benefits payable hereunder shall be distributed to the nominee(s) absolutely as beneficiaries under a conditional hibah, and shall not form part of the estate of the deceased Person Covered nor be subject to the debts thereof.",
      plain: "Your payout goes straight to the people you name — it skips the slow inheritance court process and can't be claimed by people you owe money to. Name your nominees when you sign up.",
    }],
  }),
  p("l-merdeka-lifestart", "merdeka", "Merdeka LifeStart", "life", 35, {
    coverAmount: 250_000, rating: 4.3,
    beginnerFriendly: true,
    segments: ["novice"],
    highlights: ["First life plan designed for under-30s", "Sign up fully online in 7 minutes", "Upgrade cover later without new medical exams"],
    features: { "Sum assured": "RM 250k", "Term": "Renewable yearly", "Accidental death": "2× payout", "Guaranteed upgrade": "To RM 500k by 35", "Cash value": false },
    fineprint: [suicideClause(12), {
      term: "Guaranteed insurability",
      original: "The Life Assured may, on each policy anniversary prior to attaining age 35, increase the Sum Assured by increments not exceeding RM50,000 without further evidence of insurability, subject to a cumulative maximum of RM250,000 in such increases.",
      plain: "You can raise your cover by up to RM 50k each year before you turn 35 — no new medical questions asked — until you've doubled it. Lock in cheap cover young, grow it as your salary grows.",
    }, {
      term: "Renewal premium",
      original: "Premium rates are not guaranteed and shall be determined at each renewal based on attained age and the prevailing rate table, subject to 30 days' prior written notice.",
      plain: "Your price isn't fixed forever — it goes up as you get older, with 30 days' warning before each change. The trade-off for starting so cheap.",
    }],
  }),
  p("l-tigersure-flexi", "tigersure", "TigerSure Flexi Term", "life", 49, {
    coverAmount: 300_000, rating: 4.1,
    flexible: true,
    segments: ["gig"],
    highlights: ["Dial cover up or down monthly as income changes", "No penalty for missed months (cover pauses)", "Payout includes RM 12k immediate expenses advance"],
    features: { "Sum assured": "RM 300k (adjustable)", "Term": "Renewable yearly", "Accidental death": "2× payout", "Cover pause": true, "Cash value": false },
    fineprint: [gigPause(), suicideClause(12), {
      term: "Cover adjustment",
      original: "Requests to vary the Sum Assured shall take effect from the next premium due date, provided that any increase exceeding 25% of the prevailing Sum Assured within a 12-month period shall require fresh underwriting.",
      plain: "You can change your cover amount monthly. Small raises happen automatically; raising it by more than 25% in a year means answering health questions again.",
    }],
  }),
  p("l-zenith-expat", "zenith", "Zenith Expat Life", "life", 132, {
    coverAmount: 750_000, rating: 4.4,
    multilingual: true,
    segments: ["expat"],
    highlights: ["Valid across 60+ countries, follows you when you move", "Payout in MYR, USD or EUR", "Repatriation costs covered up to RM 50k"],
    features: { "Sum assured": "RM 750k", "Term": "To age 65", "Accidental death": "2× payout", "Currency choice": "MYR/USD/EUR", "Repatriation": "RM 50k" },
    fineprint: [suicideClause(24), {
      term: "Territorial scope",
      original: "Coverage shall extend worldwide save for death occurring in a Excluded Territory as gazetted in Annex C (territories under active armed conflict or comprehensive international sanctions) where the Life Assured has resided for more than 90 consecutive days.",
      plain: "You're covered almost everywhere in the world. The exception: if you move to an active war zone or heavily sanctioned country for more than 90 days, deaths there aren't covered.",
    }, {
      term: "Contestability",
      original: "The Company may contest this Policy within 2 years of issue for material misrepresentation, including misstatement of country of residence or occupation at proposal.",
      plain: "Be accurate about where you live and what you do for work when applying. For 2 years, wrong answers on those could void the policy.",
    }],
  }),
  p("l-hornbill-wholelife", "hornbill", "Hornbill WholeLife Plus", "life", 286, {
    coverAmount: 1_000_000, rating: 4.6,
    familyBundle: true,
    segments: ["family"],
    highlights: ["RM 1M lifetime cover with growing cash value", "Borrow against the policy after year 5", "Premium waived if you're disabled"],
    features: { "Sum assured": "RM 1M", "Term": "Whole of life", "Accidental death": "2× payout", "Cash value": "Guaranteed + bonus", "Premium waiver": "On disability" },
    fineprint: [suicideClause(12), {
      term: "Policy loan",
      original: "After the Policy has acquired a cash value, the Policyholder may obtain a loan not exceeding 80% of such cash value, with interest at the Company's prevailing rate compounding annually; outstanding loans plus interest shall be deducted from any benefit payable.",
      plain: "From year 5-ish you can borrow up to 80% of your policy's saved-up value. Interest compounds, and anything you haven't repaid is subtracted from the final payout. It's a backup credit line, not free money.",
    }, {
      term: "Bonus rates",
      original: "Reversionary bonuses are not guaranteed and shall be declared annually at the absolute discretion of the Company based on the performance of the participating fund.",
      plain: "The 'growth' part of this policy depends on the insurer's investment results each year — it's been 3–5% historically but is not promised. Only the base RM 1M is guaranteed.",
    }],
  }),

  // ---------- MOTOR ----------
  p("m-tigersure-ridepro", "tigersure", "TigerSure Ride Pro", "motor", 68, {
    coverAmount: 45_000, rating: 4.3,
    flexible: true, cashless: true, panelCount: 88,
    segments: ["gig"],
    highlights: ["E-hailing & delivery use covered by default", "Daily income RM 50 while bike/car is in workshop", "Approved claims paid out within 3 working days"],
    features: { "Cover type": "Comprehensive", "Agreed value": "RM 45k", "E-hailing use": true, "Flood cover": "Optional +RM 8/mo", "Panel workshops": 88, "Workshop income": "RM 50/day" },
    fineprint: [namedDriver(400), betterment(5), {
      term: "Usage class",
      original: "The Vehicle is warranted for use for social, domestic, pleasure and business purposes including carriage of passengers or goods for hire or reward under a valid e-hailing or p-hailing authorisation.",
      plain: "Unlike normal policies, this one explicitly covers using your vehicle for Grab, food delivery, and similar work. On a standard policy, crashing while on a delivery job can void your claim entirely.",
    }],
  }),
  p("m-merdeka-comprehensive", "merdeka", "Merdeka Motor Comprehensive", "motor", 95, {
    coverAmount: 80_000, rating: 4.4,
    cashless: true, panelCount: 156, beginnerFriendly: true,
    segments: ["novice", "family"],
    highlights: ["24/7 towing up to 200km included", "No-claim discount protected after 1 claim-free year", "Windscreen cover included, no extra premium"],
    features: { "Cover type": "Comprehensive", "Agreed value": "RM 80k", "E-hailing use": false, "Flood cover": "Optional +RM 12/mo", "Panel workshops": 156, "Towing": "200km free" },
    fineprint: [betterment(5), namedDriver(400), {
      term: "No-claim discount (NCD)",
      original: "The NCD entitlement shall progress in accordance with the scale prescribed under the Motor Tariff (0%, 25%, 30%, 38.33%, 45%, 55%) and shall be forfeited in its entirety upon any claim where the Insured is wholly or partially at fault, save where NCD Protection has been endorsed hereon.",
      plain: "Every claim-free year earns you a bigger discount, up to 55% off. One at-fault claim normally resets it to zero — but this plan includes protection so your first claim doesn't wipe out the discount you've built.",
    }],
  }),
  p("m-nusadrive-saver", "nusa", "NusaDrive Saver", "motor", 52, {
    coverAmount: 35_000, rating: 3.9,
    segments: ["novice", "gig"],
    highlights: ["Cheapest road-legal comprehensive option", "Fixed RM 52/month, no hidden loadings", "Online claims with photo estimate"],
    features: { "Cover type": "Comprehensive (basic)", "Agreed value": "RM 35k", "E-hailing use": false, "Flood cover": false, "Panel workshops": "Any PIAM workshop", "Towing": "50km free" },
    fineprint: [betterment(7), namedDriver(500), {
      term: "Market value settlement",
      original: "In the event of total loss, the Company's liability shall not exceed the market value of the Vehicle at the time of loss as determined by the ISM Automotive Business Intelligence valuation, notwithstanding the sum insured stated in the Schedule.",
      plain: "If your car is totalled, you get what the car was worth that day (per an industry database) — not the number on your policy. If you insured it for RM 35k but it's worth RM 28k by then, you get RM 28k. 'Agreed value' plans don't have this catch.",
    }],
  }),
  p("m-amanah-motor", "amanah", "Amanah Motor Takaful", "motor", 84, {
    coverAmount: 70_000, rating: 4.5,
    multilingual: true, cashless: true, panelCount: 132,
    segments: ["family"],
    highlights: ["Flood & landslide cover included by default", "Surplus contributions returned annually", "Free personal accident cover for all passengers"],
    features: { "Cover type": "Comprehensive", "Agreed value": "RM 70k", "E-hailing use": false, "Flood cover": "Included", "Panel workshops": 132, "Passenger PA": "Included" },
    fineprint: [betterment(5), namedDriver(400), {
      term: "Special perils",
      original: "Loss or damage occasioned by flood, typhoon, hurricane, storm, tempest, volcanic eruption, earthquake, landslide, landslip or other convulsion of nature is covered hereunder without additional contribution.",
      plain: "Damage from floods and landslides — which most Malaysian policies charge extra for — is included free. Worth a lot if you park anywhere that's ever flooded.",
    }],
  }),
  p("m-zenith-autoelite", "zenith", "Zenith AutoElite", "motor", 158, {
    coverAmount: 180_000, rating: 4.4,
    multilingual: true, cashless: true, panelCount: 64,
    segments: ["expat", "family"],
    highlights: ["Agreed value — payout fixed at signup, no depreciation", "Genuine manufacturer parts guaranteed", "Courtesy car for up to 14 days during repairs"],
    features: { "Cover type": "Comprehensive (agreed value)", "Agreed value": "RM 180k fixed", "E-hailing use": false, "Flood cover": "Included", "Panel workshops": "64 premium", "Courtesy car": "14 days" },
    fineprint: [namedDriver(750), {
      term: "Agreed value",
      original: "The sum insured stated in the Schedule represents the agreed value of the Vehicle, and in the event of total loss the Company shall pay such agreed value in full without application of depreciation or market value adjustment.",
      plain: "The payout for a total loss is locked at RM 180k when you sign — no haggling about market value later. This is the clause that makes premium plans premium.",
    }, {
      term: "Repair warranty",
      original: "All repairs effected at the Company's premium panel workshops carry a workmanship warranty of 24 months, and shall utilise only parts supplied or certified by the original equipment manufacturer.",
      plain: "Repairs use genuine parts only and are guaranteed for 2 years. No imitation parts, no arguing with the workshop.",
    }],
  }),
  p("m-hornbill-drivesecure", "hornbill", "Hornbill DriveSecure", "motor", 102, {
    coverAmount: 90_000, rating: 4.3,
    familyBundle: true, cashless: true, panelCount: 145,
    segments: ["family"],
    highlights: ["Multi-car discount: 15% off each extra vehicle", "Family members auto-covered as named drivers", "Child seat replacement after any accident"],
    features: { "Cover type": "Comprehensive", "Agreed value": "RM 90k", "E-hailing use": false, "Flood cover": "Optional +RM 10/mo", "Panel workshops": 145, "Multi-car discount": "15%" },
    fineprint: [betterment(5), namedDriver(400), {
      term: "Household named drivers",
      original: "All persons ordinarily resident at the Insured's address and holding a full valid driving licence shall be deemed named drivers hereunder at no additional premium, subject to disclosure in the proposal form.",
      plain: "Everyone living in your house with a full licence counts as a named driver automatically — your spouse or adult kids can drive without the RM 400 penalty. Just list them when applying.",
    }],
  }),

  // ---------- CRITICAL ILLNESS ----------
  p("c-amanah-cishield", "amanah", "Amanah CI Shield", "critical", 47, {
    coverAmount: 150_000, rating: 4.5,
    multilingual: true,
    segments: ["novice", "family"],
    highlights: ["Covers 45 critical illnesses", "10% extra payout for cancers below age 40", "Premiums returned at 70 if never claimed"],
    features: { "Sum assured": "RM 150k", "Illnesses covered": 45, "Early-stage payout": "30%", "Survival period": "7 days", "Premium return": "At age 70" },
    fineprint: [survivalPeriod(7), earlyStage(30), waitingPeriod(60, 120)],
  }),
  p("c-merdeka-ci36", "merdeka", "Merdeka CI 36", "critical", 39, {
    coverAmount: 100_000, rating: 4.2,
    beginnerFriendly: true,
    segments: ["novice"],
    highlights: ["Simple cover for the 36 most common illnesses", "Approval with 3 health questions only", "RM 5k immediate diagnosis cash advance"],
    features: { "Sum assured": "RM 100k", "Illnesses covered": 36, "Early-stage payout": false, "Survival period": "14 days", "Premium return": false },
    fineprint: [survivalPeriod(14), waitingPeriod(60, 120), preExisting(24)],
  }),
  p("c-hornbill-criticare", "hornbill", "Hornbill CritiCare Max", "critical", 142, {
    coverAmount: 300_000, rating: 4.7,
    familyBundle: true,
    segments: ["family"],
    highlights: ["Pays from early stage — 50% on first diagnosis", "Covers 120 conditions incl. diabetes complications", "Kids' juvenile illnesses covered free"],
    features: { "Sum assured": "RM 300k", "Illnesses covered": 120, "Early-stage payout": "50%", "Survival period": "0 days", "Juvenile cover": "Included" },
    fineprint: [earlyStage(50), waitingPeriod(60, 90), {
      term: "Multiple claims",
      original: "Following payment of an early or intermediate stage benefit, the Policy shall remain in force for the remaining Sum Assured in respect of Covered Illnesses of a different organ system group, subject to a 12-month inter-claim waiting period.",
      plain: "After an early-stage payout, you can still claim the rest later — even for a different illness — as long as 12 months have passed and it affects a different organ system. Many plans simply end after the first claim.",
    }],
  }),
  p("c-tigersure-incomeguard", "tigersure", "TigerSure Income Guard", "critical", 33, {
    coverAmount: 75_000, rating: 4.1,
    flexible: true,
    segments: ["gig"],
    highlights: ["RM 1,500/month income replacement for 12 months", "Designed for riders & drivers with no sick leave", "Covers accidents AND 36 illnesses"],
    features: { "Sum assured": "RM 75k", "Illnesses covered": 36, "Income replacement": "RM 1.5k × 12 mo", "Survival period": "14 days", "Cover pause": true },
    fineprint: [survivalPeriod(14), gigPause(), {
      term: "Income benefit conditions",
      original: "The monthly income benefit shall be payable upon certification by a Registered Medical Practitioner of total temporary disablement preventing the Life Assured from performing each and every duty of their usual occupation, for a maximum of 12 monthly payments per claim event.",
      plain: "The RM 1,500/month kicks in when a doctor certifies you can't do your normal work (riding, driving, deliveries). It pays for up to 12 months per illness or accident — it's sick pay for people without sick pay.",
    }],
  }),
  p("c-zenith-globalci", "zenith", "Zenith Global CI", "critical", 118, {
    coverAmount: 250_000, rating: 4.4,
    multilingual: true,
    segments: ["expat", "family"],
    highlights: ["Diagnosis accepted from hospitals in 60+ countries", "Second medical opinion service included", "Medical evacuation to home country covered"],
    features: { "Sum assured": "RM 250k", "Illnesses covered": 88, "Early-stage payout": "25%", "Survival period": "7 days", "Overseas diagnosis": true },
    fineprint: [survivalPeriod(7), earlyStage(25), {
      term: "Overseas diagnosis",
      original: "Diagnosis made outside Malaysia shall be recognised provided it is made at a hospital accredited by the Joint Commission International or equivalent national accreditation body, and supported by clinical, radiological, histological and laboratory evidence acceptable to the Company's Chief Medical Officer.",
      plain: "You can be diagnosed at any internationally-accredited hospital abroad and still claim — important if you live overseas. Keep complete medical records; their doctors will review them.",
    }],
  }),
];
