import { BaseModel } from './BaseModel';

/**
 * Enum para la visibilidad del evento
 */
export enum EventVisibility {
  PUBLIC = 'public',
  UNLISTED = 'unlisted',
  PRIVATE = 'private'
}

/**
 * Modelo de Evento
 * Representa un evento organizado por una empresa
 */
export class Event extends BaseModel {
  private companyId: string;
  private title: string;
  private description?: string;
  private categoryId?: number;
  private locationId?: string;
  private startsAt: Date;
  private endsAt?: Date;
  private timezone?: string;
  private capacity?: number;
  private attendeeCount: number;
  private visibility: EventVisibility;
  private isPublished: boolean;
  private createdBy?: string;

  constructor(data?: {
    id?: string;
    companyId: string;
    title: string;
    description?: string;
    categoryId?: number;
    locationId?: string;
    startsAt: Date | string;
    endsAt?: Date | string;
    timezone?: string;
    capacity?: number;
    attendeeCount?: number;
    visibility?: EventVisibility;
    isPublished?: boolean;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data?.id);
    
    if (data) {
      this.companyId = data.companyId;
      this.title = data.title;
      this.description = data.description;
      this.categoryId = data.categoryId;
      this.locationId = data.locationId;
      this.startsAt = data.startsAt instanceof Date ? data.startsAt : new Date(data.startsAt);
      this.endsAt = data.endsAt ? (data.endsAt instanceof Date ? data.endsAt : new Date(data.endsAt)) : undefined;
      this.timezone = data.timezone;
      this.capacity = data.capacity;
      this.attendeeCount = data.attendeeCount ?? 0;
      this.visibility = data.visibility ?? EventVisibility.PUBLIC;
      this.isPublished = data.isPublished ?? false;
      this.createdBy = data.createdBy;
      
      if (data.createdAt) this.setCreatedAt(data.createdAt);
      if (data.updatedAt) this.setUpdatedAt(data.updatedAt);
    } else {
      this.companyId = '';
      this.title = '';
      this.attendeeCount = 0;
      this.visibility = EventVisibility.PUBLIC;
      this.isPublished = false;
      this.startsAt = new Date();
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
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Título es requerido');
    }
    if (this.title.length > 255) {
      throw new Error('Título no puede exceder 255 caracteres');
    }
    if (this.endsAt && this.endsAt <= this.startsAt) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }
    if (this.capacity !== undefined && this.capacity < 0) {
      throw new Error('La capacidad no puede ser negativa');
    }
    if (this.attendeeCount < 0) {
      throw new Error('El conteo de asistentes no puede ser negativo');
    }
    if (!Object.values(EventVisibility).includes(this.visibility)) {
      throw new Error('Visibilidad inválida');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      companyId: this.companyId,
      title: this.title,
      description: this.description,
      categoryId: this.categoryId,
      locationId: this.locationId,
      startsAt: this.startsAt,
      endsAt: this.endsAt,
      timezone: this.timezone,
      capacity: this.capacity,
      attendeeCount: this.attendeeCount,
      visibility: this.visibility,
      isPublished: this.isPublished,
      createdBy: this.createdBy,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
      deletedAt: this.getDeletedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.companyId) this.companyId = data.companyId;
    if (data.title) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.categoryId !== undefined) this.categoryId = data.categoryId;
    if (data.locationId !== undefined) this.locationId = data.locationId;
    if (data.startsAt) this.startsAt = new Date(data.startsAt);
    if (data.endsAt) this.endsAt = new Date(data.endsAt);
    if (data.timezone !== undefined) this.timezone = data.timezone;
    if (data.capacity !== undefined) this.capacity = data.capacity;
    if (data.attendeeCount !== undefined) this.attendeeCount = data.attendeeCount;
    if (data.visibility) this.visibility = data.visibility as EventVisibility;
    if (data.isPublished !== undefined) this.isPublished = data.isPublished;
    if (data.createdBy !== undefined) this.createdBy = data.createdBy;
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
    if (data.updatedAt) this.setUpdatedAt(new Date(data.updatedAt));
    if (data.deletedAt) this.setDeletedAt(new Date(data.deletedAt));
  }

  // Getters
  public getCompanyId(): string {
    return this.companyId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getDescription(): string | undefined {
    return this.description;
  }

  public getCategoryId(): number | undefined {
    return this.categoryId;
  }

  public getLocationId(): string | undefined {
    return this.locationId;
  }

  public getStartsAt(): Date {
    return this.startsAt;
  }

  public getEndsAt(): Date | undefined {
    return this.endsAt;
  }

  public getTimezone(): string | undefined {
    return this.timezone;
  }

  public getCapacity(): number | undefined {
    return this.capacity;
  }

  public getAttendeeCount(): number {
    return this.attendeeCount;
  }

  public getVisibility(): EventVisibility {
    return this.visibility;
  }

  public getIsPublished(): boolean {
    return this.isPublished;
  }

  public getCreatedBy(): string | undefined {
    return this.createdBy;
  }

  // Setters
  public setCompanyId(companyId: string): void {
    this.companyId = companyId;
    this.setUpdatedAt(new Date());
  }

  public setTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Título es requerido');
    }
    if (title.length > 255) {
      throw new Error('Título no puede exceder 255 caracteres');
    }
    this.title = title;
    this.setUpdatedAt(new Date());
  }

  public setDescription(description: string | undefined): void {
    this.description = description;
    this.setUpdatedAt(new Date());
  }

  public setCategoryId(categoryId: number | undefined): void {
    this.categoryId = categoryId;
    this.setUpdatedAt(new Date());
  }

  public setLocationId(locationId: string | undefined): void {
    this.locationId = locationId;
    this.setUpdatedAt(new Date());
  }

  public setStartsAt(startsAt: Date): void {
    if (this.endsAt && startsAt >= this.endsAt) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }
    this.startsAt = startsAt;
    this.setUpdatedAt(new Date());
  }

  public setEndsAt(endsAt: Date | undefined): void {
    if (endsAt && endsAt <= this.startsAt) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }
    this.endsAt = endsAt;
    this.setUpdatedAt(new Date());
  }

  public setTimezone(timezone: string | undefined): void {
    this.timezone = timezone;
    this.setUpdatedAt(new Date());
  }

  public setCapacity(capacity: number | undefined): void {
    if (capacity !== undefined && capacity < 0) {
      throw new Error('La capacidad no puede ser negativa');
    }
    this.capacity = capacity;
    this.setUpdatedAt(new Date());
  }

  public setAttendeeCount(count: number): void {
    if (count < 0) {
      throw new Error('El conteo de asistentes no puede ser negativo');
    }
    this.attendeeCount = count;
    this.setUpdatedAt(new Date());
  }

  public incrementAttendeeCount(): void {
    this.attendeeCount++;
    this.setUpdatedAt(new Date());
  }

  public decrementAttendeeCount(): void {
    if (this.attendeeCount > 0) {
      this.attendeeCount--;
      this.setUpdatedAt(new Date());
    }
  }

  public setVisibility(visibility: EventVisibility): void {
    if (!Object.values(EventVisibility).includes(visibility)) {
      throw new Error('Visibilidad inválida');
    }
    this.visibility = visibility;
    this.setUpdatedAt(new Date());
  }

  public publish(): void {
    this.isPublished = true;
    this.setUpdatedAt(new Date());
  }

  public unpublish(): void {
    this.isPublished = false;
    this.setUpdatedAt(new Date());
  }

  public setCreatedBy(userId: string | undefined): void {
    this.createdBy = userId;
    this.setUpdatedAt(new Date());
  }

  /**
   * Verifica si el evento está lleno
   */
  public isFull(): boolean {
    if (this.capacity === undefined) {
      return false;
    }
    return this.attendeeCount >= this.capacity;
  }

  /**
   * Verifica si hay espacios disponibles
   */
  public hasAvailableSpots(): boolean {
    return !this.isFull();
  }

  /**
   * Obtiene el número de espacios disponibles
   */
  public getAvailableSpots(): number | undefined {
    if (this.capacity === undefined) {
      return undefined;
    }
    return Math.max(0, this.capacity - this.attendeeCount);
  }

  /**
   * Verifica si el evento ya pasó
   */
  public isPast(): boolean {
    const now = new Date();
    return this.startsAt < now;
  }

  /**
   * Verifica si el evento está en curso
   */
  public isOngoing(): boolean {
    const now = new Date();
    return this.startsAt <= now && (this.endsAt === undefined || this.endsAt >= now);
  }

  /**
   * Verifica si el evento es futuro
   */
  public isUpcoming(): boolean {
    return this.startsAt > new Date();
  }
}

