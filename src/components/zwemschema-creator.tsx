"use client";

import React, { useMemo } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import GenereerTraining from "./genereer-training";

export function ZwemschemaCreatorComponent() {
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [focusTechnique, setFocusTechnique] = useState("normal");
  const [schoolslag, setSchoolslag] = useState("light");
  const [rug, setRug] = useState("light");
  const [borst, setBorst] = useState("light");
  const [vlinder, setVlinder] = useState("light");
  const [additionalFocus, setAdditionalFocus] = useState("");
  const [trainingDistance, setTrainingDistance] = useState("2000");

  const createPrompt = () => {
    const slagPercentages = {
      schoolslag: schoolslag,
      rugslag: rug,
      borstcrawl: borst,
      vlinderslag: vlinder,
    };

    const slagVerdeling = Object.entries(slagPercentages)
      .filter(([, percentage]) => percentage !== "")
      .map(([slag, percentage]) => `${slag}: ${percentage}%`)
      .join(", ");

    return `Genereer als zwemcoach een ${trainingDistance}m training voor een ${
      skillLevel === "beginner" ? "beginnende" : "gevorderde"
    } zwemmer. 
    Focus: ${
      focusTechnique === "normal"
        ? "algemeen"
        : focusTechnique === "endurance"
        ? "uithoudingsvermogen"
        : focusTechnique === "speed"
        ? "snelheid"
        : "techniek"
    }.
    
    Structuur:
    1. INZWEMMEN (5-10 min): Korte oefening (bijv. 200m borst, 100m rug, 100m school of 100m wisselslag).
    2. KERN 1 (20-25 min): ${
      focusTechnique === "normal" ? "Techniek/conditie" : focusTechnique
    } focus, intervallen met rusttijden.
    3. KERN 2 (20-25 min): Afwisseling slagen, intensiteit naar doel.
    4. UITZWEMMEN (5-10 min): Rustige oefening. Tijdens uitzwemmen geen wisselslag of vlinderslag.

    Geef bij een techniek oefening ook beknopt aan hoe je deze moet uitvoeren.
    
    Genereer NOOIT school, borst, rug, vlinder als die niet in de slagverdeling zijn opgenomen.
    Maak optioneel gebruik van wisselslag als de gebruiker ook vlinderslag heeft geselecteerd.
    
    Slagverdeling: ${slagVerdeling}.
    Ga altijd uit van een 25m bad, tenzij anders aangegeven door de gebruiker.
    
    Regels: Max 50m vlinder, wissel min 100m. Gebruik wisselslag waar nodig.
    ${additionalFocus ? `Extra: ${additionalFocus}` : ""}
    Totaal exact ${trainingDistance}m.
    Geef bij elke oefening de exacte afstand en rusttijd in seconden aan.`;
  };

  const prompt = useMemo(
    () => createPrompt(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      skillLevel,
      focusTechnique,
      schoolslag,
      rug,
      borst,
      vlinder,
      additionalFocus,
      trainingDistance,
    ]
  );

  return (
    <Card className="w-full max-w-2xl mx-auto print:max-w-none print:border-none">
      <CardHeader className="print:hidden">
        <CardTitle>Zwemschema Creator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 print:hidden">
        <div className="space-y-2">
          <Label>Vaardigheidsniveau</Label>
          <RadioGroup
            value={skillLevel}
            onValueChange={setSkillLevel}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="beginner" />
              <Label htmlFor="beginner">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pro" id="pro" />
              <Label htmlFor="pro">Gevorderd</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="focus-technique">Focus Techniek</Label>
          <Select value={focusTechnique} onValueChange={setFocusTechnique}>
            <SelectTrigger id="focus-technique">
              <SelectValue placeholder="Selecteer focus techniek" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normaal</SelectItem>
              <SelectItem value="endurance">Uithoudingsvermogen</SelectItem>
              <SelectItem value="speed">Snelheid</SelectItem>
              <SelectItem value="technique">Techniek</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Schoolslag", value: schoolslag, setValue: setSchoolslag },
            { label: "Rugslag", value: rug, setValue: setRug },
            { label: "Borstcrawl", value: borst, setValue: setBorst },
            { label: "Vlinderslag", value: vlinder, setValue: setVlinder },
          ].map((stroke) => (
            <div key={stroke.label} className="space-y-2">
              <Label htmlFor={stroke.label.toLowerCase()}>{stroke.label}</Label>
              <Select value={stroke.value} onValueChange={stroke.setValue}>
                <SelectTrigger id={stroke.label.toLowerCase()}>
                  <SelectValue placeholder={`Selecteer ${stroke.label}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Geen</SelectItem>
                  <SelectItem value="light">Licht</SelectItem>
                  <SelectItem value="medium">Gemiddeld</SelectItem>
                  <SelectItem value="heavy">Intensief</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="training-distance">Trainingsafstand (meters)</Label>
          <input
            type="number"
            id="training-distance"
            placeholder="Voer de gewenste afstand in meters in"
            value={trainingDistance}
            onChange={(e) => setTrainingDistance(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additional-focus">Extra Aandachtspunt</Label>
          <Textarea
            id="additional-focus"
            placeholder="Waar wil je extra op focussen tijdens deze training?"
            value={additionalFocus}
            onChange={(e) => setAdditionalFocus(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <GenereerTraining prompt={prompt} />
      </CardFooter>
    </Card>
  );
}
