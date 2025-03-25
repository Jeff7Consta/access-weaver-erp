
import { supabase } from "@/integrations/supabase/client";
import { Permission } from "@/lib/types";

export const getPermissions = async (): Promise<Permission[]> => {
  const { data, error } = await supabase
    .from('permissions')
    .select('*');

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return data.map(item => ({
    id: item.id,
    accessLevelId: item.access_level_id,
    resourceType: item.resource_type,
    resourceId: item.resource_id,
    actions: item.actions
  })) as Permission[];
};

export const getPermissionsByAccessLevel = async (accessLevelId: string): Promise<Permission[]> => {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .eq('access_level_id', accessLevelId);

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return data.map(item => ({
    id: item.id,
    accessLevelId: item.access_level_id,
    resourceType: item.resource_type,
    resourceId: item.resource_id,
    actions: item.actions
  })) as Permission[];
};

export const createPermission = async (permission: Omit<Permission, "id">): Promise<Permission> => {
  const { data, error } = await supabase
    .from('permissions')
    .insert({
      access_level_id: permission.accessLevelId,
      resource_type: permission.resourceType,
      resource_id: permission.resourceId,
      actions: permission.actions
    })
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    accessLevelId: data.access_level_id,
    resourceType: data.resource_type,
    resourceId: data.resource_id,
    actions: data.actions
  } as Permission;
};

export const updatePermission = async (id: string, permission: Partial<Permission>): Promise<Permission> => {
  // Transform camelCase to snake_case for the database
  const dbPermission: any = {};
  if (permission.accessLevelId) dbPermission.access_level_id = permission.accessLevelId;
  if (permission.resourceType) dbPermission.resource_type = permission.resourceType;
  if (permission.resourceId) dbPermission.resource_id = permission.resourceId;
  if (permission.actions) dbPermission.actions = permission.actions;
  
  const { data, error } = await supabase
    .from('permissions')
    .update(dbPermission)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    accessLevelId: data.access_level_id,
    resourceType: data.resource_type,
    resourceId: data.resource_id,
    actions: data.actions
  } as Permission;
};

export const deletePermission = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('permissions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
