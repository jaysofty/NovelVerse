import { apiRequest } from "./api";

export type User = {
  id: string;
  email: string;
  role: "USER" | "AUTHOR" | "ADMIN";
  profile: {
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
  } | null;
};

type LoginResponse = {
  token: string;
  user: User;
};

type RegisterResponse = {
  token: string;
  user: User;
};

export async function registerUser(input: {
  email: string;
  username: string;
  password: string;
  role: "USER" | "AUTHOR";
}) {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: {
  email: string;
  password: string;
}) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser() {
  return apiRequest<User>("/auth/me");
}

export function logoutUser() {
  localStorage.removeItem("accessToken");
}