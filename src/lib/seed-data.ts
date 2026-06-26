import type { FinePrintClause, Plan, Provider } from "./types";

/**
 * NEXTINSURANCE catalog — real, well-known insurers operating in Malaysia,
 * plus global names for the expat/nomad segment. Plan figures (premiums,
 * limits, panel counts) are *illustrative prototype values* assembled from
 * each insurer's published product lines — they are not live quotes. See
 * DATA_DISCLAIMER.
 *
 * Featured collaboration partner: Zurich (NEXTGEN × Zurich).
 */

export const DATA_DISCLAIMER =
  "Insurer names and product families are real; premiums, limits and panel counts shown here are illustrative prototype values, not live quotes. NEXTINSURANCE is a NEXTGEN Co. student prototype built in collaboration with Zurich.";

export const PROVIDERS: Provider[] = [
  { id: "zurich", name: "Zurich Malaysia", short: "Zurich", trustScore: 94, tagline: "Global protection, local expertise — partnered with NEXTGEN", hue: 214, country: "Switzerland", featured: true },
  { id: "aia", name: "AIA Malaysia", short: "AIA", trustScore: 93, tagline: "Healthier, longer, better lives", hue: 18, country: "Pan-Asia" },
  { id: "prudential", name: "Prudential Malaysia", short: "Prudential", trustScore: 92, tagline: "Always listening, always understanding", hue: 344, country: "United Kingdom" },
  { id: "greateastern", name: "Great Eastern", short: "Great Eastern", trustScore: 92, tagline: "Reach for great — protecting Asia since 1908", hue: 150, country: "Singapore" },
  { id: "allianz", name: "Allianz Malaysia", short: "Allianz", trustScore: 91, tagline: "We secure your future", hue: 236, country: "Germany" },
  { id: "etiqa", name: "Etiqa Takaful", short: "Etiqa", trustScore: 88, tagline: "Humanising insurance & takaful", hue: 40, country: "Malaysia", takaful: true },
  { id: "takafulmsia", name: "Syarikat Takaful Malaysia", short: "Takaful Malaysia", trustScore: 87, tagline: "Malaysia's leading takaful operator", hue: 168, country: "Malaysia", takaful: true },
  { id: "manulife", name: "Manulife Insurance", short: "Manulife", trustScore: 89, tagline: "Decisions made easier, lives made better", hue: 128, country: "Canada" },
  { id: "axa", name: "AXA", short: "AXA", trustScore: 90, tagline: "Know you can — cover that travels with you", hue: 200, country: "France" },
  { id: "metlife", name: "MetLife", short: "MetLife", trustScore: 90, tagline: "Always with you, building a more confident future", hue: 264, country: "United States" },
];

/* ----------------------------- fine-print library ----------------------------- */

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

const contestability: FinePrintClause = {
  term: "Contestability",
  original: "The Company reserves the right to contest the validity of this Policy within 2 years from the Issue Date on grounds of material misrepresentation or non-disclosure in the proposal form.",
  plain: "For the first 2 years, the insurer can cancel the policy if you hid important facts when applying (like a smoking habit or an illness). Answer the application honestly and this clause can't touch you.",
};

const gracePeriod: FinePrintClause = {
  term: "Grace period",
  original: "A grace period of 31 days from each premium due date shall be allowed, during which the Policy shall remain in force. If the premium remains unpaid upon expiry of the grace period, the Policy shall lapse without value.",
  plain: "If you miss a payment, you have 31 days to catch up while staying fully covered. Miss that too and the policy ends with no refund — set up auto-debit to be safe.",
};

const guaranteedInsurability: FinePrintClause = {
  term: "Guaranteed insurability",
  original: "The Life Assured may, on each policy anniversary prior to attaining age 35, increase the Sum Assured by increments not exceeding RM50,000 without further evidence of insurability, subject to a cumulative maximum of RM250,000 in such increases.",
  plain: "You can raise your cover by up to RM 50k each year before you turn 35 — no new medical questions asked — until you've doubled it. Lock in cheap cover young, grow it as your salary grows.",
};

const renewalPremium: FinePrintClause = {
  term: "Renewal premium",
  original: "Premium rates are not guaranteed and shall be determined at each renewal based on attained age and the prevailing rate table, subject to 30 days' prior written notice.",
  plain: "Your price isn't fixed forever — it goes up as you get older, with 30 days' warning before each change. The trade-off for starting so cheap.",
};

const nominationHibah: FinePrintClause = {
  term: "Nomination (hibah)",
  original: "Benefits payable hereunder shall be distributed to the nominee(s) absolutely as beneficiaries under a conditional hibah, and shall not form part of the estate of the deceased Person Covered nor be subject to the debts thereof.",
  plain: "Your payout goes straight to the people you name — it skips the slow inheritance court process and can't be claimed by people you owe money to. Name your nominees when you sign up.",
};

const policyLoan: FinePrintClause = {
  term: "Policy loan",
  original: "After the Policy has acquired a cash value, the Policyholder may obtain a loan not exceeding 80% of such cash value, with interest at the Company's prevailing rate compounding annually; outstanding loans plus interest shall be deducted from any benefit payable.",
  plain: "From year 5-ish you can borrow up to 80% of your policy's saved-up value. Interest compounds, and anything you haven't repaid is subtracted from the final payout. It's a backup credit line, not free money.",
};

const bonusRates: FinePrintClause = {
  term: "Bonus rates",
  original: "Reversionary bonuses are not guaranteed and shall be declared annually at the absolute discretion of the Company based on the performance of the participating fund.",
  plain: "The 'growth' part of this policy depends on the insurer's investment results each year — it's been 3–5% historically but is not promised. Only the base sum assured is guaranteed.",
};

const coverAdjustment: FinePrintClause = {
  term: "Cover adjustment",
  original: "Requests to vary the Sum Assured shall take effect from the next premium due date, provided that any increase exceeding 25% of the prevailing Sum Assured within a 12-month period shall require fresh underwriting.",
  plain: "You can change your cover amount monthly. Small raises happen automatically; raising it by more than 25% in a year means answering health questions again.",
};

const territorialScope: FinePrintClause = {
  term: "Territorial scope",
  original: "Coverage shall extend worldwide save for death occurring in an Excluded Territory as gazetted in Annex C (territories under active armed conflict or comprehensive international sanctions) where the Life Assured has resided for more than 90 consecutive days.",
  plain: "You're covered almost everywhere in the world. The exception: if you move to an active war zone or heavily sanctioned country for more than 90 days, deaths there aren't covered.",
};

const usageClass: FinePrintClause = {
  term: "Usage class",
  original: "The Vehicle is warranted for use for social, domestic, pleasure and business purposes including carriage of passengers or goods for hire or reward under a valid e-hailing or p-hailing authorisation.",
  plain: "Unlike normal policies, this one explicitly covers using your vehicle for Grab, food delivery, and similar work. On a standard policy, crashing while on a delivery job can void your claim entirely.",
};

const ncd: FinePrintClause = {
  term: "No-claim discount (NCD)",
  original: "The NCD entitlement shall progress in accordance with the scale prescribed under the Motor Tariff (0%, 25%, 30%, 38.33%, 45%, 55%) and shall be forfeited in its entirety upon any claim where the Insured is wholly or partially at fault, save where NCD Protection has been endorsed hereon.",
  plain: "Every claim-free year earns you a bigger discount, up to 55% off. One at-fault claim normally resets it to zero — but this plan includes protection so your first claim doesn't wipe out the discount you've built.",
};

const specialPerils: FinePrintClause = {
  term: "Special perils",
  original: "Loss or damage occasioned by flood, typhoon, hurricane, storm, tempest, volcanic eruption, earthquake, landslide, landslip or other convulsion of nature is covered hereunder without additional contribution.",
  plain: "Damage from floods and landslides — which most Malaysian policies charge extra for — is included free. Worth a lot if you park anywhere that's ever flooded.",
};

const marketValue: FinePrintClause = {
  term: "Market value settlement",
  original: "In the event of total loss, the Company's liability shall not exceed the market value of the Vehicle at the time of loss as determined by the ISM Automotive Business Intelligence valuation, notwithstanding the sum insured stated in the Schedule.",
  plain: "If your car is totalled, you get what the car was worth that day (per an industry database) — not the number on your policy. 'Agreed value' plans don't have this catch.",
};

const agreedValue: FinePrintClause = {
  term: "Agreed value",
  original: "The sum insured stated in the Schedule represents the agreed value of the Vehicle, and in the event of total loss the Company shall pay such agreed value in full without application of depreciation or market value adjustment.",
  plain: "The payout for a total loss is locked at the sum insured when you sign — no haggling about market value later. This is the clause that makes premium plans premium.",
};

const repairWarranty: FinePrintClause = {
  term: "Repair warranty",
  original: "All repairs effected at the Company's premium panel workshops carry a workmanship warranty of 24 months, and shall utilise only parts supplied or certified by the original equipment manufacturer.",
  plain: "Repairs use genuine parts only and are guaranteed for 2 years. No imitation parts, no arguing with the workshop.",
};

const householdDrivers: FinePrintClause = {
  term: "Household named drivers",
  original: "All persons ordinarily resident at the Insured's address and holding a full valid driving licence shall be deemed named drivers hereunder at no additional premium, subject to disclosure in the proposal form.",
  plain: "Everyone living in your house with a full licence counts as a named driver automatically — your spouse or adult kids can drive without the excess penalty. Just list them when applying.",
};

const multipleClaims: FinePrintClause = {
  term: "Multiple claims",
  original: "Following payment of an early or intermediate stage benefit, the Policy shall remain in force for the remaining Sum Assured in respect of Covered Illnesses of a different organ system group, subject to a 12-month inter-claim waiting period.",
  plain: "After an early-stage payout, you can still claim the rest later — even for a different illness — as long as 12 months have passed and it affects a different organ system. Many plans simply end after the first claim.",
};

const incomeBenefit: FinePrintClause = {
  term: "Income benefit conditions",
  original: "The monthly income benefit shall be payable upon certification by a Registered Medical Practitioner of total temporary disablement preventing the Life Assured from performing each and every duty of their usual occupation, for a maximum of 12 monthly payments per claim event.",
  plain: "The monthly payout kicks in when a doctor certifies you can't do your normal work (riding, driving, deliveries). It pays for up to 12 months per illness or accident — it's sick pay for people without sick pay.",
};

const overseasDiagnosis: FinePrintClause = {
  term: "Overseas diagnosis",
  original: "Diagnosis made outside Malaysia shall be recognised provided it is made at a hospital accredited by the Joint Commission International or equivalent national accreditation body, and supported by clinical, radiological, histological and laboratory evidence acceptable to the Company's Chief Medical Officer.",
  plain: "You can be diagnosed at any internationally-accredited hospital abroad and still claim — important if you live overseas. Keep complete medical records; their doctors will review them.",
};

/* ----------------------------- plan builder ----------------------------- */

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
  // ===================== HEALTH =====================
  p("h-aia-medregular", "aia", "AIA A-Life Med Regular", "health", 95, {
    annualLimit: 1_500_000, roomBoard: 200, rating: 4.6,
    beginnerFriendly: true, cashless: true, panelCount: 180,
    segments: ["novice", "family"],
    highlights: ["Coverage renewable up to age 100", "Cashless admission at 180+ panel hospitals", "Guided claims through the AIA+ app"],
    features: { "Annual limit": "RM 1.5M", "Room & board": "RM 200/day", "Cashless admission": true, "Panel hospitals": 180, "Co-payment": "10%, cap RM 1,000", "Outpatient cover": false, "Worldwide cover": false },
    fineprint: [waitingPeriod(30, 120), coPay(10, 1000), preExisting(24)],
  }),
  p("h-etiqa-takafulmed", "etiqa", "Etiqa Takaful Medical", "health", 78, {
    annualLimit: 800_000, roomBoard: 150, rating: 4.4,
    beginnerFriendly: true, cashless: true, multilingual: true, panelCount: 150,
    segments: ["novice", "gig", "family"],
    highlights: ["Shariah-compliant with annual surplus sharing", "BM, English & Mandarin support line", "No co-payment on follow-up visits"],
    features: { "Annual limit": "RM 800k", "Room & board": "RM 150/day", "Cashless admission": true, "Panel hospitals": 150, "Co-payment": "5%, cap RM 800", "Outpatient cover": false, "Structure": "Takaful" },
    fineprint: [waitingPeriod(30, 120), coPay(5, 800), roomBoardCap()],
  }),
  p("h-axa-emedic", "axa", "AXA eMedic", "health", 62, {
    annualLimit: 500_000, roomBoard: 120, deductible: 300, rating: 4.1,
    beginnerFriendly: true, cashless: false, panelCount: 0,
    segments: ["novice", "gig"],
    highlights: ["Lowest entry price for a medical card", "Buy fully online in minutes", "Premiums locked in tiers, not by single age"],
    features: { "Annual limit": "RM 500k", "Room & board": "RM 120/day", "Cashless admission": false, "Panel hospitals": "Pay & claim", "Co-payment": "10%, cap RM 600", "Outpatient cover": false, "Worldwide cover": false },
    fineprint: [coPay(10, 600), waitingPeriod(30, 120), preExisting(24)],
  }),
  p("h-pru-millionmed", "prudential", "PRUMillion Med", "health", 268, {
    annualLimit: 8_000_000, roomBoard: 300, rating: 4.7,
    familyBundle: true, cashless: true, panelCount: 210,
    segments: ["family"],
    highlights: ["Up to RM 8M annual limit — among the highest in market", "No-claim discount rewards healthy years", "Covers outpatient cancer & kidney dialysis"],
    features: { "Annual limit": "RM 8M", "Room & board": "RM 300/day", "Cashless admission": true, "Panel hospitals": 210, "Co-payment": "Optional co-insurance", "Outpatient cover": true, "Family discount": "Yes" },
    fineprint: [waitingPeriod(30, 120), roomBoardCap(), preExisting(12)],
  }),
  p("h-great-medicalcare", "greateastern", "GREAT Medical Care", "health", 158, {
    annualLimit: 2_000_000, roomBoard: 250, rating: 4.5,
    familyBundle: true, cashless: true, panelCount: 195,
    segments: ["family", "novice"],
    highlights: ["One shared limit option for the whole household", "Full annual health screening included", "Dental & optical allowance"],
    features: { "Annual limit": "RM 2M", "Room & board": "RM 250/day", "Cashless admission": true, "Panel hospitals": 195, "Co-payment": "5%, cap RM 1,200", "Outpatient cover": true, "Family discount": "Kids 3+ free" },
    fineprint: [coPay(5, 1200), waitingPeriod(30, 120), roomBoardCap()],
  }),
  p("h-zurich-medicalcare", "zurich", "Zurich MedicalCare", "health", 312, {
    annualLimit: 2_500_000, roomBoard: 400, rating: 4.6,
    multilingual: true, cashless: true, panelCount: 280,
    segments: ["expat", "family"],
    highlights: ["Worldwide cover incl. Singapore & Thailand", "Direct billing across a global hospital network", "English, BM, Mandarin & Japanese helplines"],
    features: { "Annual limit": "RM 2.5M", "Room & board": "RM 400/day", "Cashless admission": true, "Panel hospitals": 280, "Co-payment": "None", "Outpatient cover": true, "Worldwide cover": true },
    fineprint: [preExisting(12), roomBoardCap(), waitingPeriod(30, 90)],
  }),
  p("h-allianz-medienhanced", "allianz", "Allianz MediEnhanced", "health", 142, {
    annualLimit: 1_800_000, roomBoard: 220, rating: 4.4,
    familyBundle: true, cashless: true, panelCount: 175,
    segments: ["family", "gig"],
    highlights: ["No lifetime limit on eligible benefits", "Allianz Road Warrior bundle discount", "24/7 medical concierge hotline"],
    features: { "Annual limit": "RM 1.8M", "Room & board": "RM 220/day", "Cashless admission": true, "Panel hospitals": 175, "Co-payment": "10%, cap RM 1,000", "Outpatient cover": false, "Worldwide cover": false },
    fineprint: [coPay(10, 1000), waitingPeriod(30, 120), preExisting(24)],
  }),
  p("h-takaful-mymedicare", "takafulmsia", "Takaful myMediCare", "health", 84, {
    annualLimit: 700_000, roomBoard: 150, rating: 4.2,
    flexible: true, multilingual: true, cashless: false, panelCount: 0,
    segments: ["gig", "family"],
    highlights: ["Pause cover up to 3 months a year", "Annual surplus shared back to participants", "Daily hospital income while you can't work"],
    features: { "Annual limit": "RM 700k", "Room & board": "RM 150/day", "Cashless admission": false, "Panel hospitals": "Pay & claim", "Co-payment": "10%, cap RM 800", "Hospital income": "RM 80/day", "Structure": "Takaful" },
    fineprint: [gigPause(), waitingPeriod(30, 120), preExisting(24)],
  }),

  // ===================== LIFE =====================
  p("l-manulife-termessential", "manulife", "Manulife Term Essential", "life", 42, {
    coverAmount: 300_000, rating: 4.3,
    beginnerFriendly: true,
    segments: ["novice"],
    highlights: ["RM 300k payout for around RM 1.40/day", "Sign up fully online in minutes", "Grow your cover later without new medical exams"],
    features: { "Sum assured": "RM 300k", "Term": "Renewable, level premium", "Accidental death": "2× payout", "Guaranteed upgrade": "To RM 600k by 35", "Cash value": false },
    fineprint: [suicideClause(12), guaranteedInsurability, renewalPremium],
  }),
  p("l-aia-signaturebeyond", "aia", "AIA Signature Beyond", "life", 188, {
    coverAmount: 800_000, rating: 4.6,
    familyBundle: true,
    segments: ["family"],
    highlights: ["Critical illness benefit with reset capability", "Accidental death payouts up to 600%", "Premium waived on total disability"],
    features: { "Sum assured": "RM 800k", "Term": "To age 100", "Accidental death": "Up to 6× payout", "Critical illness": "Resettable", "Cash value": "Guaranteed + bonus" },
    fineprint: [suicideClause(12), contestability, policyLoan],
  }),
  p("l-pru-lifeprotection", "prudential", "PRULife Protection", "life", 96, {
    coverAmount: 600_000, rating: 4.5,
    familyBundle: true,
    segments: ["family", "novice"],
    highlights: ["Flexible protection you can top up over time", "Optional critical illness with genomic testing", "Family bundling discounts"],
    features: { "Sum assured": "RM 600k", "Term": "To age 70", "Accidental death": "2× payout", "Critical illness rider": "Optional", "Cash value": false },
    fineprint: [suicideClause(12), gracePeriod, contestability],
  }),
  p("l-zurich-prestige", "zurich", "Zurich Prestige Cover", "life", 286, {
    coverAmount: 1_000_000, rating: 4.6,
    familyBundle: true,
    segments: ["family"],
    highlights: ["RM 1M lifetime cover with growing cash value", "Guaranteed dual maturity benefits", "Premium waived if you're disabled"],
    features: { "Sum assured": "RM 1M", "Term": "Whole of life", "Accidental death": "2× payout", "Maturity benefit": "Up to 530% over 20 yrs", "Cash value": "Guaranteed + bonus" },
    fineprint: [suicideClause(12), policyLoan, bonusRates],
  }),
  p("l-etiqa-legacy", "etiqa", "Etiqa Legacy Takaful", "life", 88, {
    coverAmount: 600_000, rating: 4.5,
    multilingual: true, familyBundle: true,
    segments: ["family"],
    highlights: ["Hibah structure pays family directly, bypassing probate", "Annual surplus returned to contributors", "Badal Hajj benefit included"],
    features: { "Sum assured": "RM 600k", "Term": "To age 70", "Accidental death": "2× payout", "Structure": "Takaful (hibah)", "Cash value": "Surplus sharing" },
    fineprint: [suicideClause(12), nominationHibah, preExisting(24)],
  }),
  p("l-metlife-globalterm", "metlife", "MetLife Global Term", "life", 124, {
    coverAmount: 750_000, rating: 4.4,
    multilingual: true,
    segments: ["expat"],
    highlights: ["Valid across 60+ countries, follows you when you move", "Payout in MYR, USD or EUR", "Repatriation costs covered up to RM 50k"],
    features: { "Sum assured": "RM 750k", "Term": "To age 65", "Accidental death": "2× payout", "Currency choice": "MYR/USD/EUR", "Repatriation": "RM 50k" },
    fineprint: [suicideClause(24), territorialScope, contestability],
  }),
  p("l-greateastern-supremelife", "greateastern", "GREAT SupremeLife", "life", 52, {
    coverAmount: 250_000, rating: 4.3,
    beginnerFriendly: true, flexible: true,
    segments: ["novice", "gig"],
    highlights: ["Entry life cover designed for under-30s", "Dial cover up or down as income changes", "Upgrade later without new medical exams"],
    features: { "Sum assured": "RM 250k (adjustable)", "Term": "Renewable yearly", "Accidental death": "2× payout", "Cover pause": true, "Cash value": false },
    fineprint: [suicideClause(12), coverAdjustment],
  }),

  // ===================== MOTOR =====================
  p("m-takaful-mymotor", "takafulmsia", "Takaful myMotor", "motor", 64, {
    coverAmount: 45_000, rating: 4.3,
    flexible: true, cashless: true, panelCount: 90,
    segments: ["gig"],
    highlights: ["E-hailing & delivery use covered by default", "Daily income while your vehicle is in the workshop", "Approved claims paid out fast, no lifetime limit"],
    features: { "Cover type": "Comprehensive", "Agreed value": "RM 45k", "E-hailing use": true, "Flood cover": "Optional", "Panel workshops": 90, "Workshop income": "RM 50/day" },
    fineprint: [namedDriver(400), betterment(5), usageClass],
  }),
  p("m-allianz-roadwarrior", "allianz", "Allianz Road Warrior", "motor", 92, {
    coverAmount: 80_000, rating: 4.4,
    cashless: true, panelCount: 160, beginnerFriendly: true,
    segments: ["novice", "family"],
    highlights: ["24/7 towing up to 200km included", "NCD protected after 1 claim-free year", "Windscreen cover, no extra premium"],
    features: { "Cover type": "Comprehensive", "Agreed value": "RM 80k", "E-hailing use": false, "Flood cover": "Optional", "Panel workshops": 160, "Towing": "200km free" },
    fineprint: [betterment(5), namedDriver(400), ncd],
  }),
  p("m-etiqa-privatecar", "etiqa", "Etiqa Private Car Takaful", "motor", 86, {
    coverAmount: 70_000, rating: 4.5,
    multilingual: true, cashless: true, panelCount: 135,
    segments: ["family"],
    highlights: ["Flood & landslide cover included by default", "Surplus contributions returned annually", "Free personal accident cover for passengers"],
    features: { "Cover type": "Comprehensive", "Agreed value": "RM 70k", "E-hailing use": false, "Flood cover": "Included", "Panel workshops": 135, "Passenger PA": "Included", "Structure": "Takaful" },
    fineprint: [betterment(5), namedDriver(400), specialPerils],
  }),
  p("m-zurich-zdriver", "zurich", "Zurich Z-Driver", "motor", 108, {
    coverAmount: 90_000, rating: 4.5,
    familyBundle: true, cashless: true, panelCount: 150,
    segments: ["family"],
    highlights: ["Multi-car discount across the household", "Family members auto-covered as named drivers", "Roadside assistance & child seat replacement"],
    features: { "Cover type": "Comprehensive", "Agreed value": "RM 90k", "E-hailing use": false, "Flood cover": "Optional", "Panel workshops": 150, "Multi-car discount": "Yes" },
    fineprint: [betterment(5), namedDriver(400), householdDrivers],
  }),
  p("m-axa-smartdrive", "axa", "AXA SmartDrive Xclusive", "motor", 162, {
    coverAmount: 180_000, rating: 4.4,
    multilingual: true, cashless: true, panelCount: 70,
    segments: ["expat", "family"],
    highlights: ["Agreed value — payout fixed at signup, no depreciation", "Genuine manufacturer parts guaranteed", "Courtesy car for up to 14 days during repairs"],
    features: { "Cover type": "Comprehensive (agreed value)", "Agreed value": "RM 180k fixed", "E-hailing use": false, "Flood cover": "Included", "Panel workshops": "70 premium", "Courtesy car": "14 days" },
    fineprint: [namedDriver(750), agreedValue, repairWarranty],
  }),
  p("m-allianz-motoreasy", "allianz", "Allianz MotorEasy", "motor", 50, {
    coverAmount: 35_000, rating: 3.9,
    segments: ["novice", "gig"],
    highlights: ["Cheapest road-legal comprehensive option", "Fixed monthly price, no hidden loadings", "Online claims with photo estimate"],
    features: { "Cover type": "Comprehensive (basic)", "Agreed value": "RM 35k", "E-hailing use": false, "Flood cover": false, "Panel workshops": "Any PIAM workshop", "Towing": "50km free" },
    fineprint: [betterment(7), namedDriver(500), marketValue],
  }),

  // ===================== CRITICAL ILLNESS =====================
  p("c-aia-criticalcover", "aia", "AIA A-Life Critical Cover", "critical", 52, {
    coverAmount: 150_000, rating: 4.5,
    multilingual: true,
    segments: ["novice", "family"],
    highlights: ["Covers 45 critical illnesses", "10% extra payout for cancers below age 40", "Premiums returned at 70 if never claimed"],
    features: { "Sum assured": "RM 150k", "Illnesses covered": 45, "Early-stage payout": "30%", "Survival period": "7 days", "Premium return": "At age 70" },
    fineprint: [survivalPeriod(7), earlyStage(30), waitingPeriod(60, 120)],
  }),
  p("c-pru-withyou", "prudential", "PRUWith You CI", "critical", 58, {
    coverAmount: 200_000, rating: 4.4,
    beginnerFriendly: true,
    segments: ["novice"],
    highlights: ["Cover for 160+ conditions across all stages", "Approval with a short health questionnaire", "Immediate diagnosis cash advance"],
    features: { "Sum assured": "RM 200k", "Illnesses covered": 160, "Early-stage payout": "Yes", "Survival period": "14 days", "Premium return": false },
    fineprint: [survivalPeriod(14), waitingPeriod(60, 120), preExisting(24)],
  }),
  p("c-great-criticare", "greateastern", "GREAT CritiCare", "critical", 148, {
    coverAmount: 300_000, rating: 4.7,
    familyBundle: true,
    segments: ["family"],
    highlights: ["Pays from early stage — 50% on first diagnosis", "Covers 160 conditions incl. diabetes complications", "Kids' juvenile illnesses covered free"],
    features: { "Sum assured": "RM 300k", "Illnesses covered": 160, "Early-stage payout": "50%", "Survival period": "0 days", "Juvenile cover": "Included" },
    fineprint: [earlyStage(50), waitingPeriod(60, 90), multipleClaims],
  }),
  p("c-etiqa-incomeguard", "etiqa", "Etiqa CI Income Guard", "critical", 34, {
    coverAmount: 75_000, rating: 4.1,
    flexible: true,
    segments: ["gig"],
    highlights: ["RM 1,500/month income replacement for 12 months", "Designed for riders & drivers with no sick leave", "Covers accidents AND 36 illnesses"],
    features: { "Sum assured": "RM 75k", "Illnesses covered": 36, "Income replacement": "RM 1.5k × 12 mo", "Survival period": "14 days", "Cover pause": true },
    fineprint: [survivalPeriod(14), gigPause(), incomeBenefit],
  }),
  p("c-metlife-globalci", "metlife", "MetLife Global CI", "critical", 122, {
    coverAmount: 250_000, rating: 4.4,
    multilingual: true,
    segments: ["expat", "family"],
    highlights: ["Diagnosis accepted from hospitals in 60+ countries", "Second medical opinion service included", "Medical evacuation to home country covered"],
    features: { "Sum assured": "RM 250k", "Illnesses covered": 88, "Early-stage payout": "25%", "Survival period": "7 days", "Overseas diagnosis": true },
    fineprint: [survivalPeriod(7), earlyStage(25), overseasDiagnosis],
  }),
  p("c-takaful-cicare", "takafulmsia", "Takaful CI Care", "critical", 44, {
    coverAmount: 120_000, rating: 4.2,
    multilingual: true,
    segments: ["family", "novice"],
    highlights: ["Shariah-compliant critical illness cover", "Covers 40 conditions with early-stage payout", "Surplus shared back to participants"],
    features: { "Sum assured": "RM 120k", "Illnesses covered": 40, "Early-stage payout": "30%", "Survival period": "7 days", "Structure": "Takaful" },
    fineprint: [survivalPeriod(7), earlyStage(30), waitingPeriod(60, 120)],
  }),
];
