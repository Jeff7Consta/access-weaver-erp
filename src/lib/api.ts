import { AuthResponse, LoginCredentials, User, Group, AccessLevel, Menu, Screen, Permission } from './types';

// In a real app, this would come from an environment variable
const API_URL = 'http://localhost:3001/api';

// For the demo, we'll simulate API calls with mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    groupId: '1',
    accessLevelId: '1',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    groupId: '2',
    accessLevelId: '2',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Administrators',
    description: 'System administrators with full access',
    accessLevelId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Users',
    description: 'Regular system users',
    accessLevelId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockAccessLevels: AccessLevel[] = [
  {
    id: '1',
    name: 'Full Access',
    description: 'Complete system access',
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Basic Access',
    description: 'Limited system access',
    parentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockMenus: Menu[] = [
  {
    id: '1',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    route: '/dashboard',
    externalUrl: null,
    parentId: null,
    screenId: null,
    requiresAuth: true,
    accessLevelId: '2',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Administration',
    icon: 'Settings',
    route: null,
    externalUrl: null,
    parentId: null,
    screenId: null,
    requiresAuth: true,
    accessLevelId: '1',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: '3',
        name: 'Users',
        icon: 'Users',
        route: '/admin/users',
        externalUrl: null,
        parentId: '2',
        screenId: null,
        requiresAuth: true,
        accessLevelId: '1',
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Groups',
        icon: 'UserCircle',
        route: '/admin/groups',
        externalUrl: null,
        parentId: '2',
        screenId: null,
        requiresAuth: true,
        accessLevelId: '1',
        order: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Access Levels',
        icon: 'Shield',
        route: '/admin/access-levels',
        externalUrl: null,
        parentId: '2',
        screenId: null,
        requiresAuth: true,
        accessLevelId: '1',
        order: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'Menus',
        icon: 'Menu',
        route: '/admin/menus',
        externalUrl: null,
        parentId: '2',
        screenId: null,
        requiresAuth: true,
        accessLevelId: '1',
        order: 4,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '7',
        name: 'Screens',
        icon: 'Monitor',
        route: '/admin/screens',
        externalUrl: null,
        parentId: '2',
        screenId: null,
        requiresAuth: true,
        accessLevelId: '1',
        order: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: '9',
    name: 'Analytics',
    icon: 'BarChart',
    route: null,
    externalUrl: null,
    parentId: null,
    screenId: null,
    requiresAuth: true,
    accessLevelId: '2',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: '10',
        name: 'SQL Queries',
        icon: 'Database',
        route: '/analytics/queries',
        externalUrl: null,
        parentId: '9',
        screenId: null,
        requiresAuth: true,
        accessLevelId: '2',
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: '11',
    name: 'Power BI',
    icon: 'PieChart',
    route: null,
    externalUrl: null,
    parentId: null,
    screenId: null,
    requiresAuth: true,
    accessLevelId: '2',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: '12',
        name: 'Reports',
        icon: 'FileBarChart',
        route: '/powerbi/reports',
        externalUrl: null,
        parentId: '11',
        screenId: null,
        requiresAuth: true,
        accessLevelId: '2',
        order: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: '8',
    name: 'External System',
    icon: 'ExternalLink',
    route: null,
    externalUrl: 'https://example.com',
    parentId: null,
    screenId: null,
    requiresAuth: true,
    accessLevelId: '2',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Simulated API class
class API {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const { email, password } = credentials;
    
    // For demo purposes, simple email/password check
    if (email === 'admin@example.com' && password === 'admin') {
      const user = mockUsers.find(u => u.email === email);
      const token = 'mock_jwt_token_' + Date.now();
      
      this.setToken(token);
      
      return {
        user: user!,
        token,
        menus: this.filterMenusByUser(user!),
      };
    } else if (email === 'user@example.com' && password === 'user') {
      const user = mockUsers.find(u => u.email === email);
      const token = 'mock_jwt_token_' + Date.now();
      
      this.setToken(token);
      
      return {
        user: user!,
        token,
        menus: this.filterMenusByUser(user!),
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async logout(): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    this.clearToken();
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = this.getToken();
    if (!token) return null;
    
    // For demo, we'll just return the admin user if a token exists
    // In a real app, the token would be verified on the server
    const isAdmin = token.includes('admin') || Math.random() > 0.5;
    const user = mockUsers.find(u => u.role === (isAdmin ? 'admin' : 'user'))!;
    
    return {
      user,
      token,
      menus: this.filterMenusByUser(user),
    };
  }

  private filterMenusByUser(user: User): Menu[] {
    if (user.role === 'admin') {
      return mockMenus;
    } else {
      // Filter menus based on user's access level
      return mockMenus.filter(menu => {
        // Allow menu if it's accessible by the user's access level
        if (menu.accessLevelId === user.accessLevelId || menu.accessLevelId === '2') {
          // Deep clone to avoid modifying the original
          const menuCopy = { ...menu };
          
          // Filter children if they exist
          if (menuCopy.children) {
            menuCopy.children = menuCopy.children.filter(
              child => child.accessLevelId === user.accessLevelId || child.accessLevelId === '2'
            );
          }
          
          return true;
        }
        return false;
      });
    }
  }

  // Users API - extended with create, update, delete
  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      groupId: userData.groupId,
      accessLevelId: userData.accessLevelId,
      status: userData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    mockUsers[userIndex] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers.splice(userIndex, 1);
  }

  // Groups API
  async getGroups(): Promise<Group[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockGroups;
  }

  // Access Levels API
  async getAccessLevels(): Promise<AccessLevel[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockAccessLevels;
  }

  // Menus API
  async getMenus(): Promise<Menu[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMenus;
  }
}

export const api = new API();
