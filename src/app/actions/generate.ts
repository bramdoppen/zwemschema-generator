"use server";

import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";
import { incrementGenerations, hasReachedLimit } from "@/lib/userLimits";

const workoutSchema = z.object({
  sections: z.array(
    z.object({
      title: z
        .string()
        .describe(
          'Titel van de sectie, bijv. "Warming-up", "Hoofdset 1", "Hoofdset 2", "Uitzwemmen"'
        ),
      content: z
        .array(z.string())
        .describe("Lijst van oefeningen of instructies voor deze sectie"),
      distance: z.number().describe("Totale afstand van deze sectie in meters"),
    })
  ),
  totalDistance: z
    .number()
    .describe("Totale afstand van de training in meters"),
  difficulty: z
    .enum(["Licht", "Gemiddeld", "Intensief"])
    .describe("Algemene moeilijkheidsgraad van de training"),
});

export async function generate(prompt: string) {
  if (await hasReachedLimit()) {
    throw new Error(
      "U heeft de limiet van 30 gegenereerde schema's per dag bereikt."
    );
  }

  await incrementGenerations();

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai("gpt-4o-mini"),
      system:
        "Je bent een ervaren zwemcoach die gedetailleerde en gepersonaliseerde zwemschema's genereert. Maak een gestructureerd trainingsplan op basis van de input van de gebruiker. Houd rekening met het opgegeven vaardigheidsniveau, focus en gewenste afstand. Gebruik alleen afstanden in meters en geef specifieke rusttijden aan in seconden tussen de oefeningen. Zorg ervoor dat elke sectie van het schema (inzwemmen, kernsets, uitzwemmen) duidelijk is gedefinieerd met passende oefeningen en intensiteit. Pas de moeilijkheidsgraad en variatie aan op basis van het niveau van de zwemmer.",
      prompt: prompt,
      schema: workoutSchema,
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { workout: stream.value };
}
