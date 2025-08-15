import api from '../config/axios';
import { LoginCredentials, RegisterData, AuthResponse } from '../types';
import { AxiosError } from 'axios';

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
      throw this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async register(data: RegisterData): Promise<{ code: number; message: string }> {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phone: data.phone,
      };
      const response = await api.post('/auth/register', payload);

      return response.data; // Trả về { code, message }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      // Xử lý lỗi 409 Conflict cụ thể
      if (axiosError.response?.status === 409) {
        const serverMessage = axiosError.response.data?.message;
        if (serverMessage) {
          throw new Error(`409 Conflict: ${serverMessage}`);
        } else {
          throw new Error('409 Conflict: Thông tin đăng ký đã tồn tại trong hệ thống');
        }
      }

      // Xử lý các lỗi khác
      const serverMessage = axiosError?.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw this.handleError(axiosError);
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
      throw this.handleError(error as AxiosError<ApiErrorResponse>);
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    try {
      const response = await api.get('/auth/me');
      return response.data?.data as AuthResponse['user'];
    } catch (error) {
      throw this.handleError(error as AxiosError<ApiErrorResponse>);
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