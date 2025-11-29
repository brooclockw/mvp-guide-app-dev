/**
 * Modelo de Mapeo Plan-Característica
 * Representa la relación entre un plan y una característica con su valor
 */
export class PlanFeatureMap {
  private planId: number;
  private featureId: number;
  private value?: string;

  constructor(data: {
    planId: number;
    featureId: number;
    value?: string;
  }) {
    this.planId = data.planId;
    this.featureId = data.featureId;
    this.value = data.value;
  }

  public validate(): boolean {
    if (!this.planId || this.planId <= 0) {
      throw new Error('Plan ID es requerido');
    }
    if (!this.featureId || this.featureId <= 0) {
      throw new Error('Feature ID es requerido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      planId: this.planId,
      featureId: this.featureId,
      value: this.value,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.planId) this.planId = data.planId;
    if (data.featureId) this.featureId = data.featureId;
    if (data.value !== undefined) this.value = data.value;
  }

  // Getters
  public getPlanId(): number {
    return this.planId;
  }

  public getFeatureId(): number {
    return this.featureId;
  }

  public getValue(): string | undefined {
    return this.value;
  }

  // Setters
  public setPlanId(planId: number): void {
    if (!planId || planId <= 0) {
      throw new Error('Plan ID debe ser un número positivo');
    }
    this.planId = planId;
  }

  public setFeatureId(featureId: number): void {
    if (!featureId || featureId <= 0) {
      throw new Error('Feature ID debe ser un número positivo');
    }
    this.featureId = featureId;
  }

  public setValue(value: string | undefined): void {
    this.value = value;
  }
}

