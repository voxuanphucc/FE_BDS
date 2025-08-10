import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return new Error('An unexpected error occurred.');
    }
  }
}

export const authService = new AuthService();
