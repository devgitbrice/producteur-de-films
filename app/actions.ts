"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

// Configuration manuelle pour utiliser votre variable GEMINI_API_KEY
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateFilmPlanAction(synopsis: string) {
  // On utilise Gemini 3 Pro Preview pour la meilleure qualité créative
  const model = google("gemini-3-pro-preview");

  const schema = z.object({
    characters: z.array(
      z.object({
        name: z.string().describe("Nom du personnage"),
        role: z.string().describe("Rôle (ex: Protagoniste, Antagoniste)"),
        desc: z.string().describe("Description courte, psychologie et apparence"),
      })
    ).describe("Liste des 3 à 5 personnages principaux"),
    storytelling: z.string().describe("Résumé de l'arc narratif, du ton et des enjeux dramatiques"),
    scriptPlan: z.array(z.string()).describe("Séquencier du film en 5 à 10 scènes clés numérotées"),
  });

  const result = await generateObject({
    model: model,
    schema: schema,
    prompt: `Tu es un producteur et scénariste de cinéma primé. 
    Ton objectif est de transformer ce synopsis brut en un plan de film structuré et captivant.
    
    SYNOPSIS : "${synopsis}"
    
    Génère des personnages profonds et un arc narratif cohérent. Réponds uniquement en Français.`,
  });

  return result.object;
}