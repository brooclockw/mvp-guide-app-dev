export enum UserRole {
  ADMIN = "admin",
  EMPRESA = "empresa",
  USUARIO_FINAL = "usuario_final",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  UNVERIFIED = "unverified",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  dni?: string;
  gender?: string;
  birthDate?: string;
}

export interface UserProfile extends User {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface UserCreateInput {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}
