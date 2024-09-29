"use server";

import { cookies } from "next/headers";

const MAX_GENERATIONS = 30;
const COOKIE_NAME = "schema_generations";

export async function incrementGenerations(): Promise<number> {
  const cookieStore = cookies();
  const current = parseInt(cookieStore.get(COOKIE_NAME)?.value || "0", 10);
  const newCount = current + 1;

  cookies().set({
    name: COOKIE_NAME,
    value: newCount.toString(),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 24 uur in seconden
  });

  return newCount;
}

export async function getGenerationsCount(): Promise<number> {
  const cookieStore = cookies();
  return parseInt(cookieStore.get(COOKIE_NAME)?.value || "0", 10);
}

export async function hasReachedLimit(): Promise<boolean> {
  return (await getGenerationsCount()) >= MAX_GENERATIONS;
}
