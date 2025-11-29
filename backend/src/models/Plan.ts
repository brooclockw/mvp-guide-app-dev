import { BaseModel } from './BaseModel';

/**
 * Modelo de Plan
 * Representa un plan de suscripción
 */
export class Plan extends BaseModel {
  private name: string;
  private tier?: string;
  private priceCents: number;
  private currency: string;
  private periodMonths: number;
  private isActive: boolean;

  constructor(data?: {
    id?: number;
    name: string;
    tier?: string;
    priceCents?: number;
    currency?: string;
    periodMonths?: number;
    isActive?: boolean;
    createdAt?: Date;
  }) {
    super(data?.id);
    
    if (data) {
      this.name = data.name;
      this.tier = data.tier;
      this.priceCents = data.priceCents ?? 0;
      this.currency = data.currency ?? 'USD';
      this.periodMonths = data.periodMonths ?? 1;
      this.isActive = data.isActive ?? true;
      if (data.createdAt) this.setCreatedAt(data.createdAt);
    } else {
      this.name = '';
      this.priceCents = 0;
      this.currency = 'USD';
      this.periodMonths = 1;
      this.isActive = true;
    }
  }

  protected generateId(): number {
    return 0;
  }

  public validate(): boolean {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Nombre del plan es requerido');
    }
    if (this.priceCents < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    if (this.currency.length !== 3) {
      throw new Error('La moneda debe tener 3 caracteres (ej: USD)');
    }
    if (this.periodMonths < 1) {
      throw new Error('El período debe ser al menos 1 mes');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      name: this.name,
      tier: this.tier,
      priceCents: this.priceCents,
      currency: this.currency,
      periodMonths: this.periodMonths,
      isActive: this.isActive,
      createdAt: this.getCreatedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.name) this.name = data.name;
    if (data.tier !== undefined) this.tier = data.tier;
    if (data.priceCents !== undefined) this.priceCents = data.priceCents;
    if (data.currency) this.currency = data.currency;
    if (data.periodMonths !== undefined) this.periodMonths = data.periodMonths;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
  }

  // Getters
  public getName(): string {
    return this.name;
  }

  public getTier(): string | undefined {
    return this.tier;
  }

  public getPriceCents(): number {
    return this.priceCents;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getPeriodMonths(): number {
    return this.periodMonths;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  // Setters
  public setName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Nombre del plan es requerido');
    }
    this.name = name;
    this.setUpdatedAt(new Date());
  }

  public setTier(tier: string | undefined): void {
    this.tier = tier;
    this.setUpdatedAt(new Date());
  }

  public setPriceCents(priceCents: number): void {
    if (priceCents < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    this.priceCents = priceCents;
    this.setUpdatedAt(new Date());
  }

  public setCurrency(currency: string): void {
    if (currency.length !== 3) {
      throw new Error('La moneda debe tener 3 caracteres');
    }
    this.currency = currency.toUpperCase();
    this.setUpdatedAt(new Date());
  }

  public setPeriodMonths(periodMonths: number): void {
    if (periodMonths < 1) {
      throw new Error('El período debe ser al menos 1 mes');
    }
    this.periodMonths = periodMonths;
    this.setUpdatedAt(new Date());
  }

  public activate(): void {
    this.isActive = true;
    this.setUpdatedAt(new Date());
  }

  public deactivate(): void {
    this.isActive = false;
    this.setUpdatedAt(new Date());
  }
}

