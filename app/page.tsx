"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [synopsis, setSynopsis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!synopsis) return;
    setIsLoading(true);
    
    // Simulation d'un petit délai pour l'effet "IA qui réfléchit"
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // On navigue vers la page de plan en passant le synopsis dans l'URL
    router.push(`/plan?synopsis=${encodeURIComponent(synopsis)}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-black transition-colors">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold text-black dark:text-white sm:text-6xl">
          Prêt pour faire son film ?
        </h1>
        
        <div className="space-y-4">
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Décrivez votre idée de film en quelques lignes..."
              className="w-full min-h-[160px] rounded-2xl border border-zinc-200 bg-white p-5 text-lg text-zinc-800 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white resize-none"
            />
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || !synopsis}
              className="w-full rounded-full bg-black px-8 py-4 text-xl font-medium text-white transition-all hover:bg-zinc-800 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isLoading ? "Génération en cours..." : "Générer un plan de film avec de l'IA (Gemini 3 pro)"}
            </button>
        </div>
      </div>
    </div>
  );
}