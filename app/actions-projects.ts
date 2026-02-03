"use server";

import { createClient } from "@/lib/supabase-server";

export type ProjectType =
  | "clip vidéo"
  | "web série"
  | "documentaire"
  | "court métrage"
  | "publicité";

export type Project = {
  id: string;
  user_id: string;
  title: string;
  project_type: ProjectType;
  synopsis: string | null;
  generated_plan: {
    characters: { name: string; role: string; desc: string }[];
    storytelling: string;
    scriptPlan: string[];
  } | null;
  created_at: string;
  updated_at: string;
};

export async function createProject(projectType: ProjectType) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  const { data, error } = await supabase
    .from("films_projects")
    .insert({
      user_id: user.id,
      title: "Nouveau projet",
      project_type: projectType,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function getProject(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("films_projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(
  id: string,
  updates: {
    title?: string;
    synopsis?: string;
    project_type?: ProjectType;
    generated_plan?: Project["generated_plan"];
  }
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("films_projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("films_projects").delete().eq("id", id);
  if (error) throw error;
}

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("films_projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Project[];
}
