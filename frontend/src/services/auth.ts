import client from "@/api/client";

export interface LoginRequest {
  userId: string;
  password?: string;
  userType?: "patient" | "doctor" | "admin";
}

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    userId: string;
    name: string;
    userType: "patient" | "doctor" | "admin";
  };
}

export interface RegisterRequest {
  name: string;
  identityId: string;
  password?: string;
  phone?: string;
}

export const authService = {
  login: (data: LoginRequest) => {
    return client.post<any, LoginResponse>("/auth/login", data);
  },

  register: (data: RegisterRequest) => {
    return client.post<any, any>("/patient/register", data);
  },
};
