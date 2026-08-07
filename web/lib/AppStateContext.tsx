"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Booking, GymClass } from "./types";
import { trainerById } from "./data";

const INITIAL_BOOKINGS: Booking[] = [
  {
    key: "b1",
    name: "Squat Club",
    day: "Tue",
    time: "06:30",
    dur: "75 min",
    trainer: "Mara Vance",
    room: "A",
  },
  {
    key: "b2",
    name: "Engine Room",
    day: "Thu",
    time: "12:15",
    dur: "45 min",
    trainer: "Cole Rivas",
    room: "B",
  },
];

interface AppState {
  bookings: Booking[];
  book: (c: GymClass) => boolean;
  cancel: (key: string) => void;
  isBooked: (key: string) => boolean;
  annual: boolean;
  setAnnual: (v: boolean) => void;
  toast: string | null;
  flash: (msg: string) => void;
}

const AppStateCtx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [annual, setAnnual] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const isBooked = useCallback(
    (key: string) => bookings.some((b) => b.key === key),
    [bookings],
  );

  const book = useCallback(
    (c: GymClass): boolean => {
      if (c.spots <= 0) {
        flash("That session is full — join the waitlist at the desk.");
        return false;
      }
      if (bookings.some((b) => b.key === c.key)) {
        flash("Already on your schedule.");
        return false;
      }
      const t = trainerById(c.trainerId);
      setBookings((bs) => [
        ...bs,
        {
          key: c.key,
          name: c.name,
          day: c.day,
          time: c.time,
          dur: c.durMin + " min",
          trainer: t?.name ?? "",
          room: c.room,
        },
      ]);
      flash("Booked — " + c.name + ", " + c.day + " " + c.time);
      return true;
    },
    [bookings, flash],
  );

  const cancel = useCallback(
    (key: string) => {
      setBookings((bs) => bs.filter((b) => b.key !== key));
      flash("Class cancelled. No charge.");
    },
    [flash],
  );

  const value = useMemo(
    () => ({ bookings, book, cancel, isBooked, annual, setAnnual, toast, flash }),
    [bookings, book, cancel, isBooked, annual, toast, flash],
  );

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
