import { BaseModel } from './BaseModel';

/**
 * Modelo de País
 * Representa un país en el sistema
 */
export class Country extends BaseModel {
  private iso2: string;
  private name: string;

  constructor(data?: {
    iso2: string;
    name: string;
  }) {
    super(data?.iso2);
    
    if (data) {
      this.iso2 = data.iso2;
      this.name = data.name;
    } else {
      this.iso2 = '';
      this.name = '';
    }
  }

  protected generateId(): string {
    // Para países, el ID es el ISO2
    return '';
  }

  public validate(): boolean {
    if (!this.iso2 || this.iso2.length !== 2) {
      throw new Error('ISO2 debe tener exactamente 2 caracteres');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nombre del país es requerido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      iso2: this.iso2,
      name: this.name,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.iso2) {
      this.iso2 = data.iso2;
      this.setId(data.iso2);
    }
    if (data.name) this.name = data.name;
  }

  // Getters
  public getIso2(): string {
    return this.iso2;
  }

  public getName(): string {
    return this.name;
  }

  // Setters
  public setIso2(iso2: string): void {
    if (iso2.length !== 2) {
      throw new Error('ISO2 debe tener exactamente 2 caracteres');
    }
    this.iso2 = iso2;
    this.setId(iso2);
    this.setUpdatedAt(new Date());
  }

  public setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nombre del país es requerido');
    }
    this.name = name;
    this.setUpdatedAt(new Date());
  }
}

