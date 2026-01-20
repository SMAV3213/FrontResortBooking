// Auth DTOs
export interface RegisterUserDTO {
  login: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  login: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface LogoutDTO {
  refreshToken: string;
}

// Auth Response
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  login: string;
  email: string;
  phoneNumber: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (loginData: LoginDTO) => Promise<void>;
  register: (registerData: RegisterUserDTO) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}
