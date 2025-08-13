import api from '../config/axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../types';
import { AxiosError } from 'axios'; // Nhập AxiosError

// Định nghĩa giao diện cho phản hồi lỗi từ API
interface ApiErrorResponse {
  message?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data?.data as AuthResponse;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiErrorResponse>); // Sử dụng AxiosError với generic
    }
  }

  async register(data: RegisterData): Promise<{ code: number; message: string }> {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone || data.phoneNumber,
      };
      const response = await api.post('/auth/register', payload);
      return response.data; // Trả về { code, message }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      const serverMessage = (error as AxiosError<ApiErrorResponse>)?.response?.data?.message; // Sử dụng AxiosError với generic
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw this.handleError(error as AxiosError<ApiErrorResponse>); // Sử dụng AxiosError với generic
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/refresh');
      return response.data?.data as AuthResponse;
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiErrorResponse>); // Sử dụng AxiosError với generic
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      const response = await api.get('/auth/me');
      return response.data?.data as AuthResponse['user'];
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiErrorResponse>); // Sử dụng AxiosError với generic
    }
  }

  private handleError(error: AxiosError<ApiErrorResponse>): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText || 'Đã xảy ra lỗi';
      return new Error(message);
    } else if (error.request) {
      return new Error('Lỗi mạng. Vui lòng kiểm tra kết nối của bạn.');
    } else {
      return new Error('Đã xảy ra lỗi không mong muốn.');
    }
  }
}

export const authService = new AuthService();