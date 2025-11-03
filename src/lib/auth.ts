import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type UserRole = "administrador" | "cocina" | "encuestador" | "comensal";

export interface Profile {
  id: string;
  full_name: string;
  created_at: string;
}

export interface UserWithRole {
  user: User;
  profile: Profile;
  roles: UserRole[];
}

export const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/`,
    },
  });

  if (error) return { error };
  if (!data.user) return { error: new Error("No user returned") };

  // Assign role to the user
  const { error: roleError } = await supabase
    .from("user_roles")
    .insert({
      user_id: data.user.id,
      role: role,
    });

  if (roleError) return { error: roleError };

  return { data, error: null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (error || !data) return [];
  return data.map((r) => r.role as UserRole);
};

export const getCurrentUser = async (): Promise<UserWithRole | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  const roles = await getUserRoles(user.id);

  return {
    user,
    profile,
    roles,
  };
};
