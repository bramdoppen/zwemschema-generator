"use server";

import { cookies } from "next/headers";

const MAX_GENERATIONS = 30;
const COOKIE_NAME = "schema_generations";

export async function incrementGenerations(): Promise<number> {
  const cookieStore = cookies();
  const current = parseInt(cookieStore.get(COOKIE_NAME)?.value || "0", 10);
  console.log(`Current cookie value: ${cookieStore.get(COOKIE_NAME)?.value}`);
  const newCount = current + 1;

  console.log(`Huidig generatie aantal: ${current}`);
  console.log(`Nieuw generatie aantal: ${newCount}`);

  cookies().set({
    name: COOKIE_NAME,
    value: newCount.toString(),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 24 uur in seconden
  });

  // Note: De volgende lijn zal niet de bijgewerkte cookie weergeven
  const updatedCookie = cookieStore.get(COOKIE_NAME);
  console.log(`Updated cookie: ${updatedCookie?.value}`);

  return newCount;
}

export async function getGenerationsCount(): Promise<number> {
  const cookieStore = cookies();
  return parseInt(cookieStore.get(COOKIE_NAME)?.value || "0", 10);
}

export async function hasReachedLimit(): Promise<boolean> {
  console.log("hasReachedLimit", await getGenerationsCount());
  return (await getGenerationsCount()) >= MAX_GENERATIONS;
}
