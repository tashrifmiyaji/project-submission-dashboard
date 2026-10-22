export type UserRole = "ADMIN" | "MENTOR" | "STUDENT";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken?: string;
  };
};

export type GetMeResponse = {
  success: boolean;
  message: string;
  data: AuthUser;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};


export type SignupResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken?: string;
  };
};
