export type TrainerId = "mara" | "dez" | "iris" | "cole" | "nia" | "tomas";

export interface Trainer {
  id: TrainerId;
  name: string;
  first: string;
  specialty: string;
  certs: string;
  short: string;
  bio: string;
  img: string;
}

export type ClassType =
  | "Strength"
  | "HIIT"
  | "Boxing"
  | "Yoga"
  | "Cycle"
  | "Mobility";

export type Level = "L1" | "L2" | "L3";

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// Class instances are live (Supabase `classes` table) since spots_available
// is real mutable state. `id` is the row's uuid, not the old static index key.
export interface GymClass {
  id: string;
  name: string;
  type: ClassType;
  day: Day;
  time: string;
  durMin: number;
  trainerId: string;
  spots: number;
  level: Level;
  room: string;
}

export interface Plan {
  name: "BASIC" | "PREMIUM" | "ELITE";
  tag: string;
  monthly: number;
  sub: string;
  features: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  meta: string;
}

// A signed-in member's booking, joined from `bookings` + `classes` + `trainers`.
export interface Booking {
  id: string;
  classId: string;
  name: string;
  day: Day;
  time: string;
  dur: string;
  trainer: string;
  room: string;
}
