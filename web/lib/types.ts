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

export interface GymClass {
  key: string;
  name: string;
  type: ClassType;
  day: Day;
  time: string;
  durMin: number;
  trainerId: TrainerId;
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

export interface Booking {
  key: string;
  name: string;
  day: Day;
  time: string;
  dur: string;
  trainer: string;
  room: string;
}
