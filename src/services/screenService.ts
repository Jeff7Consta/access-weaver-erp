
import { supabase } from "@/integrations/supabase/client";
import { Screen } from "@/lib/types";

export const getScreens = async (): Promise<Screen[]> => {
  const { data, error } = await supabase
    .from('screens')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    content: item.content,
    contentType: item.content_type,
    accessLevelId: item.access_level_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  })) as Screen[];
};

export const getScreenById = async (id: string): Promise<Screen> => {
  const { data, error } = await supabase
    .from('screens')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    content: data.content,
    contentType: data.content_type,
    accessLevelId: data.access_level_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Screen;
};

export const createScreen = async (screen: Omit<Screen, "id" | "createdAt" | "updatedAt">): Promise<Screen> => {
  const { data, error } = await supabase
    .from('screens')
    .insert({
      name: screen.name,
      description: screen.description,
      content: screen.content,
      content_type: screen.contentType,
      access_level_id: screen.accessLevelId
    })
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    content: data.content,
    contentType: data.content_type,
    accessLevelId: data.access_level_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Screen;
};

export const updateScreen = async (id: string, screen: Partial<Screen>): Promise<Screen> => {
  // Transform camelCase to snake_case for the database
  const dbScreen: any = {};
  if (screen.name) dbScreen.name = screen.name;
  if (screen.description !== undefined) dbScreen.description = screen.description;
  if (screen.content) dbScreen.content = screen.content;
  if (screen.contentType) dbScreen.content_type = screen.contentType;
  if (screen.accessLevelId !== undefined) dbScreen.access_level_id = screen.accessLevelId;
  
  const { data, error } = await supabase
    .from('screens')
    .update(dbScreen)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    content: data.content,
    contentType: data.content_type,
    accessLevelId: data.access_level_id,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Screen;
};

export const deleteScreen = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('screens')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
