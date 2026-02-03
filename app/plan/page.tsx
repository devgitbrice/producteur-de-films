"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { generateFilmPlanAction } from "../actions"; // Import de l'action serveur

// Définition du type des données attendues
type FilmData = {
  characters: { name: string; role: string; desc: string }[];
  storytelling: string;
  scriptPlan: string[];
};

function PlanContent() {
  const searchParams = useSearchParams();
  const synopsis = searchParams.get("synopsis");

  const [data, setData] = useState<FilmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!synopsis) return;

    // C'est ici que la magie opère : on appelle l'IA
    const fetchData = async () => {
      try {
        setLoading(true);
        // Appel à la fonction définie dans actions.ts
        const result = await generateFilmPlanAction(synopsis);
        setData(result);
      } catch (err) {
        console.error("Erreur lors de la génération :", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [synopsis]);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-zinc-50 dark:bg-black text-black dark:text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white"></div>
        <p className="animate-pulse text-lg font-medium">Gemini 3 Pro Preview écrit votre scénario...</p>
      </div>
    );
  }

  // Gestion d'erreur
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black text-red-500">
        Une erreur est survenue lors de la génération. Vérifiez votre clé API.
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="mx-auto max-w-4xl space-y-12 py-10">
        
        {/* En-tête */}
        <header className="space-y-4 text-center sm:text-left">
          <div className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
            Généré avec Gemini 3 Pro Preview
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Plan du Film</h1>
          <div className="rounded-xl bg-white p-4 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 uppercase font-bold tracking-wider mb-2">Votre Synopsis</p>
            <p className="italic text-zinc-600 dark:text-zinc-300">"{synopsis}"</p>
          </div>
        </header>

        {/* Section 1 : Personnages */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-zinc-200 pb-2 dark:border-zinc-800">Casting Principal</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.characters.map((char, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {char.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none">{char.name}</h3>
                    <span className="text-xs font-semibold uppercase text-zinc-400">{char.role}</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{char.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 : Storytelling */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-zinc-200 pb-2 dark:border-zinc-800">Storytelling & Arc Narratif</h2>
          <div className="rounded-2xl bg-zinc-100 p-8 dark:bg-zinc-900/50 border border-transparent dark:border-zinc-800">
            <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              {data.storytelling}
            </p>
          </div>
        </section>

        {/* Section 3 : Plan de Script */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-zinc-200 pb-2 dark:border-zinc-800">Séquencier</h2>
          <ul className="space-y-4">
            {data.scriptPlan.map((scene, i) => (
              <li key={i} className="group flex items-start gap-4 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black font-bold text-white dark:bg-white dark:text-black">
                  {i + 1}
                </span>
                <span className="pt-1 font-mono text-zinc-800 dark:text-zinc-200">{scene}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Chargement...</div>}>
      <PlanContent />
    </Suspense>
  );
}