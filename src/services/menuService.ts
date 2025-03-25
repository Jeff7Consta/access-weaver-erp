
import { supabase } from "@/integrations/supabase/client";
import { Menu } from "@/lib/types";

export const getMenus = async (): Promise<Menu[]> => {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  
  // Transform snake_case to camelCase and build hierarchy
  const menus = data.map(item => ({
    id: item.id,
    name: item.name,
    icon: item.icon,
    route: item.route,
    externalUrl: item.external_url,
    parentId: item.parent_id,
    screenId: item.screen_id,
    requiresAuth: item.requires_auth,
    accessLevelId: item.access_level_id,
    order: item.order,
    isActive: item.is_active,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    children: []
  })) as Menu[];
  
  // Build menu hierarchy
  const menuMap = new Map<string, Menu>();
  const rootMenus: Menu[] = [];
  
  // Create a map of all menus by id
  menus.forEach(menu => menuMap.set(menu.id, menu));
  
  // Assign children to parent menus
  menus.forEach(menu => {
    if (menu.parentId) {
      const parentMenu = menuMap.get(menu.parentId);
      if (parentMenu) {
        parentMenu.children = parentMenu.children || [];
        parentMenu.children.push(menu);
      }
    } else {
      rootMenus.push(menu);
    }
  });
  
  return rootMenus;
};

export const getMenuById = async (id: string): Promise<Menu> => {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    route: data.route,
    externalUrl: data.external_url,
    parentId: data.parent_id,
    screenId: data.screen_id,
    requiresAuth: data.requires_auth,
    accessLevelId: data.access_level_id,
    order: data.order,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Menu;
};

export const createMenu = async (menu: Omit<Menu, "id" | "createdAt" | "updatedAt" | "children">): Promise<Menu> => {
  const { data, error } = await supabase
    .from('menus')
    .insert({
      name: menu.name,
      icon: menu.icon,
      route: menu.route,
      external_url: menu.externalUrl,
      parent_id: menu.parentId,
      screen_id: menu.screenId,
      requires_auth: menu.requiresAuth,
      access_level_id: menu.accessLevelId,
      order: menu.order,
      is_active: menu.isActive
    })
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    route: data.route,
    externalUrl: data.external_url,
    parentId: data.parent_id,
    screenId: data.screen_id,
    requiresAuth: data.requires_auth,
    accessLevelId: data.access_level_id,
    order: data.order,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Menu;
};

export const updateMenu = async (id: string, menu: Partial<Menu>): Promise<Menu> => {
  // Transform camelCase to snake_case for the database
  const dbMenu: any = {};
  if (menu.name) dbMenu.name = menu.name;
  if (menu.icon !== undefined) dbMenu.icon = menu.icon;
  if (menu.route !== undefined) dbMenu.route = menu.route;
  if (menu.externalUrl !== undefined) dbMenu.external_url = menu.externalUrl;
  if (menu.parentId !== undefined) dbMenu.parent_id = menu.parentId;
  if (menu.screenId !== undefined) dbMenu.screen_id = menu.screenId;
  if (menu.requiresAuth !== undefined) dbMenu.requires_auth = menu.requiresAuth;
  if (menu.accessLevelId !== undefined) dbMenu.access_level_id = menu.accessLevelId;
  if (menu.order !== undefined) dbMenu.order = menu.order;
  if (menu.isActive !== undefined) dbMenu.is_active = menu.isActive;
  
  const { data, error } = await supabase
    .from('menus')
    .update(dbMenu)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Transform snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    icon: data.icon,
    route: data.route,
    externalUrl: data.external_url,
    parentId: data.parent_id,
    screenId: data.screen_id,
    requiresAuth: data.requires_auth,
    accessLevelId: data.access_level_id,
    order: data.order,
    isActive: data.is_active,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as Menu;
};

export const deleteMenu = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('menus')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
