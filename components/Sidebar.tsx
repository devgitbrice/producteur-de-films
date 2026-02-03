"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  title: string;
  project_type: string;
  updated_at: string;
};

const TYPE_ICONS: Record<string, string> = {
  "clip vidéo": "🎵",
  "web série": "📺",
  documentaire: "🎬",
  "court métrage": "🎞️",
  publicité: "📢",
};

export default function Sidebar({
  isOpen,
  onToggle,
  currentProjectId,
  onSelectProject,
  onNewProject,
}: {
  isOpen: boolean;
  onToggle: () => void;
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadProjects();
    loadUser();
  }, []);

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserEmail(user.email || "");
  };

  const loadProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("id, title, project_type, updated_at")
      .order("updated_at", { ascending: false });
    if (data) setProjects(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-600 dark:text-zinc-300"
        >
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-200 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 pt-16 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-black dark:text-white">
              Mes Projets
            </h2>
            <button
              onClick={onNewProject}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-300 transition-colors"
              title="Nouveau projet"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {projects.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-8">
              Aucun projet pour le moment.
              <br />
              Cliquez sur + pour commencer.
            </p>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left rounded-xl px-3 py-3 transition-colors ${
                  currentProjectId === project.id
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {TYPE_ICONS[project.project_type] || "🎬"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {project.title}
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 capitalize">
                      {project.project_type}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* User footer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
              {userEmail}
            </p>
            <button
              onClick={handleLogout}
              className="text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              title="Déconnexion"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
