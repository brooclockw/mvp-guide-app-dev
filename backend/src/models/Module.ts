import { BaseModel } from './BaseModel';

/**
 * Modelo de Módulo
 * Representa un módulo del sistema
 */
export class Module extends BaseModel {
  private key: string;
  private name: string;
  private description?: string;
  private isCore: boolean;

  constructor(data?: {
    key: string;
    name: string;
    description?: string;
    isCore?: boolean;
    createdAt?: Date;
  }) {
    super(data?.key);
    
    if (data) {
      this.key = data.key;
      this.name = data.name;
      this.description = data.description;
      this.isCore = data.isCore ?? false;
      if (data.createdAt) this.setCreatedAt(data.createdAt);
    } else {
      this.key = '';
      this.name = '';
      this.isCore = false;
    }
  }

  protected generateId(): string {
    // Para módulos, el ID es el key
    return '';
  }

  public validate(): boolean {
    if (!this.key || this.key.trim().length === 0) {
      throw new Error('Key del módulo es requerido');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nombre del módulo es requerido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      key: this.key,
      name: this.name,
      description: this.description,
      isCore: this.isCore,
      createdAt: this.getCreatedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.key) {
      this.key = data.key;
      this.setId(data.key);
    }
    if (data.name) this.name = data.name;
    if (data.description !== undefined) this.description = data.description;
    if (data.isCore !== undefined) this.isCore = data.isCore;
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
  }

  // Getters
  public getKey(): string {
    return this.key;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getIsCore(): boolean {
    return this.isCore;
  }

  // Setters
  public setKey(key: string): void {
    if (!key || key.trim().length === 0) {
      throw new Error('Key del módulo es requerido');
    }
    this.key = key;
    this.setId(key);
    this.setUpdatedAt(new Date());
  }

  public setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nombre del módulo es requerido');
    }
    this.name = name;
    this.setUpdatedAt(new Date());
  }

  public setDescription(description: string | undefined): void {
    this.description = description;
    this.setUpdatedAt(new Date());
  }

  public setIsCore(isCore: boolean): void {
    this.isCore = isCore;
    this.setUpdatedAt(new Date());
  }
}

