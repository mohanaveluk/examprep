export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    major: string;
  }

export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    message?: string;
    access_token: string;
    refresh_token: string;
    user?: UserModel;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  export interface RefreshTokenResponse {
    access_token: string;
  }

  export interface UserModel{
    id: string,
    email: string,
    firstName: string,
    lastName?: string,
    role: string
  }
  
  export interface UserResponse{
    status: boolean,
    message: string,
    access_token: string,
    user: UserModel
  }