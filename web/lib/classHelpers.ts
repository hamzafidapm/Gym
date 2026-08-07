import { CLASS_COPY, LEVEL_COLOR, trainerById } from "./data";
import { ACCENT } from "./theme";
import type { GymClass } from "./types";

export interface EnrichedClass extends GymClass {
  trainerName: string;
  trainerBio: string;
  levelColor: string;
  spotsLabel: string;
  spotColor: string;
  desc: string;
  bring: string;
  booked: boolean;
  full: boolean;
  btnLabel: string;
  btnBg: string;
  btnFg: string;
}

export function enrichClass(c: GymClass, isBooked: (key: string) => boolean): EnrichedClass {
  const trainer = trainerById(c.trainerId);
  const copy = CLASS_COPY[c.type];
  const booked = isBooked(c.key);
  const full = c.spots <= 0;
  return {
    ...c,
    trainerName: trainer?.name ?? "",
    trainerBio: trainer?.short ?? "",
    levelColor: LEVEL_COLOR[c.level],
    spotsLabel: full ? "WAITLIST" : c.spots + " SPOTS LEFT",
    spotColor: full ? "#FF6B3D" : c.spots < 4 ? "#FFB020" : "#9A9E93",
    desc: copy.desc,
    bring: copy.bring,
    booked,
    full,
    btnLabel: booked ? "Booked ✓" : full ? "Join waitlist" : "Book now",
    btnBg: booked ? "rgba(200,255,46,.16)" : full ? "rgba(255,255,255,.08)" : ACCENT,
    btnFg: booked ? ACCENT : full ? "#9A9E93" : "#0A0B09",
  };
}
