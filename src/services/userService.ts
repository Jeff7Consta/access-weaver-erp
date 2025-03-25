
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/lib/types";

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Transform snake_case to camelCase and ensure correct typing
  return data.map(item => ({
    id: item.id,
    name: item.name,
    email: item.email,
    role: item.role as "admin" | "user", // Cast to the expected literal type
    groupId: item.group_id,
    accessLevelId: item.access_level_id,
    status: item.status as "active" | "blocked", // Cast to the expected literal type
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
};

export const getUserById = async (id: string): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase and ensure correct typing
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as "admin" | "user", // Cast to the expected literal type
    groupId: data.group_id,
    accessLevelId: data.access_level_id,
    status: data.status as "active" | "blocked", // Cast to the expected literal type
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const createUser = async (user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> => {
  // Convert camelCase to snake_case for database insertion
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: user.name,
      email: user.email,
      role: user.role,
      group_id: user.groupId,
      access_level_id: user.accessLevelId,
      status: user.status
    })
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase for application
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as "admin" | "user", // Cast to the expected literal type
    groupId: data.group_id,
    accessLevelId: data.access_level_id,
    status: data.status as "active" | "blocked", // Cast to the expected literal type
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  // Transform camelCase to snake_case for the database
  const dbUser: any = {};
  if (user.name) dbUser.name = user.name;
  if (user.email) dbUser.email = user.email;
  if (user.role) dbUser.role = user.role;
  if (user.groupId) dbUser.group_id = user.groupId;
  if (user.accessLevelId) dbUser.access_level_id = user.accessLevelId;
  if (user.status) dbUser.status = user.status;
  
  const { data, error } = await supabase
    .from('users')
    .update(dbUser)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase for application
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as "admin" | "user", // Cast to the expected literal type
    groupId: data.group_id,
    accessLevelId: data.access_level_id,
    status: data.status as "active" | "blocked", // Cast to the expected literal type
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
