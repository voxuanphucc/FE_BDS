
import api from '../config/axios';
import { Post, CreatePostData, UpdatePostData, PostListResponse, SinglePostResponse } from '../types';

interface FilterParams {
  city?: string | null; // 'hanoi' | 'hcm' | 'DaNang' | 'cantho' | null
  realEstateType?: string | null; // 'HOUSE' | 'APARTMENT' | 'LAND' | null
  priceFrom?: number | null;
  priceTo?: number | null;
  postType?: string | null; // 'SALE' | 'RENT' | null
  page?: number;
  size?: number;
}

class PostService {
  async getPosts(page = 1, size = 10): Promise<PostListResponse> {
    try {
      const response = await api.get(`/posts/summary?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }


  async filterPosts(params: FilterParams): Promise<PostListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.city) queryParams.append('city', params.city);
      if (params.priceFrom) queryParams.append('priceFrom', params.priceFrom.toString());
      if (params.priceTo) queryParams.append('priceTo', params.priceTo.toString());
      if (params.postType) queryParams.append('postType', params.postType);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.size) queryParams.append('size', params.size.toString());
      if (params.realEstateType) queryParams.append('realEstateType', params.realEstateType);
      const response = await api.get(`/posts/summary/filtered?${queryParams.toString()}`);
      console.log(`Filtering posts with params: ${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      const queryParams = new URLSearchParams();

      if (params.city) queryParams.append('city', params.city);
      if (params.priceFrom) queryParams.append('priceFrom', params.priceFrom.toString());
      if (params.priceTo) queryParams.append('priceTo', params.priceTo.toString());
      if (params.postType) queryParams.append('postType', params.postType);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.size) queryParams.append('size', params.size.toString());
      console.error(`Error filtering posts with params: ${queryParams.toString()}`);
      console.error('Error filtering posts:', error);
      throw this.handleError(error);
    }
  }

  async getPostById(id: string): Promise<Post> {
    try {
      const response = await api.get(`/posts/${id}`);
      // API trả về wrapper, cần lấy data
      const apiResponse: SinglePostResponse = response.data;
      return apiResponse.data;
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      throw this.handleError(error);
    }
  }

  async createPost(data: CreatePostData): Promise<Post> {
    try {
      const response = await api.post('/posts', data);
      // API trả về wrapper, cần lấy data
      const apiResponse: SinglePostResponse = response.data;
      return apiResponse.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    try {
      const response = await api.put(`/posts/${id}`, data);
      // API trả về wrapper, cần lấy data
      const apiResponse: SinglePostResponse = response.data;
      return apiResponse.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    try {
      const response = await api.get(`/users/${userId}/posts`);
      // API trả về wrapper, cần lấy data.items
      const apiResponse: PostListResponse = response.data;
      return apiResponse.data.items;
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

export const postService = new PostService();
