"use client";

import {
  SessionProvider,
  signIn as clientSignIn,
  signOut as clientSignOut,
  useSession,
} from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getMe, signUpAction, type MeResult, type SignUpInput } from "@/app/actions/auth";
import { bookClass, cancelBooking, getMyBookings, type BookingResult } from "@/app/actions/classes";
import type { Booking, GymClass } from "./types";

function toBooking(b: BookingResult): Booking {
  return {
    id: b.id,
    classId: b.classId,
    name: b.name,
    day: b.day as Booking["day"],
    time: b.time,
    dur: b.dur,
    trainerId: b.trainerId,
    room: b.room,
  };
}

interface AppState {
  // auth / session
  authenticated: boolean;
  member: MeResult | null;
  authLoading: boolean;
  signUp: (input: SignUpInput) => Promise<{ error?: string }>;
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

function AppStateInner({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const authenticated = status === "authenticated";
  const authLoading = status === "loading";

  const [member, setMember] = useState<MeResult | null>(null);
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

  const refreshMemberAndBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const [me, myBookings] = await Promise.all([getMe(), getMyBookings()]);
      setMember(me);
      setBookings(myBookings.map(toBooking));
    } catch {
      // getMe/getMyBookings already degrade to null/[] on failure -- this is
      // just a safety net so a stuck loading state is never possible here.
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Reacting to next-auth's session status, not a subscription we control
    // the callback shape of -- same one-shot-sync pattern as useClasses.
    if (authenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      refreshMemberAndBookings();
    } else if (status === "unauthenticated") {
      setMember(null);
      setBookings([]);
    }
  }, [authenticated, status, refreshMemberAndBookings]);

  const isBooked = useCallback(
    (classId: string) => bookings.some((b) => b.classId === classId),
    [bookings],
  );

  const book = useCallback(
    async (c: GymClass): Promise<boolean> => {
      if (!authenticated) {
        flash("Sign in or join to book a class.");
        return false;
      }
      if (isBooked(c.id)) {
        flash("Already on your schedule.");
        return false;
      }
      const { error } = await bookClass(c.id);
      if (error) {
        flash(
          error === "Class is full"
            ? "That session is full — join the waitlist at the desk."
            : error === "Already booked"
              ? "Already on your schedule."
              : "Could not book that class.",
        );
        return false;
      }
      flash("Booked — " + c.name + ", " + c.day + " " + c.time);
      await refreshMemberAndBookings();
      return true;
    },
    [authenticated, isBooked, flash, refreshMemberAndBookings],
  );

  const cancel = useCallback(
    async (bookingId: string) => {
      const { error } = await cancelBooking(bookingId);
      if (error) {
        flash("Could not cancel that class.");
        return;
      }
      flash("Class cancelled. No charge.");
      await refreshMemberAndBookings();
    },
    [flash, refreshMemberAndBookings],
  );

  const signUp = useCallback(async (input: SignUpInput) => {
    const { error } = await signUpAction(input);
    if (error) return { error };
    const result = await clientSignIn("credentials", {
      email: input.email,
      password: input.password,
      redirect: false,
    });
    if (result?.error) return { error: "Account created — sign in from My Account." };
    return {};
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    const result = await clientSignIn("credentials", { email, password, redirect: false });
    if (result?.error) return { error: "That email/password combination doesn't match." };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await clientSignOut({ redirect: false });
  }, []);

  const value = useMemo<AppState>(
    () => ({
      authenticated,
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
      authenticated,
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

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppStateInner>{children}</AppStateInner>
    </SessionProvider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
