import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
}

class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(data: UpdateUserData): Promise<User> {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/profile`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/users/change-password`, {
        currentPassword,
        newPassword,
      });
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

export const userService = new UserService();
