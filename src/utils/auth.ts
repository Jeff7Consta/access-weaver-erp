
import { api } from '@/lib/api';
import { AuthResponse, LoginCredentials } from '@/lib/types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    return await api.login(credentials);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.logout();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthResponse | null> => {
  try {
    return await api.getCurrentUser();
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};
