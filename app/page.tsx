import Image from "next/image";
import { Words } from "./components/words/Words";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Words />
      <div>Developed by <a href="https://www.danielhearn.co.uk">Daniel Hearn</a></div>
    </main>
  );
}
