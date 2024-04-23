import Image from "next/image";
import { Words } from "./components/words/Words";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl">Prompt Generator</h1>
        <h2 className="text-l">Generate prompts for creative usage such as drawing, 3D modeling or AI</h2>
      </div>
      <Words />
      <div>Developed by <a href="https://www.danielhearn.co.uk">Daniel Hearn</a></div>
    </main>
  );
}
