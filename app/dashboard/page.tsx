"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/lib/supabase-browser";
import {
  createProject,
  getProject,
  updateProject,
  type Project,
  type ProjectType,
} from "../actions-projects";
import { generateFilmPlanAction } from "../actions";

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: "court métrage", label: "Court métrage" },
  { value: "clip vidéo", label: "Clip vidéo" },
  { value: "web série", label: "Web série" },
  { value: "documentaire", label: "Documentaire" },
  { value: "publicité", label: "Publicité" },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [synopsis, setSynopsis] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("court métrage");
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarKey, setSidebarKey] = useState(0);
  const supabase = createClient();

  const selectProject = useCallback(async (id: string) => {
    try {
      const project = await getProject(id);
      setCurrentProject(project);
      setSynopsis(project.synopsis || "");
      setProjectType(project.project_type);
      setTitle(project.title);
      setSidebarOpen(false);
    } catch (err) {
      console.error("Erreur chargement projet:", err);
    }
  }, []);

  const handleNewProject = async () => {
    try {
      const project = await createProject("court métrage");
      setCurrentProject(project);
      setSynopsis("");
      setProjectType("court métrage");
      setTitle("Nouveau projet");
      setSidebarKey((k) => k + 1);
      setSidebarOpen(false);
    } catch (err) {
      console.error("Erreur création projet:", err);
    }
  };

  const handleGenerate = async () => {
    if (!synopsis || !currentProject) return;
    setIsGenerating(true);

    try {
      // Save synopsis and title first
      await updateProject(currentProject.id, {
        synopsis,
        title: title || "Sans titre",
        project_type: projectType,
      });

      // Generate with AI
      const plan = await generateFilmPlanAction(synopsis);

      // Save generated plan
      const updated = await updateProject(currentProject.id, {
        generated_plan: plan,
      });

      setCurrentProject(updated);
      setSidebarKey((k) => k + 1);
    } catch (err) {
      console.error("Erreur génération:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!currentProject) return;
    try {
      const updated = await updateProject(currentProject.id, {
        synopsis,
        title: title || "Sans titre",
        project_type: projectType,
      });
      setCurrentProject(updated);
      setSidebarKey((k) => k + 1);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
    }
  };

  const plan = currentProject?.generated_plan;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar
        key={sidebarKey}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentProjectId={currentProject?.id || null}
        onSelectProject={selectProject}
        onNewProject={handleNewProject}
      />

      {/* Main content */}
      <main className="min-h-screen transition-all duration-200 px-4 py-6 pt-16">
        <div className="mx-auto max-w-3xl">
          {!currentProject ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
              <h1 className="text-4xl font-bold text-black dark:text-white">
                Producteur de Films
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                Sélectionnez un projet dans la barre latérale ou créez-en un
                nouveau pour commencer.
              </p>
              <button
                onClick={handleNewProject}
                className="rounded-full bg-black px-8 py-3 text-lg font-medium text-white hover:bg-zinc-800 active:scale-[0.98] transition-all dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Nouveau projet
              </button>
            </div>
          ) : (
            /* Project editor */
            <div className="space-y-8">
              {/* Project header */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleSave}
                  placeholder="Titre du projet"
                  className="w-full text-3xl font-bold bg-transparent border-none outline-none text-black dark:text-white placeholder-zinc-300 dark:placeholder-zinc-700"
                />

                {/* Project type selector */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Type :
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => {
                      setProjectType(e.target.value as ProjectType);
                    }}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:focus:border-white dark:focus:ring-white"
                  >
                    {PROJECT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Synopsis input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Votre idée
                </label>
                <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  onBlur={handleSave}
                  placeholder="Décrivez votre idée de film en quelques lignes..."
                  className="w-full min-h-[160px] rounded-2xl border border-zinc-200 bg-white p-5 text-lg text-zinc-800 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-white dark:focus:ring-white resize-none"
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !synopsis}
                className="w-full rounded-full bg-black px-8 py-4 text-xl font-medium text-white transition-all hover:bg-zinc-800 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                {isGenerating
                  ? "Génération en cours..."
                  : "Générer avec l'IA (Gemini 3 Pro)"}
              </button>

              {/* Generated plan display */}
              {plan && (
                <div className="space-y-10 pt-4">
                  {/* Badge */}
                  <div className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                    Généré avec Gemini 3 Pro Preview
                  </div>

                  {/* Characters */}
                  <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-zinc-200 pb-2 dark:border-zinc-800 text-black dark:text-white">
                      Casting Principal
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {plan.characters.map((char, i) => (
                        <div
                          key={i}
                          className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                              {char.name[0]}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg leading-none text-zinc-900 dark:text-zinc-100">
                                {char.name}
                              </h3>
                              <span className="text-xs font-semibold uppercase text-zinc-400">
                                {char.role}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {char.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Storytelling */}
                  <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-zinc-200 pb-2 dark:border-zinc-800 text-black dark:text-white">
                      Storytelling & Arc Narratif
                    </h2>
                    <div className="rounded-2xl bg-zinc-100 p-8 dark:bg-zinc-900/50 border border-transparent dark:border-zinc-800">
                      <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {plan.storytelling}
                      </p>
                    </div>
                  </section>

                  {/* Script plan */}
                  <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-zinc-200 pb-2 dark:border-zinc-800 text-black dark:text-white">
                      Séquencier
                    </h2>
                    <ul className="space-y-4">
                      {plan.scriptPlan.map((scene, i) => (
                        <li
                          key={i}
                          className="group flex items-start gap-4 rounded-xl border border-zinc-100 bg-white p-5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black font-bold text-white dark:bg-white dark:text-black">
                            {i + 1}
                          </span>
                          <span className="pt-1 font-mono text-zinc-800 dark:text-zinc-200">
                            {scene}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
