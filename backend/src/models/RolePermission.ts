/**
 * Modelo de Relación Rol-Permiso
 * Representa la relación entre un rol y un permiso
 */
export class RolePermission {
  private roleId: number;
  private permissionId: number;
  private createdAt: Date;

  constructor(data: {
    roleId: number;
    permissionId: number;
    createdAt?: Date;
  }) {
    this.roleId = data.roleId;
    this.permissionId = data.permissionId;
    this.createdAt = data.createdAt || new Date();
  }

  public validate(): boolean {
    if (!this.roleId || this.roleId <= 0) {
      throw new Error('Role ID es requerido');
    }
    if (!this.permissionId || this.permissionId <= 0) {
      throw new Error('Permission ID es requerido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      roleId: this.roleId,
      permissionId: this.permissionId,
      createdAt: this.createdAt,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.roleId) this.roleId = data.roleId;
    if (data.permissionId) this.permissionId = data.permissionId;
    if (data.createdAt) this.createdAt = new Date(data.createdAt);
  }

  // Getters
  public getRoleId(): number {
    return this.roleId;
  }

  public getPermissionId(): number {
    return this.permissionId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  // Setters
  public setRoleId(roleId: number): void {
    if (!roleId || roleId <= 0) {
      throw new Error('Role ID debe ser un número positivo');
    }
    this.roleId = roleId;
  }

  public setPermissionId(permissionId: number): void {
    if (!permissionId || permissionId <= 0) {
      throw new Error('Permission ID debe ser un número positivo');
    }
    this.permissionId = permissionId;
  }
}

