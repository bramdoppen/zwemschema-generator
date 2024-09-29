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
    throw new Error("U heeft de limiet van 20 gegenereerde schema's bereikt.");
  }

  await incrementGenerations();

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai("gpt-4o"),
      system:
        "Je genereert een gestructureerd zwemschema op basis van de input van de gebruiker. Gebruik alleen afstanden in meters en geef rusttijden aan tussen de oefeningen.",
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
