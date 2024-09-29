"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { generate } from "@/app/actions/generate";
import { Button } from "./ui/button";

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

  return (
    <div>
      <Button
        className="w-full"
        onClick={async () => {
          const { workout } = await generate(prompt);

          for await (const partialWorkout of readStreamableValue(workout)) {
            setWorkout(partialWorkout);
          }
        }}
      >
        Genereer training
      </Button>

      {workout.difficulty && (
        <p className="mt-4">Moeilijkheidsgraad: {workout.difficulty}</p>
      )}
      {workout.totalDistance && (
        <p>Totale duur: {workout.totalDistance} minuten</p>
      )}

      <div className="mt-4 space-y-4">
        {workout.sections?.map((section, index) => (
          <div key={index} className="bg-gray-100 rounded-md p-4">
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
