
import { supabase } from "@/integrations/supabase/client";
import { Group } from "@/lib/types";

export const getGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    accessLevelId: item.access_level_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) as Group[];
};

export const getGroupById = async (id: string): Promise<Group> => {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    accessLevelId: data.access_level_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Group;
};

export const createGroup = async (group: Omit<Group, "id" | "createdAt" | "updatedAt">): Promise<Group> => {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      name: group.name,
      description: group.description,
      access_level_id: group.accessLevelId
    })
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    accessLevelId: data.access_level_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Group;
};

export const updateGroup = async (id: string, group: Partial<Group>): Promise<Group> => {
  // Transform camelCase to snake_case for the database
  const dbGroup: any = {};
  if (group.name) dbGroup.name = group.name;
  if (group.description) dbGroup.description = group.description;
  if (group.accessLevelId) dbGroup.access_level_id = group.accessLevelId;
  
  const { data, error } = await supabase
    .from('groups')
    .update(dbGroup)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    accessLevelId: data.access_level_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Group;
};

export const deleteGroup = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
