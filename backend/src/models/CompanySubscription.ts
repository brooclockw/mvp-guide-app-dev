import { BaseModel } from './BaseModel';

/**
 * Enum para el estado de la suscripción
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  TRIALING = 'trialing'
}

/**
 * Modelo de Suscripción de Empresa
 * Representa la suscripción de una empresa a un plan
 */
export class CompanySubscription extends BaseModel {
  private companyId: string;
  private planId: number;
  private status: SubscriptionStatus;
  private currentPeriodStart: Date;
  private currentPeriodEnd: Date;
  private cancelAtPeriodEnd: boolean;

  constructor(data?: {
    id?: string;
    companyId: string;
    planId: number;
    status?: SubscriptionStatus;
    currentPeriodStart: Date | string;
    currentPeriodEnd: Date | string;
    cancelAtPeriodEnd?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data?.id);
    
    if (data) {
      this.companyId = data.companyId;
      this.planId = data.planId;
      this.status = data.status ?? SubscriptionStatus.ACTIVE;
      this.currentPeriodStart = data.currentPeriodStart instanceof Date 
        ? data.currentPeriodStart 
        : new Date(data.currentPeriodStart);
      this.currentPeriodEnd = data.currentPeriodEnd instanceof Date 
        ? data.currentPeriodEnd 
        : new Date(data.currentPeriodEnd);
      this.cancelAtPeriodEnd = data.cancelAtPeriodEnd ?? false;
      
      if (data.createdAt) this.setCreatedAt(data.createdAt);
      if (data.updatedAt) this.setUpdatedAt(data.updatedAt);
    } else {
      this.companyId = '';
      this.planId = 0;
      this.status = SubscriptionStatus.ACTIVE;
      this.currentPeriodStart = new Date();
      this.currentPeriodEnd = new Date();
      this.cancelAtPeriodEnd = false;
    }
  }

  protected generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public validate(): boolean {
    if (!this.companyId) {
      throw new Error('Company ID es requerido');
    }
    if (!this.planId || this.planId <= 0) {
      throw new Error('Plan ID es requerido');
    }
    if (!Object.values(SubscriptionStatus).includes(this.status)) {
      throw new Error('Estado de suscripción inválido');
    }
    if (this.currentPeriodEnd <= this.currentPeriodStart) {
      throw new Error('La fecha de fin del período debe ser posterior a la de inicio');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      companyId: this.companyId,
      planId: this.planId,
      status: this.status,
      currentPeriodStart: this.currentPeriodStart,
      currentPeriodEnd: this.currentPeriodEnd,
      cancelAtPeriodEnd: this.cancelAtPeriodEnd,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.companyId) this.companyId = data.companyId;
    if (data.planId) this.planId = data.planId;
    if (data.status) this.status = data.status as SubscriptionStatus;
    if (data.currentPeriodStart) this.currentPeriodStart = new Date(data.currentPeriodStart);
    if (data.currentPeriodEnd) this.currentPeriodEnd = new Date(data.currentPeriodEnd);
    if (data.cancelAtPeriodEnd !== undefined) this.cancelAtPeriodEnd = data.cancelAtPeriodEnd;
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
    if (data.updatedAt) this.setUpdatedAt(new Date(data.updatedAt));
  }

  // Getters
  public getCompanyId(): string {
    return this.companyId;
  }

  public getPlanId(): number {
    return this.planId;
  }

  public getStatus(): SubscriptionStatus {
    return this.status;
  }

  public getCurrentPeriodStart(): Date {
    return this.currentPeriodStart;
  }

  public getCurrentPeriodEnd(): Date {
    return this.currentPeriodEnd;
  }

  public getCancelAtPeriodEnd(): boolean {
    return this.cancelAtPeriodEnd;
  }

  // Setters
  public setStatus(status: SubscriptionStatus): void {
    if (!Object.values(SubscriptionStatus).includes(status)) {
      throw new Error('Estado de suscripción inválido');
    }
    this.status = status;
    this.setUpdatedAt(new Date());
  }

  public setCurrentPeriodStart(start: Date): void {
    if (this.currentPeriodEnd && start >= this.currentPeriodEnd) {
      throw new Error('La fecha de inicio debe ser anterior a la de fin');
    }
    this.currentPeriodStart = start;
    this.setUpdatedAt(new Date());
  }

  public setCurrentPeriodEnd(end: Date): void {
    if (end <= this.currentPeriodStart) {
      throw new Error('La fecha de fin debe ser posterior a la de inicio');
    }
    this.currentPeriodEnd = end;
    this.setUpdatedAt(new Date());
  }

  public cancel(): void {
    this.cancelAtPeriodEnd = true;
    this.setUpdatedAt(new Date());
  }

  public reactivate(): void {
    this.cancelAtPeriodEnd = false;
    this.setStatus(SubscriptionStatus.ACTIVE);
  }

  public isActive(): boolean {
    return this.status === SubscriptionStatus.ACTIVE && !this.cancelAtPeriodEnd;
  }

  public isExpired(): boolean {
    return this.currentPeriodEnd < new Date();
  }
}

