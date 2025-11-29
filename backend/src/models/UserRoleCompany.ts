/**
 * Modelo de Rol de Usuario en Empresa
 * Representa un rol asignado a un usuario dentro de una empresa específica
 */
export class UserRoleCompany {
  private userId: string;
  private companyId: string;
  private roleId: number;
  private grantedAt: Date;

  constructor(data: {
    userId: string;
    companyId: string;
    roleId: number;
    grantedAt?: Date;
  }) {
    this.userId = data.userId;
    this.companyId = data.companyId;
    this.roleId = data.roleId;
    this.grantedAt = data.grantedAt || new Date();
  }

  public validate(): boolean {
    if (!this.userId) {
      throw new Error('User ID es requerido');
    }
    if (!this.companyId) {
      throw new Error('Company ID es requerido');
    }
    if (!this.roleId || this.roleId <= 0) {
      throw new Error('Role ID es requerido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      userId: this.userId,
      companyId: this.companyId,
      roleId: this.roleId,
      grantedAt: this.grantedAt,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.userId) this.userId = data.userId;
    if (data.companyId) this.companyId = data.companyId;
    if (data.roleId) this.roleId = data.roleId;
    if (data.grantedAt) this.grantedAt = new Date(data.grantedAt);
  }

  // Getters
  public getUserId(): string {
    return this.userId;
  }

  public getCompanyId(): string {
    return this.companyId;
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

  public setCompanyId(companyId: string): void {
    if (!companyId) {
      throw new Error('Company ID es requerido');
    }
    this.companyId = companyId;
  }

  public setRoleId(roleId: number): void {
    if (!roleId || roleId <= 0) {
      throw new Error('Role ID debe ser un número positivo');
    }
    this.roleId = roleId;
  }
}

