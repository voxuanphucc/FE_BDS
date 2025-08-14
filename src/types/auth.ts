// Authentication related types
export interface LoginCredentials {
  phone: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isEmailVerified: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthValidationError {
  field: string;
  message: string;
}

export interface AuthValidationErrors {
  errors: AuthValidationError[];
}

// OAuth types
export interface OAuthProvider {
  name: 'google' | 'facebook' | 'github' | 'twitter';
  clientId: string;
  redirectUri: string;
}

export interface OAuthLoginRequest {
  provider: OAuthProvider['name'];
  code: string;
  state?: string;
}

// Session types
export interface Session {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivityAt: string;
  isActive: boolean;
}

export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  location?: string;
}

export interface SessionListResponse {
  sessions: Session[];
  currentSessionId: string;
}

export interface RevokeSessionRequest {
  sessionId: string;
}

export interface RevokeAllSessionsRequest {
  exceptCurrent?: boolean;
}
