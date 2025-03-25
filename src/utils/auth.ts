
import { api } from "@/lib/api";
import { AuthResponse, LoginCredentials } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // For the mock API version
  return api.login(credentials);
  
  // For Supabase implementation (when ready)
  /*
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  
  if (error) throw error;
  
  // Fetch user profile and permissions
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  if (userError) throw userError;
  
  // Fetch menus this user has access to
  const { data: menuData, error: menuError } = await supabase
    .from('menus')
    .select('*')
    .eq('is_active', true)
    .order('order');
  
  if (menuError) throw menuError;
  
  return {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      groupId: userData.group_id,
      accessLevelId: userData.access_level_id,
      status: userData.status,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at
    },
    token: data.session.access_token,
    menus: transformMenus(menuData)
  };
  */
};

export const logout = async (): Promise<void> => {
  // For the mock API version
  return api.logout();
  
  // For Supabase implementation (when ready)
  /*
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  */
};

export const getCurrentUser = async (): Promise<AuthResponse | null> => {
  // For the mock API version
  return api.getCurrentUser();
  
  // For Supabase implementation (when ready)
  /*
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) return null;
  
  // Fetch user profile and permissions
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.session.user.id)
    .single();
  
  if (userError) return null;
  
  // Fetch menus this user has access to
  const { data: menuData, error: menuError } = await supabase
    .from('menus')
    .select('*')
    .eq('is_active', true)
    .order('order');
  
  if (menuError) return null;
  
  return {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      groupId: userData.group_id,
      accessLevelId: userData.access_level_id,
      status: userData.status,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at
    },
    token: data.session.access_token,
    menus: transformMenus(menuData)
  };
  */
};

// Helper function to transform menu data and build the hierarchy
function transformMenus(menuData: any[]): any[] {
  if (!menuData || !Array.isArray(menuData)) return [];
  
  // Convert from snake_case to camelCase
  const menus = menuData.map(menu => ({
    id: menu.id,
    name: menu.name,
    icon: menu.icon,
    route: menu.route,
    externalUrl: menu.external_url,
    parentId: menu.parent_id,
    screenId: menu.screen_id,
    requiresAuth: menu.requires_auth,
    accessLevelId: menu.access_level_id,
    order: menu.order,
    isActive: menu.is_active,
    createdAt: menu.created_at,
    updatedAt: menu.updated_at,
    children: []
  }));
  
  // Build menu hierarchy
  const menuMap = new Map();
  const rootMenus = [];
  
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
}
