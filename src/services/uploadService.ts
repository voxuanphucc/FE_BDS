import { UploadResponse } from '../types';

class UploadService {
  async uploadImage(file: File, cloudName: string, uploadPreset: string): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Cloudinary upload error:', errorData);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        public_id: data.public_id,
      };
    } catch (error) {
      console.error('UploadService error:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadMultipleImages(files: File[], cloudName: string, uploadPreset: string): Promise<UploadResponse[]> {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file, cloudName, uploadPreset));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error('Failed to upload images');
    }
  }
}

export const uploadService = new UploadService();
