import api from '../config/axios';
import { Favorite, FavoritePost } from '../types';

class FavoriteService {
  async getUserFavorites(): Promise<FavoritePost[]> {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addToFavorites(postId: string): Promise<Favorite> {
    try {
      const response = await api.post('/favorites', { postId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async removeFromFavorites(postId: string): Promise<void> {
    try {
      await api.delete(`/favorites/${postId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async checkIfFavorite(postId: string): Promise<boolean> {
    try {
      const response = await api.get(`/favorites/check/${postId}`);
      return response.data.isFavorite;
    } catch (error) {
      // If there's an error, assume it's not a favorite
      return false;
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

export const favoriteService = new FavoriteService();
