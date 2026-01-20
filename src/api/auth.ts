import apiClient from './client';
import type { RegisterUserDTO , LoginDTO ,AuthResponse } from '../types/auth';

export const authApi = {
  register: (data: RegisterUserDTO) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  login: (data: LoginDTO) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { refreshToken }),

  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),
};
