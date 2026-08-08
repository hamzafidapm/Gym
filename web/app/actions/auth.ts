"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  planId: string;
  cycle: "monthly" | "annual";
}

// Only creates the account -- the client signs itself in right after via
// next-auth/react's signIn(), same as it would for an existing user. There's
// no email verification step in this setup (no email provider configured),
// so every signup is immediately usable.
export async function signUpAction(input: SignUpInput): Promise<{ error?: string }> {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password) return { error: "Email and password are required." };

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "An account with that email already exists." };

    const passwordHash = await bcrypt.hash(input.password, 10);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone || null,
        planId: input.planId,
        cycle: input.cycle,
      },
    });
    return {};
  } catch (e) {
    console.error("signUpAction failed:", e);
    return { error: "Couldn't reach the server — check your connection and try again." };
  }
}

export interface MeResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  planId: string | null;
  cycle: string;
  memberSince: Date;
}

export async function getMe(): Promise<MeResult | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  try {
    return await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        planId: true,
        cycle: true,
        memberSince: true,
      },
    });
  } catch (e) {
    console.error("getMe failed:", e);
    return null;
  }
}
