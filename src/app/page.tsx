export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { ZwemschemaCreatorComponent } from "@/components/zwemschema-creator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-500 p-4 text-white mb-6 sm:text-center">
        <h1 className="text-2xl font-bold">Zwemschema Creator</h1>
      </header>

      <main className="flex-grow px-0 mb-6 sm:px-4">
        <ZwemschemaCreatorComponent />
        <p className="text-sm text-center text-gray-500 mt-4 print:hidden">
          Deze applicatie maakt gebruik van OpenAI met model GPT-4o. Je mag
          maximaal 10 workouts per dag genereren.
        </p>
      </main>

      <footer className="bg-gray-200 p-4 text-center mt-auto print:hidden">
        <p>
          Gemaakt door{" "}
          <a href="https://bram.onl" className="text-blue-500 hover:underline">
            bram.onl
          </a>
        </p>
      </footer>
      <footer className="print:block hidden p-4 text-center mt-4">
        <p>
          Deze training is gemaakt met AI - Powered by{" "}
          <a href="https://bram.onl" className="text-blue-500 hover:underline">
            bram.onl
          </a>
        </p>
      </footer>
    </div>
  );
}
