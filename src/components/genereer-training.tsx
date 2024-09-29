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
}

interface Workout {
  sections: WorkoutSection[];
  totalDistance: number;
  difficulty: "Licht" | "Gemiddeld" | "Intensief";
}

export default function GenereerTraining({ prompt }: { prompt: string }) {
  const [workout, setWorkout] = useState<Partial<Workout>>({});
  const [error, setError] = useState<string | null>(null);

  const handleGenerateWorkout = async () => {
    try {
      setError(null);
      const { workout } = await generate(prompt);

      for await (const partialWorkout of readStreamableValue(workout)) {
        setWorkout(partialWorkout);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Er is een onbekende fout opgetreden.");
      }
    }
  };

  return (
    <div>
      <Button
        className="w-full print:hidden"
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
        disabled={!!error}
      >
        Genereer training
      </Button>
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <p className="mt-4">
        {workout.difficulty && (
          <span>Niveau workout: {workout.difficulty}</span>
        )}
        {workout.totalDistance && (
          <span>Totale afstand: {workout.totalDistance} meter</span>
        )}
      </p>

      <div className="mt-4 space-y-4">
        {workout.sections?.map((section, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-md p-4 print:bg-gray-100"
          >
            <h3 className="font-bold mb-2">{section.title}</h3>
            <p>Afstand: {section.distance} meters</p>
            <ul className="list-disc pl-5 mt-2">
              {section.content?.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
