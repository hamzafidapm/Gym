"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export interface ClassResult {
  id: string;
  name: string;
  type: string;
  day: string;
  time: string;
  durMin: number;
  trainerId: string;
  spots: number;
  level: string;
  room: string;
}

export async function getClasses(): Promise<ClassResult[]> {
  let classes;
  try {
    classes = await prisma.gymClass.findMany();
  } catch (e) {
    console.error("getClasses failed:", e);
    throw new Error("Couldn't reach the server — check your connection and try again.");
  }
  return classes
    .map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      day: c.day,
      time: c.startTime,
      durMin: c.durationMin,
      trainerId: c.trainerId,
      spots: c.spotsAvailable,
      level: c.level,
      room: c.room,
    }))
    .sort((a, b) => {
      const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
      return dayDiff !== 0 ? dayDiff : a.time.localeCompare(b.time);
    });
}

export interface BookingResult {
  id: string;
  classId: string;
  name: string;
  day: string;
  time: string;
  dur: string;
  trainerId: string;
  room: string;
}

export async function getMyBookings(): Promise<BookingResult[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  let bookings;
  try {
    bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: { gymClass: true },
      orderBy: { bookedAt: "desc" },
    });
  } catch (e) {
    console.error("getMyBookings failed:", e);
    return [];
  }
  return bookings.map((b) => ({
    id: b.id,
    classId: b.classId,
    name: b.gymClass.name,
    day: b.gymClass.day,
    time: b.gymClass.startTime,
    dur: b.gymClass.durationMin + " min",
    trainerId: b.gymClass.trainerId,
    room: b.gymClass.room,
  }));
}

export async function bookClass(classId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sign in or join to book a class." };
  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.gymClass.updateMany({
        where: { id: classId, spotsAvailable: { gt: 0 } },
        data: { spotsAvailable: { decrement: 1 } },
      });
      if (updated.count === 0) {
        const exists = await tx.gymClass.findUnique({ where: { id: classId } });
        throw new Error(exists ? "Class is full" : "Class not found");
      }
      try {
        await tx.booking.create({ data: { userId, classId } });
      } catch {
        throw new Error("Already booked");
      }
    });
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not book that class." };
  }
}

export async function cancelBooking(bookingId: string): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not signed in." };
  const userId = session.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking || booking.userId !== userId) throw new Error("Booking not found");
      await tx.booking.delete({ where: { id: bookingId } });
      await tx.gymClass.update({
        where: { id: booking.classId },
        data: { spotsAvailable: { increment: 1 } },
      });
    });
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not cancel that class." };
  }
}
