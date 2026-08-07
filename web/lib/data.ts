import type { ClassType, Day, Level, Plan, Testimonial, Trainer, TrainerId } from "./types";

export const IMG = {
  strength: "/img/strength.png",
  hiit: "/img/hiit.png",
  boxing: "/img/boxing.png",
  coaching: "/img/coaching.png",
  yoga: "/img/yoga.png",
} as const;

const TRAINER_IMG: Record<TrainerId, string> = {
  mara: IMG.strength,
  dez: IMG.boxing,
  iris: IMG.yoga,
  cole: IMG.hiit,
  nia: IMG.hiit,
  tomas: IMG.coaching,
};

export const TRAINERS: Trainer[] = [
  {
    id: "mara",
    name: "Mara Vance",
    first: "MARA",
    specialty: "STRENGTH / POWERLIFTING",
    certs: "NSCA-CSCS, USAW L2, Precision Nutrition L1",
    short: "Ten years under a bar. Programs the Heavy Metal block.",
    bio: "Mara ran collegiate strength and conditioning for six years before opening the IRONHAUS barbell program. She coaches the squat like a craft: slow accessories, honest loads, and a logbook you actually fill in.",
    img: TRAINER_IMG.mara,
  },
  {
    id: "dez",
    name: "Dez Okafor",
    first: "DEZ",
    specialty: "BOXING / CONDITIONING",
    certs: "USA Boxing L2, NASM-CPT",
    short: "Amateur record 18-3. Teaches footwork before fists.",
    bio: "Dez spent nine years in the amateur ranks and now runs our boxing floor. Expect long rounds on the bag, real defensive drills, and zero cardio-kickboxing choreography.",
    img: TRAINER_IMG.dez,
  },
  {
    id: "iris",
    name: "Iris Lund",
    first: "IRIS",
    specialty: "YOGA / MOBILITY",
    certs: "RYT-500, FRCms, Yin 100hr",
    short: "Recovery is training. She makes sure you believe it.",
    bio: "Iris builds the mobility work that keeps heavy lifters lifting. Her sessions are quiet, precise, and unexpectedly hard — end range strength, not stretching for its own sake.",
    img: TRAINER_IMG.iris,
  },
  {
    id: "cole",
    name: "Cole Rivas",
    first: "COLE",
    specialty: "HIIT / METCON",
    certs: "CF-L3, NSCA-CSCS",
    short: "Built the 34-minute engine block. Sorry in advance.",
    bio: "Cole designs our conditioning: intervals with a purpose, scaled three ways, tracked week over week so you can see the engine getting bigger.",
    img: TRAINER_IMG.cole,
  },
  {
    id: "nia",
    name: "Nia Brooks",
    first: "NIA",
    specialty: "CYCLE / ENDURANCE",
    certs: "Schwinn Certified, ACE-CPT, Power-based training",
    short: "Power-based rides. Watts, not vibes.",
    bio: "Nia rides with numbers. Every bike is power-metered and every ride has a target — threshold work, sweet spot, or a genuinely fun sprint night on Fridays.",
    img: TRAINER_IMG.nia,
  },
  {
    id: "tomas",
    name: "Tomas Ehle",
    first: "TOMAS",
    specialty: "PERSONAL TRAINING / REHAB",
    certs: "DPT, NSCA-CSCS, FMS L2",
    short: "Physio background. The one you see after the tweak.",
    bio: "Tomas is a licensed physical therapist who works one-on-one with members returning from injury, bridging the gap between the clinic and the platform.",
    img: TRAINER_IMG.tomas,
  },
];

export function trainerById(id: string | null | undefined): Trainer | null {
  if (!id) return null;
  return TRAINERS.find((t) => t.id === id) ?? null;
}

export const LEVEL_COLOR: Record<Level | "ALL", string> = {
  ALL: "#9A9E93",
  L1: "#7ED957",
  L2: "#C8FF2E",
  L3: "#FF6B3D",
};

// Class *instances* (specific day/time/trainer/spots rows) live in Supabase
// now -- see lib/supabase/queries.ts -- since spots_available is real,
// mutable state tied to real bookings. This copy, keyed by class type, is
// still static editorial content shown in the class detail modal.
export const CLASS_COPY: Record<ClassType, { desc: string; bring: string }> = {
  Strength: {
    desc: "Barbell work in an 8-week block. Squat, press or pull as the main lift, then two accessories and a finisher. Loads come off your logbook, not a whiteboard guess.",
    bring: "Lifting shoes, a notebook, a belt if you own one. Chalk is on us.",
  },
  HIIT: {
    desc: "Interval conditioning built on measurable work — rower, bike, sled and carries. Scaled three ways, always. You will know your score.",
    bring: "Cross-trainers, a towel, a bottle you can refill mid-round.",
  },
  Boxing: {
    desc: "Technique first: stance, footwork, then combinations on the bag. Contact is optional and never a surprise.",
    bring: "Hand wraps (sold at front desk), gloves if you have them, water.",
  },
  Yoga: {
    desc: "Slow, warm and mobility-driven — built for people who lift heavy the rest of the week. No inversions, no pressure.",
    bring: "Nothing. Mats, blocks and straps are here.",
  },
  Cycle: {
    desc: "Power-metered ride with a written target for the day. Threshold, sweet spot or sprint sets, depending on the block.",
    bring: "Cycling shoes (SPD) or trainers, two bottles.",
  },
  Mobility: {
    desc: "End-range strength work for hips, shoulders and ankles. Assessed on week one, re-tested on week eight.",
    bring: "Socks, a towel, patience.",
  },
};

export const PLAN_BASE: Plan[] = [
  {
    name: "BASIC",
    tag: "GET STARTED",
    monthly: 39,
    sub: "Open gym + 4 classes a month",
    features: [
      "24/7 open gym access",
      "4 group classes per month",
      "Full locker room + towel service",
      "Free InBody scan every quarter",
    ],
  },
  {
    name: "PREMIUM",
    tag: "MOST POPULAR",
    monthly: 79,
    sub: "Unlimited classes, everything open",
    features: [
      "Everything in Basic",
      "Unlimited group classes",
      "Priority booking 14 days out",
      "1 personal training session / month",
      "Recovery room + sauna access",
    ],
  },
  {
    name: "ELITE",
    tag: "FULL SUPPORT",
    monthly: 129,
    sub: "Coached, programmed, tracked",
    features: [
      "Everything in Premium",
      "4 personal training sessions / month",
      "Custom 8-week written program",
      "Nutrition check-in every 2 weeks",
      "Guest passes ×2 per month",
    ],
  },
];

export const COMPARE_ROWS = [
  { label: "Open gym access", basic: "24/7", premium: "24/7", elite: "24/7" },
  { label: "Group classes", basic: "4 / month", premium: "Unlimited", elite: "Unlimited" },
  { label: "Personal training", basic: "—", premium: "1 / month", elite: "4 / month" },
  { label: "Written program", basic: "—", premium: "Templates", elite: "Custom 8-week" },
  { label: "Recovery room + sauna", basic: "—", premium: "Included", elite: "Included" },
  { label: "Guest passes", basic: "—", premium: "1 / month", elite: "2 / month" },
  { label: "Booking window", basic: "3 days", premium: "14 days", elite: "21 days" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I came in to lose weight and left with a 245 lb deadlift I didn’t know I wanted. Fourteen months, three blocks, zero missed check-ins.",
    name: "Priya R.",
    meta: "Member since 2024 · Premium",
  },
  {
    quote:
      "Every other gym sold me a year. IRONHAUS gave me a program and a coach who noticed when I stopped showing up.",
    name: "Marcus T.",
    meta: "Member since 2022 · Elite",
  },
  {
    quote:
      "Post-surgery I thought heavy training was over. Tomas rebuilt my shoulder in eight weeks of boring, careful work. I press again.",
    name: "Elena D.",
    meta: "Member since 2023 · Elite",
  },
  {
    quote:
      "The 06:00 crew is the only reason I get out of bed. Nobody performs. Everybody works.",
    name: "Jae Kim",
    meta: "Member since 2021 · Premium",
  },
];

export const GALLERY: { alt: string; label: string; img: string; pos: string }[] = [
  {
    alt: "Member locking out a heavy deadlift on the platform",
    label: "PLATFORM / 06:00",
    img: IMG.strength,
    pos: "center 35%",
  },
  {
    alt: "Coach cueing a dumbbell row during a personal training session",
    label: "SPOT / 1-ON-1",
    img: IMG.coaching,
    pos: "center 30%",
  },
  {
    alt: "Fighter wrapping his hands before bag work",
    label: "WRAPS / BAG ROW",
    img: IMG.boxing,
    pos: "center 45%",
  },
  {
    alt: "Group class moving through a squat interval",
    label: "ENGINE ROOM",
    img: IMG.hiit,
    pos: "center 40%",
  },
  {
    alt: "Sunset yoga class in Studio C",
    label: "STUDIO C / 20:00",
    img: IMG.yoga,
    pos: "center 45%",
  },
  {
    alt: "Barbell set up for a strength block",
    label: "STRENGTH BLOCK",
    img: IMG.strength,
    pos: "left 40%",
  },
  {
    alt: "Coach leading the Saturday group session",
    label: "SATURDAY CREW",
    img: IMG.hiit,
    pos: "right 45%",
  },
  {
    alt: "Boxing gloves and wraps on the conditioning floor",
    label: "GLOVES",
    img: IMG.boxing,
    pos: "left 55%",
  },
];

export const CATEGORIES: {
  num: string;
  name: string;
  blurb: string;
  count: number;
  type: ClassType;
  img: string;
  alt: string;
}[] = [
  {
    num: "01",
    name: "STRENGTH",
    blurb: "Barbell blocks, real loads, a logbook that fills up.",
    count: 6,
    type: "Strength",
    img: IMG.strength,
    alt: "Member pulling a heavy deadlift during a strength block",
  },
  {
    num: "02",
    name: "HIIT",
    blurb: "Measured intervals. Rower, bike, sled, carry, repeat.",
    count: 4,
    type: "HIIT",
    img: IMG.hiit,
    alt: "Coach leading a group HIIT class through squat intervals",
  },
  {
    num: "03",
    name: "BOXING",
    blurb: "Footwork before fists. Contact always optional.",
    count: 4,
    type: "Boxing",
    img: IMG.boxing,
    alt: "Boxer wrapping his hands before bag work",
  },
  {
    num: "04",
    name: "YOGA",
    blurb: "Warm, slow, built for people who lift heavy.",
    count: 3,
    type: "Yoga",
    img: IMG.yoga,
    alt: "Sunset yoga class seated in the studio",
  },
  {
    num: "05",
    name: "CYCLE",
    blurb: "Power-metered rides with a written target.",
    count: 4,
    type: "Cycle",
    img: IMG.hiit,
    alt: "Members training together in the conditioning studio",
  },
  {
    num: "06",
    name: "MOBILITY",
    blurb: "End-range strength. Assessed and re-tested.",
    count: 3,
    type: "Mobility",
    img: IMG.coaching,
    alt: "Coach guiding a member through a controlled dumbbell row",
  },
];

export const NAV_ITEMS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/classes", label: "Schedule" },
  { href: "/trainers", label: "Coaches" },
  { href: "/pricing", label: "Membership" },
  { href: "/contact", label: "Visit" },
];

export const DAY_ORDER: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_NAMES: Record<Day, string> = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
  Sun: "SUNDAY",
};

export function fmtPrice(monthly: number, annual: boolean): string {
  return annual ? "$" + Math.round(monthly * 10) : "$" + monthly;
}

export function planByName(name: string): Plan {
  return PLAN_BASE.find((p) => p.name === name) ?? PLAN_BASE[1];
}
