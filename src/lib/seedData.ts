import { supabase } from "@/integrations/supabase/client";
import { signUp, type UserRole } from "./auth";

export interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export const exampleUsers: SeedUser[] = [
  {
    email: "admin@ecogestion.com",
    password: "Admin123!",
    fullName: "Administrador Sistema",
    role: "administrador",
  },
  {
    email: "cocina@ecogestion.com",
    password: "Cocina123!",
    fullName: "Personal de Cocina",
    role: "cocina",
  },
  {
    email: "encuestas@ecogestion.com",
    password: "Encuestas123!",
    fullName: "Encuestador Principal",
    role: "encuestador",
  },
  {
    email: "comensal@ecogestion.com",
    password: "Comensal123!",
    fullName: "Usuario Comensal",
    role: "comensal",
  },
];

export const createExampleUsers = async () => {
  const results = [];
  
  for (const user of exampleUsers) {
    const { data, error } = await signUp(
      user.email,
      user.password,
      user.fullName,
      user.role
    );
    
    results.push({
      email: user.email,
      success: !error,
      error: error?.message,
    });
  }
  
  return results;
};

export const checkIfUsersExist = async () => {
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });
  
  return (count || 0) > 0;
};
