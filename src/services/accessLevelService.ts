
import { supabase } from "@/integrations/supabase/client";
import { AccessLevel } from "@/lib/types";

export const getAccessLevels = async (): Promise<AccessLevel[]> => {
  const { data, error } = await supabase
    .from('access_levels')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    parentId: item.parent_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) as AccessLevel[];
};

export const getAccessLevelById = async (id: string): Promise<AccessLevel> => {
  const { data, error } = await supabase
    .from('access_levels')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    parentId: data.parent_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as AccessLevel;
};

export const createAccessLevel = async (accessLevel: Omit<AccessLevel, "id" | "createdAt" | "updatedAt">): Promise<AccessLevel> => {
  const { data, error } = await supabase
    .from('access_levels')
    .insert({
      name: accessLevel.name,
      description: accessLevel.description,
      parent_id: accessLevel.parentId
    })
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    parentId: data.parent_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as AccessLevel;
};

export const updateAccessLevel = async (id: string, accessLevel: Partial<AccessLevel>): Promise<AccessLevel> => {
  // Transform camelCase to snake_case for the database
  const dbAccessLevel: any = {};
  if (accessLevel.name) dbAccessLevel.name = accessLevel.name;
  if (accessLevel.description) dbAccessLevel.description = accessLevel.description;
  if (accessLevel.parentId !== undefined) dbAccessLevel.parent_id = accessLevel.parentId;
  
  const { data, error } = await supabase
    .from('access_levels')
    .update(dbAccessLevel)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    parentId: data.parent_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as AccessLevel;
};

export const deleteAccessLevel = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('access_levels')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
