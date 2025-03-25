export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  groupId: string;
  accessLevelId: string;
  status: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  accessLevelId: string;
  createdAt: string;
  updatedAt: string;
};

export type AccessLevel = {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Menu = {
  id: string;
  name: string;
  icon?: string;
  route?: string;
  externalUrl?: string;
  parentId: string | null;
  screenId: string | null;
  requiresAuth: boolean;
  accessLevelId: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Menu[];
};

export type Screen = {
  id: string;
  name: string;
  description: string;
  content: string;
  contentType: "html" | "component" | "iframe";
  accessLevelId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Permission = {
  id: string;
  accessLevelId: string;
  resourceType: "screen" | "menu";
  resourceId: string;
  actions: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    admin: boolean;
  };
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
  menus: Menu[];
};

export type AnalyticsQuery = {
  id: string;
  name: string;
  description?: string;
  sql_query: string;
  columns?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type PowerBIReport = {
  id: string;
  name: string;
  description?: string;
  report_id: string;
  workspace_id?: string;
  embed_url?: string;
  created_at: string;
  updated_at: string;
};

export type AnalyticsQueryResult = {
  data: Record<string, any>[];
  columns: string[];
};
