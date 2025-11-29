import { BaseModel } from './BaseModel';

/**
 * Modelo de Permiso
 * Representa un permiso en el sistema
 */
export class Permission extends BaseModel {
  private code: string;
  private description?: string;

  constructor(data?: {
    id?: number;
    code: string;
    description?: string;
  }) {
    super(data?.id);
    
    if (data) {
      this.code = data.code;
      this.description = data.description;
    } else {
      this.code = '';
    }
  }

  protected generateId(): number {
    // ID auto-incremental manejado por la BD
    return 0;
  }

  public validate(): boolean {
    if (!this.code || this.code.trim().length === 0) {
      throw new Error('Código del permiso es requerido');
    }
    // Validar formato del código (ej: 'events.create')
    if (!/^[a-z_]+\.[a-z_]+$/.test(this.code)) {
      throw new Error('Código del permiso debe tener formato: modulo.accion');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      code: this.code,
      description: this.description,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.code) this.code = data.code;
    if (data.description !== undefined) this.description = data.description;
  }

  // Getters
  public getCode(): string {
    return this.code;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  // Setters
  public setCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new Error('Código del permiso es requerido');
    }
    if (!/^[a-z_]+\.[a-z_]+$/.test(code)) {
      throw new Error('Código del permiso debe tener formato: modulo.accion');
    }
    this.code = code;
    this.setUpdatedAt(new Date());
  }

  public setDescription(description: string | undefined): void {
    this.description = description;
    this.setUpdatedAt(new Date());
  }
}

