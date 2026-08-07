"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "./supabase/client";
import type { Database } from "./supabase/types";
import type { Booking, Day, GymClass } from "./types";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

function friendlyAuthError(message: string): string {
  return /failed to fetch|networkerror|load failed/i.test(message)
    ? "Couldn't reach the server — check your connection and try again."
    : message;
}

interface RawBookingRow {
  id: string;
  class_id: string;
  classes: {
    name: string;
    day: string;
    start_time: string;
    duration_min: number;
    room: string;
    trainers: { name: string } | null;
  } | null;
}

function mapBookings(rows: RawBookingRow[] | null | undefined): Booking[] {
  return (rows ?? [])
    .filter((r): r is RawBookingRow & { classes: NonNullable<RawBookingRow["classes"]> } =>
      Boolean(r.classes),
    )
    .map((r) => ({
      id: r.id,
      classId: r.class_id,
      name: r.classes.name,
      day: r.classes.day as Day,
      time: r.classes.start_time.slice(0, 5),
      dur: r.classes.duration_min + " min",
      trainer: r.classes.trainers?.name ?? "",
      room: r.classes.room,
    }));
}

interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  planId: string;
  cycle: "monthly" | "annual";
}

interface AppState {
  // auth / session
  user: User | null;
  member: MemberRow | null;
  authLoading: boolean;
  signUp: (input: SignUpInput) => Promise<{ error?: string; needsEmailConfirmation: boolean }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;

  // bookings
  bookings: Booking[];
  bookingsLoading: boolean;
  book: (c: GymClass) => Promise<boolean>;
  cancel: (bookingId: string) => Promise<void>;
  isBooked: (classId: string) => boolean;

  // pricing toggle
  annual: boolean;
  setAnnual: (v: boolean) => void;

  // toast
  toast: string | null;
  flash: (msg: string) => void;
}

const AppStateCtx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [member, setMember] = useState<MemberRow | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const refreshMemberAndBookings = useCallback(async (uid: string) => {
    setBookingsLoading(true);
    const [memberRes, bookingsRes] = await Promise.all([
      supabase.from("members").select("*").eq("id", uid).single(),
      supabase
        .from("bookings")
        .select(
          "id, class_id, classes(name, day, start_time, duration_min, room, trainers(name))",
        )
        .eq("member_id", uid)
        .eq("status", "booked"),
    ]);
    setMember((memberRes.data as MemberRow | null) ?? null);
    setBookings(mapBookings(bookingsRes.data as unknown as RawBookingRow[] | null));
    setBookingsLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    // onAuthStateChange fires once immediately with the current session on
    // subscribe, then again on every sign-in/out -- so member/booking
    // refresh lives here (a subscription callback) rather than in a
    // separate effect keyed on `user`, keeping every setState call here
    // inside a callback instead of an effect body's synchronous top level.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) {
        refreshMemberAndBookings(session.user.id);
      } else {
        setMember(null);
        setBookings([]);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [refreshMemberAndBookings]);

  const isBooked = useCallback(
    (classId: string) => bookings.some((b) => b.classId === classId),
    [bookings],
  );

  const book = useCallback(
    async (c: GymClass): Promise<boolean> => {
      if (!user) {
        flash("Sign in or join to book a class.");
        return false;
      }
      if (c.spots <= 0) {
        flash("That session is full — join the waitlist at the desk.");
        return false;
      }
      if (isBooked(c.id)) {
        flash("Already on your schedule.");
        return false;
      }
      const { error } = await supabase.rpc("book_class", { p_class_id: c.id });
      if (error) {
        flash(
          error.message.includes("full")
            ? "That session is full — join the waitlist at the desk."
            : error.message.includes("Already booked")
              ? "Already on your schedule."
              : "Could not book that class.",
        );
        return false;
      }
      flash("Booked — " + c.name + ", " + c.day + " " + c.time);
      await refreshMemberAndBookings(user.id);
      return true;
    },
    [user, isBooked, flash, refreshMemberAndBookings],
  );

  const cancel = useCallback(
    async (bookingId: string) => {
      if (!user) return;
      const { error } = await supabase.rpc("cancel_booking", { p_booking_id: bookingId });
      if (error) {
        flash("Could not cancel that class.");
        return;
      }
      flash("Class cancelled. No charge.");
      await refreshMemberAndBookings(user.id);
    },
    [user, flash, refreshMemberAndBookings],
  );

  const signUp = useCallback(async (input: SignUpInput) => {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          first_name: input.firstName,
          last_name: input.lastName,
          phone: input.phone,
          plan_id: input.planId,
          cycle: input.cycle,
        },
      },
    });
    if (error) return { error: friendlyAuthError(error.message), needsEmailConfirmation: false };
    return { needsEmailConfirmation: !data.session };
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: friendlyAuthError(error.message) };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      user,
      member,
      authLoading,
      signUp,
      signInWithPassword,
      signOut,
      bookings,
      bookingsLoading,
      book,
      cancel,
      isBooked,
      annual,
      setAnnual,
      toast,
      flash,
    }),
    [
      user,
      member,
      authLoading,
      signUp,
      signInWithPassword,
      signOut,
      bookings,
      bookingsLoading,
      book,
      cancel,
      isBooked,
      annual,
      toast,
      flash,
    ],
  );

  return <AppStateCtx.Provider value={value}>{children}</AppStateCtx.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
