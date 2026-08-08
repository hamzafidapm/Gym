// Reseeds the bookable class instances. Safe to run on every deploy -- it
// only ever touches GymClass, never User/Booking/ContactMessage, so real
// member data is never at risk here.
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type RawClass = [
  name: string,
  type: string,
  day: string,
  startTime: string,
  durationMin: number,
  trainerId: string,
  spotsAvailable: number,
  level: string,
  room: string,
];

const CLASSES: RawClass[] = [
  ["Heavy Metal", "Strength", "Mon", "06:00", 60, "mara", 4, "L2", "A"],
  ["Engine Room", "HIIT", "Mon", "12:15", 45, "cole", 9, "L2", "B"],
  ["Mobility Reset", "Mobility", "Mon", "18:30", 45, "iris", 12, "L1", "C"],
  ["Bag Work 101", "Boxing", "Mon", "19:30", 60, "dez", 6, "L1", "B"],
  ["Squat Club", "Strength", "Tue", "06:30", 75, "mara", 2, "L3", "A"],
  ["Threshold Ride", "Cycle", "Tue", "07:00", 45, "nia", 5, "L2", "D"],
  ["Slow Flow", "Yoga", "Tue", "17:30", 60, "iris", 14, "L1", "C"],
  ["Metcon 34", "HIIT", "Tue", "18:45", 35, "cole", 0, "L3", "B"],
  ["Press Day", "Strength", "Wed", "06:00", 60, "mara", 7, "L2", "A"],
  ["Sparring Skills", "Boxing", "Wed", "12:00", 60, "dez", 3, "L2", "B"],
  ["Power Hour", "Cycle", "Wed", "18:00", 60, "nia", 8, "L2", "D"],
  ["Yin & Breath", "Yoga", "Wed", "20:00", 60, "iris", 11, "L1", "C"],
  ["Pull Day", "Strength", "Thu", "06:30", 60, "mara", 6, "L2", "A"],
  ["Engine Room", "HIIT", "Thu", "12:15", 45, "cole", 4, "L2", "B"],
  ["Footwork Lab", "Boxing", "Thu", "18:30", 45, "dez", 9, "L1", "B"],
  ["Deep Mobility", "Mobility", "Thu", "19:30", 45, "iris", 13, "L1", "C"],
  ["Total Body", "Strength", "Fri", "06:00", 60, "mara", 5, "L1", "A"],
  ["Sprint Night", "Cycle", "Fri", "17:30", 45, "nia", 1, "L3", "D"],
  ["Fight Fit", "Boxing", "Fri", "18:30", 60, "dez", 7, "L2", "B"],
  ["Saturday Grind", "HIIT", "Sat", "09:00", 60, "cole", 10, "L2", "B"],
  ["Barbell Basics", "Strength", "Sat", "10:30", 75, "mara", 8, "L1", "A"],
  ["Long Ride", "Cycle", "Sat", "08:00", 75, "nia", 6, "L2", "D"],
  ["Recovery Flow", "Yoga", "Sun", "09:30", 60, "iris", 15, "L1", "C"],
  ["Sunday Reset", "Mobility", "Sun", "11:00", 45, "tomas", 12, "L1", "C"],
];

async function main() {
  await prisma.gymClass.deleteMany();
  await prisma.gymClass.createMany({
    data: CLASSES.map((c) => ({
      name: c[0],
      type: c[1],
      day: c[2],
      startTime: c[3],
      durationMin: c[4],
      trainerId: c[5],
      spotsAvailable: c[6],
      level: c[7],
      room: c[8],
    })),
  });
  console.log(`Seeded ${CLASSES.length} classes.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
