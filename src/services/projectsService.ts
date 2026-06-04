import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  name: string;
  expediente: string | null;
  promovente: string | null;
  authority: string | null;
  resolution_date: string | null;
  location: string | null;
  municipality: string | null;
  state: string | null;
  coordinates: string | null;
  activity: string | null;
  vigencia: string | null;
  surface: string | null;
  volume: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateProjectInput = {
  name: string;
  expediente?: string;
  promovente?: string;
  authority?: string;
  resolution_date?: string;
  location?: string;
  municipality?: string;
  state?: string;
  coordinates?: string;
  activity?: string;
  vigencia?: string;
  surface?: string;
  volume?: string;
};

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getProjectById(projectId: string): Promise<Project> {
  const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: input.name,
      expediente: input.expediente || null,
      promovente: input.promovente || null,
      authority: input.authority || null,
      resolution_date: input.resolution_date || null,
      location: input.location || null,
      municipality: input.municipality || null,
      state: input.state || null,
      coordinates: input.coordinates || null,
      activity: input.activity || null,
      vigencia: input.vigencia || null,
      surface: input.surface || null,
      volume: input.volume || null,
      created_by: user?.id ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
