import { UserRole } from "../types/User";

export const ROLES = {
  ADMIN: UserRole.ADMIN,
  EMPRESA: UserRole.EMPRESA,
  USUARIO_FINAL: UserRole.USUARIO_FINAL,
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.EMPRESA]: "Empresa",
  [UserRole.USUARIO_FINAL]: "Usuario Final",
};
