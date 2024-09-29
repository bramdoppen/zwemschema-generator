"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { generate } from "@/app/actions/generate";
import { Button } from "./ui/button";
import { track } from "@vercel/analytics/react";

interface WorkoutSection {
  title: string;
  content: string[];
  distance: number;
  goal?: string;
}

interface Workout {
  sections: WorkoutSection[];
  totalDistance: number;
  difficulty: "Licht" | "Gemiddeld" | "Intensief";
}

export default function GenereerTraining({ prompt }: { prompt: string }) {
  const [workout, setWorkout] = useState<Partial<Workout>>({});
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWorkout = async () => {
    setIsGenerating(true);
    setError(null);
    setWorkout({});

    try {
      const { workout } = await generate(prompt);

      for await (const partialWorkout of readStreamableValue(workout)) {
        setWorkout(partialWorkout);
      }
    } catch (e) {
      console.error("Fout bij het genereren van de training:", e);
      if (e instanceof Error) {
        setError(e.message);
      } else if (typeof e === "string") {
        setError(e);
      } else {
        setError(
          "Er is een onbekende fout opgetreden bij het genereren van de training."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <Button
        className="w-full print:hidden plausible-event-name=GenerateTraining+Click"
        onClick={() => {
          track("GenereerTraining", {
            userAgent: navigator.userAgent,
            promptLengte: prompt.length,
            schermBreedte: window.innerWidth,
            schermHoogte: window.innerHeight,
            taal: navigator.language,
            tijdstip: new Date().toISOString(),
          });
          handleGenerateWorkout();
        }}
        disabled={isGenerating}
      >
        {isGenerating ? "Bezig met genereren..." : "Genereer training"}
      </Button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Fout:</p>
          <p>
            Er kan geen training worden gegenereerd. Probeer het later opnieuw.
            Je mag 10 trainingen per dag genereren. Mogelijk is dat aantal
            overschreven.
          </p>
        </div>
      )}

      {workout.difficulty || workout.totalDistance ? (
        <p className="mt-4">
          {workout.difficulty && (
            <span>Niveau workout: {workout.difficulty}</span>
          )}
          {" | "}
          {workout.totalDistance && (
            <span>Totale afstand: {workout.totalDistance}m</span>
          )}
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {workout.sections?.map((section, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-md p-4 print:bg-gray-100"
          >
            <h3 className="font-bold mb-2 flex justify-between">
              {section.title}
              <span className="text-sm text-gray-600">
                {" "}
                Afstand: {section.distance}m
              </span>
            </h3>

            {section.goal && (
              <p className="text-sm text-gray-600">Doel: {section.goal}</p>
            )}
            <ul className="list-disc pl-5 mt-2">
              {section.content?.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        {workout?.sections && workout.sections.length > 0 && (
          <div className="mt-4 flex justify-center print:hidden">
            <Button
              onClick={() => window.print()}
              className="bg-blue-500 text-white p-2 rounded plausible-event-name=PrintTraining+Click"
            >
              Print de training
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
