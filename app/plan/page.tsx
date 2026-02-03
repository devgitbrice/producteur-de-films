"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// Composant qui lit les paramètres de recherche (le synopsis)
function PlanContent() {
  const searchParams = useSearchParams();
  const synopsis = searchParams.get("synopsis");

  // Données simulées (Mock) en attendant l'intégration API
  const [data] = useState({
    characters: [
      { name: "Alex", role: "Protagoniste", desc: "Un jeune réalisateur ambitieux qui cherche l'inspiration dans les rues de Paris." },
      { name: "Léna", role: "Antagoniste", desc: "Une critique de cinéma impitoyable qui détient le pouvoir de lancer ou briser une carrière." },
      { name: "Marc", role: "Soutien", desc: "Le meilleur ami fidèle, technicien lumière, toujours pragmatique." }
    ],
    storytelling: "C'est l'histoire d'une confrontation entre l'art pur et la réalité commerciale. Alex découvre un vieux manuscrit qui pourrait changer l'histoire du cinéma, mais Léna fera tout pour que ce secret reste enfoui. Une course contre la montre s'engage à travers les quartiers historiques...",
    scriptPlan: [
      "1. INT. CHAMBRE ALEX - JOUR : Alex découvre le manuscrit caché dans une brocante.",
      "2. EXT. CAFÉ PARISIEN - JOUR : Il en parle à Marc, qui est sceptique.",
      "3. INT. BUREAU LÉNA - SOIR : Léna apprend l'existence du manuscrit.",
      "4. EXT. RUES DE NUIT - NUIT : Alex se sent suivi."
    ]
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="mx-auto max-w-4xl space-y-12 py-10">
        
        {/* En-tête avec rappel du synopsis */}
        <header className="space-y-4 text-center sm:text-left">
          <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Généré avec Gemini 3 Pro
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Plan du Film</h1>
          <div className="rounded-xl bg-white p-4 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 uppercase font-bold tracking-wider mb-2">Votre Synopsis</p>
            <p className="italic text-zinc-600 dark:text-zinc-300">"{synopsis}"</p>
          </div>
        </header>

        {/* Section 1 : Personnages */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-zinc-200 pb-2 dark:border-zinc-800">Personnages Principaux</h2>
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
          <h2 className="text-2xl font-bold border-b border-zinc-200 pb-2 dark:border-zinc-800">Séquencier (Plan de Script)</h2>
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

// Composant principal qui enveloppe le contenu dans une Suspense boundary (requis par Next.js pour useSearchParams)
export default function PlanPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Chargement...</div>}>
      <PlanContent />
    </Suspense>
  );
}