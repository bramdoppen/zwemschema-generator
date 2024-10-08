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
  const [trainingDistance, setTrainingDistance] = useState(2000);

  const createPrompt = () => {
    const slagPercentages = {
      schoolslag: schoolslag,
      rugslag: rug,
      borstcrawl: borst,
      vlinderslag: vlinder,
    };

    const slagVerdeling = Object.entries(slagPercentages)
      .filter(([, value]) => value !== "" && value !== "none")
      .map(([slag, value]) => {
        if (slag === "vlinderslag" && value === "light") {
          return `${slag}: 5%`;
        }
        return `${slag} met een intensiteit '${value}'`;
      })
      .join(", ");

    return `Neem de rol aan van professionele zwemcoach en genereer een training met een **totale lengte van exact ${trainingDistance} meter** voor een ${
      skillLevel === "beginner" ? "beginnende" : "gevorderde"
    } zwemmer. De focus van de training ligt op ${
      focusTechnique === "normal"
        ? "algemeen"
        : focusTechnique === "endurance"
        ? `uithoudingsvermogen. Bijpassende oefeningen zijn bijvoorbeeld een pyramide van afstanden (binnen pyramide altijd zelfde slag), langzame, langere afstanden, rustig tempo. Genereer ideeen voor oefeningen bijpassend bij een techniektraining voor ${slagVerdeling}. Wees creatief met de oefeningen en de uitvoering. Geef bij elke oefening een doel en uitvoering. Alleen slagen die genoemd zijn in de slagverdeling mogen voorkomen in de training.`
        : focusTechnique === "speed"
        ? `snelheid. Bijpassende oefeningen zijn bijvoorbeeld: sprinten, korte intervallen met hoog intensiteit, je eigen tijd verbeteren. Genereer ideeen voor oefeningen bijpassend bij een techniektraining voor ${slagVerdeling}. Wees creatief met de oefeningen en de uitvoering. Geef bij elke oefening een doel en uitvoering. Alleen slagen die genoemd zijn in de slagverdeling mogen voorkomen in de training.`
        : `techniek. Genereer ideeen voor oefeningen bijpassend bij een techniektraining voor ${slagVerdeling}. Wees creatief met de oefeningen en de uitvoering. Geef bij elke oefening een doel en uitvoering. Alleen slagen die genoemd zijn in de slagverdeling mogen voorkomen in de training.`
    }. Integreer deze focus in elke oefening van de training.
      
      **Belangrijk**:
      - Zorg ervoor dat de **totale afstand van alle oefeningen samen exact ${trainingDistance} meter is**.
      - Verdeel de afstand logisch over de verschillende onderdelen van de training.
      - Houd rekening met de intensiteit van de slagen bij het opstellen van de training.
      
      **Structuur van de training**:
      1. **Inzwemmen** (suggestie: ongeveer 15-20% van de totale afstand): Korte warming-up oefeningen, passend bij van de focus van de training. Zorg dat alleen de volgende slagen voorkomen in het inzwemmen: (${slagVerdeling}), zonder vlinderslag. ${
      borst !== "none" ? "Start met borstcrawl" : ""
    }
      2. **Kern 1 en Kern 2** (samen ongeveer 60-70% van de totale afstand): Kies oefeningen die passen bij de focus op ${focusTechnique}. ${
      focusTechnique === "technique"
        ? "Geef per oefening een sub-lijst met daarin:<ul><li>Doel: Doel van deze oefening</li><li>Uitvoering: Uitvoering van deze oefening</li></ul>"
        : ""
    }
      3. **Uitzwemmen** (suggestie: ongeveer 10-15% van de totale afstand): Rustige afsluiting met aandacht voor techniek en ontspanning, zonder vlinderslag.
      
      **Slagverdeling**: ${slagVerdeling}. Gebruik **uitsluitend** de in deze verdeling genoemde slagen.
      ${
        schoolslag !== "none" &&
        rug !== "none" &&
        borst !== "none" &&
        vlinder !== "none"
          ? `**Wisselslag**:
      - Optioneel toe te voegen.
      - Wisselslag is minimaal 100 meter en bestaat uit de geselecteerde slagen in de volgorde: 25m vlinder, 25m rug, 25m school, 25m borst.
      - Nooit meer dan 200m wisselslag achter elkaar.
      - Geen wisselslag tijdens het uitzwemmen.`
          : ""
      }
      ${
        vlinder !== "none"
          ? `  **Vlinderslag beperkingen**:
      - Vlinderslag is een zeer intensieve slag en moet minimaal worden gebruikt.
      - Maximaal **100m vlinderslag in totaal per training**, inclusief de vlinderslag in de wisselslag.
      - Gebruik vlinderslag bij voorkeur alleen binnen wisselslag.
      - Geen vlinderslag tijdens het uitzwemmen.`
          : ""
      }
      **Belangrijk**:
      - Gebruik **alleen** de slagen die in de slagverdeling zijn opgenomen. Slagen die niet in de verdeling staan, mogen **niet** in de training voorkomen.
      - Ga uit van een 25m bad, tenzij anders aangegeven.
      - Voeg been- en armenoefeningen toe aan de hoofdtraining, passend bij het niveau van de zwemmer en de focus van de training.
      ${
        additionalFocus
          ? `**De zwemmer heeft aangegeven dat hij/zij extra wil trainen op: ** ${additionalFocus}. Integreer dit in de training.`
          : ""
      }
      **Instructies voor de oefeningen**:
      - Geef bij elke oefening de exacte afstand en de rusttijd (5, 10, 15, 20, 25 of 30 seconden) aan.
      - Zorg ervoor dat de **afstanden van alle oefeningen samen exact ${trainingDistance} meter vormen**.
      - Zorg als professionele zwemcoach voor voldoende variatie in de oefeningen.
      - Pas de moeilijkheidsgraad aan het niveau van de zwemmer aan.
      - Houd rekening met de intensiteit van de slagen bij het bepalen van de rusttijden.
      
      **Voorbeeld van het opstellen van de training**:
      - Bereken de afstanden per onderdeel op basis van de totale afstand.  
      - Controleer na het opstellen van de training of de totale afstand klopt.
      
       `;
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
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= 5000) {
                setTrainingDistance(value);
              }
            }}
            max={5000}
            step={25}
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
            maxLength={150}
          />
        </div>
      </CardContent>
      <CardFooter>
        <GenereerTraining prompt={prompt} />
      </CardFooter>
    </Card>
  );
}
