import { BaseModel } from './BaseModel';

/**
 * Modelo de Tag de Evento
 * Representa un tag que puede asociarse a eventos
 */
export class EventTag extends BaseModel {
  private name: string;

  constructor(data?: {
    id?: number;
    name: string;
  }) {
    super(data?.id);
    
    if (data) {
      this.name = data.name;
    } else {
      this.name = '';
    }
  }

  protected generateId(): number {
    return 0;
  }

  public validate(): boolean {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nombre del tag es requerido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      name: this.name,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.name) this.name = data.name;
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  // Setters
  public setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nombre del tag es requerido');
    }
    this.name = name;
    this.setUpdatedAt(new Date());
  }
}

