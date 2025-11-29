import { BaseModel } from './BaseModel';

/**
 * Enum para el alcance del rol
 */
export enum RoleScope {
  GLOBAL = 'global',
  COMPANY = 'company',
  BACKOFFICE = 'backoffice'
}

/**
 * Modelo de Rol
 * Representa un rol en el sistema
 */
export class Role extends BaseModel {
  private name: string;
  private scope: RoleScope;
  private description?: string;

  constructor(data?: {
    id?: number;
    name: string;
    scope: RoleScope;
    description?: string;
  }) {
    super(data?.id);
    
    if (data) {
      this.name = data.name;
      this.scope = data.scope;
      this.description = data.description;
    } else {
      this.name = '';
      this.scope = RoleScope.GLOBAL;
    }
  }

  protected generateId(): number {
    // ID auto-incremental manejado por la BD
    return 0;
  }

  public validate(): boolean {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nombre del rol es requerido');
    }
    if (!Object.values(RoleScope).includes(this.scope)) {
      throw new Error('Alcance del rol inválido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      name: this.name,
      scope: this.scope,
      description: this.description,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.name) this.name = data.name;
    if (data.scope) this.scope = data.scope as RoleScope;
    if (data.description !== undefined) this.description = data.description;
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  public getScope(): RoleScope {
    return this.scope;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  // Setters
  public setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nombre del rol es requerido');
    }
    this.name = name;
    this.setUpdatedAt(new Date());
  }

  public setScope(scope: RoleScope): void {
    if (!Object.values(RoleScope).includes(scope)) {
      throw new Error('Alcance del rol inválido');
    }
    this.scope = scope;
    this.setUpdatedAt(new Date());
  }

  public setDescription(description: string | undefined): void {
    this.description = description;
    this.setUpdatedAt(new Date());
  }
}

