import { BaseModel } from './BaseModel';

/**
 * Enum para el estado de registro
 */
export enum RegistrationStatus {
  REGISTERED = 'registered',
  CONFIRMED = 'confirmed',
  ATTENDED = 'attended',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

/**
 * Modelo de Registro de Evento
 * Representa el registro de un usuario a un evento
 */
export class EventRegistration extends BaseModel {
  private eventId: string;
  private userId: string;
  private status: RegistrationStatus;
  private registeredAt: Date;
  private confirmedAt?: Date;
  private cancelledAt?: Date;
  private checkedInAt?: Date;
  private checkedInBy?: string;
  private notes?: string;
  private registrationSource?: string;
  private cancellationReason?: string;

  constructor(data?: {
    id?: string;
    eventId: string;
    userId: string;
    status?: RegistrationStatus;
    registeredAt?: Date | string;
    confirmedAt?: Date | string;
    cancelledAt?: Date | string;
    checkedInAt?: Date | string;
    checkedInBy?: string;
    notes?: string;
    registrationSource?: string;
    cancellationReason?: string;
  }) {
    super(data?.id);
    
    if (data) {
      this.eventId = data.eventId;
      this.userId = data.userId;
      this.status = data.status ?? RegistrationStatus.REGISTERED;
      this.registeredAt = data.registeredAt 
        ? (data.registeredAt instanceof Date ? data.registeredAt : new Date(data.registeredAt))
        : new Date();
      this.confirmedAt = data.confirmedAt 
        ? (data.confirmedAt instanceof Date ? data.confirmedAt : new Date(data.confirmedAt))
        : undefined;
      this.cancelledAt = data.cancelledAt 
        ? (data.cancelledAt instanceof Date ? data.cancelledAt : new Date(data.cancelledAt))
        : undefined;
      this.checkedInAt = data.checkedInAt 
        ? (data.checkedInAt instanceof Date ? data.checkedInAt : new Date(data.checkedInAt))
        : undefined;
      this.checkedInBy = data.checkedInBy;
      this.notes = data.notes;
      this.registrationSource = data.registrationSource;
      this.cancellationReason = data.cancellationReason;
    } else {
      this.eventId = '';
      this.userId = '';
      this.status = RegistrationStatus.REGISTERED;
      this.registeredAt = new Date();
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
    if (!this.eventId) {
      throw new Error('Event ID es requerido');
    }
    if (!this.userId) {
      throw new Error('User ID es requerido');
    }
    if (!Object.values(RegistrationStatus).includes(this.status)) {
      throw new Error('Estado de registro inválido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      eventId: this.eventId,
      userId: this.userId,
      status: this.status,
      registeredAt: this.registeredAt,
      confirmedAt: this.confirmedAt,
      cancelledAt: this.cancelledAt,
      checkedInAt: this.checkedInAt,
      checkedInBy: this.checkedInBy,
      notes: this.notes,
      registrationSource: this.registrationSource,
      cancellationReason: this.cancellationReason,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.eventId) this.eventId = data.eventId;
    if (data.userId) this.userId = data.userId;
    if (data.status) this.status = data.status as RegistrationStatus;
    if (data.registeredAt) this.registeredAt = new Date(data.registeredAt);
    if (data.confirmedAt) this.confirmedAt = new Date(data.confirmedAt);
    if (data.cancelledAt) this.cancelledAt = new Date(data.cancelledAt);
    if (data.checkedInAt) this.checkedInAt = new Date(data.checkedInAt);
    if (data.checkedInBy !== undefined) this.checkedInBy = data.checkedInBy;
    if (data.notes !== undefined) this.notes = data.notes;
    if (data.registrationSource !== undefined) this.registrationSource = data.registrationSource;
    if (data.cancellationReason !== undefined) this.cancellationReason = data.cancellationReason;
  }

  // Getters
  public getEventId(): string {
    return this.eventId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getStatus(): RegistrationStatus {
    return this.status;
  }

  public getRegisteredAt(): Date {
    return this.registeredAt;
  }

  public getConfirmedAt(): Date | undefined {
    return this.confirmedAt;
  }

  public getCancelledAt(): Date | undefined {
    return this.cancelledAt;
  }

  public getCheckedInAt(): Date | undefined {
    return this.checkedInAt;
  }

  public getCheckedInBy(): string | undefined {
    return this.checkedInBy;
  }

  // Métodos de negocio
  public confirm(): void {
    this.status = RegistrationStatus.CONFIRMED;
    this.confirmedAt = new Date();
  }

  public cancel(reason?: string): void {
    this.status = RegistrationStatus.CANCELLED;
    this.cancelledAt = new Date();
    if (reason) this.cancellationReason = reason;
  }

  public checkIn(checkedInBy: string): void {
    this.status = RegistrationStatus.ATTENDED;
    this.checkedInAt = new Date();
    this.checkedInBy = checkedInBy;
  }

  public markAsNoShow(): void {
    this.status = RegistrationStatus.NO_SHOW;
  }

  public isActive(): boolean {
    return this.status === RegistrationStatus.REGISTERED || 
           this.status === RegistrationStatus.CONFIRMED ||
           this.status === RegistrationStatus.ATTENDED;
  }
}

