import { BaseModel } from './BaseModel';

/**
 * Enum para el estado de la review
 */
export enum ReviewStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
  REPORTED = 'reported'
}

/**
 * Modelo de Review
 * Representa una reseña de un evento
 */
export class Review extends BaseModel {
  private eventId: string;
  private userId: string;
  private rating: number;
  private title?: string;
  private body?: string;
  private status: ReviewStatus;
  private helpfulCount: number;

  constructor(data?: {
    id?: string;
    eventId: string;
    userId: string;
    rating: number;
    title?: string;
    body?: string;
    status?: ReviewStatus;
    helpfulCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data?.id);
    
    if (data) {
      this.eventId = data.eventId;
      this.userId = data.userId;
      this.rating = data.rating;
      this.title = data.title;
      this.body = data.body;
      this.status = data.status ?? ReviewStatus.PUBLISHED;
      this.helpfulCount = data.helpfulCount ?? 0;
      
      if (data.createdAt) this.setCreatedAt(data.createdAt);
      if (data.updatedAt) this.setUpdatedAt(data.updatedAt);
    } else {
      this.eventId = '';
      this.userId = '';
      this.rating = 0;
      this.status = ReviewStatus.PUBLISHED;
      this.helpfulCount = 0;
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
    if (this.rating < 1 || this.rating > 5) {
      throw new Error('Rating debe estar entre 1 y 5');
    }
    if (!Object.values(ReviewStatus).includes(this.status)) {
      throw new Error('Estado de review inválido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      eventId: this.eventId,
      userId: this.userId,
      rating: this.rating,
      title: this.title,
      body: this.body,
      status: this.status,
      helpfulCount: this.helpfulCount,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.eventId) this.eventId = data.eventId;
    if (data.userId) this.userId = data.userId;
    if (data.rating !== undefined) this.rating = data.rating;
    if (data.title !== undefined) this.title = data.title;
    if (data.body !== undefined) this.body = data.body;
    if (data.status) this.status = data.status as ReviewStatus;
    if (data.helpfulCount !== undefined) this.helpfulCount = data.helpfulCount;
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
    if (data.updatedAt) this.setUpdatedAt(new Date(data.updatedAt));
  }

  // Getters
  public getEventId(): string {
    return this.eventId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getRating(): number {
    return this.rating;
  }

  public getTitle(): string | undefined {
    return this.title;
  }

  public getBody(): string | undefined {
    return this.body;
  }

  public getStatus(): ReviewStatus {
    return this.status;
  }

  public getHelpfulCount(): number {
    return this.helpfulCount;
  }

  // Setters
  public setRating(rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating debe estar entre 1 y 5');
    }
    this.rating = rating;
    this.setUpdatedAt(new Date());
  }

  public setTitle(title: string | undefined): void {
    this.title = title;
    this.setUpdatedAt(new Date());
  }

  public setBody(body: string | undefined): void {
    this.body = body;
    this.setUpdatedAt(new Date());
  }

  public setStatus(status: ReviewStatus): void {
    if (!Object.values(ReviewStatus).includes(status)) {
      throw new Error('Estado de review inválido');
    }
    this.status = status;
    this.setUpdatedAt(new Date());
  }

  public publish(): void {
    this.setStatus(ReviewStatus.PUBLISHED);
  }

  public hide(): void {
    this.setStatus(ReviewStatus.HIDDEN);
  }

  public incrementHelpfulCount(): void {
    this.helpfulCount++;
    this.setUpdatedAt(new Date());
  }

  public decrementHelpfulCount(): void {
    if (this.helpfulCount > 0) {
      this.helpfulCount--;
      this.setUpdatedAt(new Date());
    }
  }
}

