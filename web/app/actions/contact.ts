"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ error?: string }> {
  if (!input.name || !input.email || !input.message) {
    return { error: "Fill in every field." };
  }
  try {
    await prisma.contactMessage.create({ data: input });
    return {};
  } catch {
    return { error: "Couldn't send that — try again in a moment." };
  }
}
