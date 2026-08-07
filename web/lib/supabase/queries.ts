import { supabase } from "./client";
import type { GymClass, Day, Level, ClassType } from "../types";

function toHHMM(pgTime: string): string {
  return pgTime.slice(0, 5);
}

function rowToGymClass(row: {
  id: string;
  name: string;
  type: string;
  day: string;
  start_time: string;
  duration_min: number;
  trainer_id: string;
  spots_available: number;
  level: string;
  room: string;
}): GymClass {
  return {
    id: row.id,
    name: row.name,
    type: row.type as ClassType,
    day: row.day as Day,
    time: toHHMM(row.start_time),
    durMin: row.duration_min,
    trainerId: row.trainer_id,
    spots: row.spots_available,
    level: row.level as Level,
    room: row.room,
  };
}

/** All bookable class instances. Live -- spots_available reflects real bookings. */
export async function getClasses(): Promise<GymClass[]> {
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, type, day, start_time, duration_min, trainer_id, spots_available, level, room")
    .order("day")
    .order("start_time");

  if (error) throw error;
  return (data ?? []).map(rowToGymClass);
}

export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from("contact_messages").insert(input);
  if (error) throw error;
}
