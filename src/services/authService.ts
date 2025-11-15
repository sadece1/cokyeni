import api from './api';
import { AuthResponse, LoginForm, RegisterForm, User } from '@/types';

export const authService = {
  async login(credentials: LoginForm): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterForm): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data.user;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data.users || response.data;
  },
};

