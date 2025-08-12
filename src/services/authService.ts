import api from '../config/axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data?.data as AuthResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const payload = {
        name: data.name,
        username: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || data.phoneNumber,
        roleName: data.roleName || data.role,
      };

      const response = await api.post('/auth/register', payload);
      return response.data?.data as AuthResponse;
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/refresh');
      return response.data?.data as AuthResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      const response = await api.get('/auth/me');
      return response.data?.data as AuthResponse['user'];
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error('An unexpected error occurred.');
    }
  }
}

export const authService = new AuthService();
