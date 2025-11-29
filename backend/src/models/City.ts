import { BaseModel } from './BaseModel';

/**
 * Modelo de Ciudad
 * Representa una ciudad en el sistema
 */
export class City extends BaseModel {
  private name: string;
  private country: string; // ISO2 del país

  constructor(data?: {
    id?: number;
    name: string;
    country: string;
  }) {
    super(data?.id);
    
    if (data) {
      this.name = data.name;
      this.country = data.country;
    } else {
      this.name = '';
      this.country = '';
    }
  }

  protected generateId(): number {
    // Para ciudades, el ID es auto-incremental (manejado por la BD)
    return 0;
  }

  public validate(): boolean {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nombre de la ciudad es requerido');
    }
    if (!this.country || this.country.length !== 2) {
      throw new Error('Código de país (ISO2) es requerido y debe tener 2 caracteres');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      name: this.name,
      country: this.country,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.name) this.name = data.name;
    if (data.country) this.country = data.country;
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  public getCountry(): string {
    return this.country;
  }

  // Setters
  public setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nombre de la ciudad es requerido');
    }
    this.name = name;
    this.setUpdatedAt(new Date());
  }

  public setCountry(country: string): void {
    if (!country || country.length !== 2) {
      throw new Error('Código de país (ISO2) debe tener 2 caracteres');
    }
    this.country = country;
    this.setUpdatedAt(new Date());
  }
}

