import { BaseModel } from './BaseModel';

/**
 * Modelo de Categoría de Evento
 * Representa una categoría de evento (puede tener categorías padre)
 */
export class EventCategory extends BaseModel {
  private name: string;
  private parentId?: number;

  constructor(data?: {
    id?: number;
    name: string;
    parentId?: number;
  }) {
    super(data?.id);
    
    if (data) {
      this.name = data.name;
      this.parentId = data.parentId;
    } else {
      this.name = '';
    }
  }

  protected generateId(): number {
    return 0;
  }

  public validate(): boolean {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nombre de la categoría es requerido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      name: this.name,
      parentId: this.parentId,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.name) this.name = data.name;
    if (data.parentId !== undefined) this.parentId = data.parentId;
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  public getParentId(): number | undefined {
    return this.parentId;
  }

  // Setters
  public setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nombre de la categoría es requerido');
    }
    this.name = name;
    this.setUpdatedAt(new Date());
  }

  public setParentId(parentId: number | undefined): void {
    this.parentId = parentId;
    this.setUpdatedAt(new Date());
  }
}

