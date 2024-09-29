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
          'Titel van de sectie, bijv. "Warming-up", "Hoofdset", "Uitzwemmen"'
        ),
      content: z
        .array(z.string())
        .describe("Lijst van oefeningen of instructies voor deze sectie"),
      distance: z.number().describe("Totale afstand van deze sectie in meters"),
      goal: z
        .string()
        .optional()
        .describe(
          "Een kort, motiverend verhaaltje over het doel van de sectie (max. 50 woorden). Bijvoorbeeld: 'In dit blok word je een keerpunt-koning! Door snelle, explosieve wendingen te oefenen, verbeter je niet alleen je techniek, maar boost je ook je overall snelheid. Elke muur is een kans om je concurrenten te verbazen!'"
        ),
    })
  ),
  totalDistance: z
    .number()
    .describe(
      "Totale afstand van de gegenereerde training. Zorg dat deze afstand exact klopt met de som van alle afstanden van de secties, zelfs als deze niet wordt bereikt door afrondingen."
    ),
  difficulty: z
    .enum(["Licht", "Gemiddeld", "Intensief"])
    .describe("Algemene moeilijkheidsgraad van de training"),
});

export async function generate(prompt: string) {
  try {
    if (await hasReachedLimit()) {
      throw new Error(
        "U heeft de limiet van 10 gegenereerde schema's per dag bereikt."
      );
    }

    await incrementGenerations();

    const stream = createStreamableValue();

    (async () => {
      try {
        const { partialObjectStream } = await streamObject({
          model: openai("gpt-4o"),
          system:
            "Je bent een enthousiaste zwemcoach die gedetailleerde en gepersonaliseerde zwemschema's genereert. Maak een gestructureerd trainingsplan op basis van de input van de gebruiker. Houd rekening met het opgegeven vaardigheidsniveau, focus en gewenste afstand. Gebruik alleen afstanden in meters en geef specifieke rusttijden aan in seconden tussen de oefeningen. Zorg ervoor dat elke sectie van het schema (inzwemmen, kernsets, uitzwemmen) duidelijk is gedefinieerd met passende oefeningen en intensiteit. Pas de moeilijkheidsgraad en variatie aan op basis van het niveau van de zwemmer. Het totaal van de individuele onderdelen moet exact de trainingDistance zijn. Voor de 'goal' van elke sectie, schrijf een kort, motiverend verhaaltje (max. 50 woorden) dat de zwemmer enthousiast maakt voor de oefening en het doel ervan uitlegt.",
          prompt: prompt,
          schema: workoutSchema,
          maxTokens: 800,
        });

        for await (const partialObject of partialObjectStream) {
          stream.update(partialObject);
        }

        stream.done();
      } catch (error) {
        console.error("Fout tijdens het streamen van object:", error);
        stream.error(error);
      }
    })();

    return { workout: stream.value };
  } catch (error) {
    console.error("Fout in generate functie:", error);
    throw error;
  }
}
