import api from './api';

export interface UploadedFile {
  filename: string;
  path: string;
  size: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  data?: UploadedFile | UploadedFile[];
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ file: UploadedFile }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.file || response.data as any;
  },

  async uploadImages(files: File[]): Promise<UploadedFile[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await api.post<{ files: UploadedFile[] }>('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.files || response.data as any;
  },

  async deleteFile(filename: string): Promise<void> {
    await api.delete(`/upload/${filename}`);
  },

  getFileUrl(path: string): string {
    // If already a full URL or data URL, return as is
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // Otherwise, prepend API base URL
    return `${api.defaults.baseURL}${path}`;
  },
};
