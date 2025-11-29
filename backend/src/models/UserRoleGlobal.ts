/**
 * Modelo de Rol Global de Usuario
 * Representa un rol global asignado a un usuario
 */
export class UserRoleGlobal {
  private userId: string;
  private roleId: number;
  private grantedAt: Date;

  constructor(data: {
    userId: string;
    roleId: number;
    grantedAt?: Date;
  }) {
    this.userId = data.userId;
    this.roleId = data.roleId;
    this.grantedAt = data.grantedAt || new Date();
  }

  public validate(): boolean {
    if (!this.userId) {
      throw new Error('User ID es requerido');
    }
    if (!this.roleId || this.roleId <= 0) {
      throw new Error('Role ID es requerido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      userId: this.userId,
      roleId: this.roleId,
      grantedAt: this.grantedAt,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.userId) this.userId = data.userId;
    if (data.roleId) this.roleId = data.roleId;
    if (data.grantedAt) this.grantedAt = new Date(data.grantedAt);
  }

  // Getters
  public getUserId(): string {
    return this.userId;
  }

  public getRoleId(): number {
    return this.roleId;
  }

  public getGrantedAt(): Date {
    return this.grantedAt;
  }

  // Setters
  public setUserId(userId: string): void {
    if (!userId) {
      throw new Error('User ID es requerido');
    }
    this.userId = userId;
  }

  public setRoleId(roleId: number): void {
    if (!roleId || roleId <= 0) {
      throw new Error('Role ID debe ser un número positivo');
    }
    this.roleId = roleId;
  }
}

