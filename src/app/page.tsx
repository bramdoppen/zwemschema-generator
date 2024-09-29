import { ZwemschemaCreatorComponent } from "@/components/zwemschema-creator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-500 p-4 text-white mb-6">
        <h1 className="text-2xl font-bold">Zwemschema Creator</h1>
      </header>

      <main className="flex-grow px-4 mb-6">
        <ZwemschemaCreatorComponent />
        <p className="text-sm text-center text-gray-500 mt-4">
          Deze applicatie maakt gebruik van OpenAI met model GPT-4o.
        </p>
      </main>

      <footer className="bg-gray-200 p-4 text-center mt-auto">
        <p>Gemaakt door bram.onl</p>
      </footer>
    </div>
  );
}
