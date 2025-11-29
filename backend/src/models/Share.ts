import { BaseModel } from './BaseModel';

/**
 * Modelo de Compartir
 * Representa un enlace de compartir para un evento
 */
export class Share extends BaseModel {
  private eventId: string;
  private userId?: string;
  private channel?: string;
  private token: string;
  private usedCount: number;
  private maxUses?: number;
  private expiresAt?: Date;

  constructor(data?: {
    id?: string;
    eventId: string;
    userId?: string;
    channel?: string;
    token?: string;
    usedCount?: number;
    maxUses?: number;
    expiresAt?: Date | string;
    createdAt?: Date;
  }) {
    super(data?.id);
    
    if (data) {
      this.eventId = data.eventId;
      this.userId = data.userId;
      this.channel = data.channel;
      this.token = data.token || this.generateToken();
      this.usedCount = data.usedCount ?? 0;
      this.maxUses = data.maxUses;
      this.expiresAt = data.expiresAt 
        ? (data.expiresAt instanceof Date ? data.expiresAt : new Date(data.expiresAt))
        : undefined;
      if (data.createdAt) this.setCreatedAt(data.createdAt);
    } else {
      this.eventId = '';
      this.token = this.generateToken();
      this.usedCount = 0;
    }
  }

  protected generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  public validate(): boolean {
    if (!this.eventId) {
      throw new Error('Event ID es requerido');
    }
    if (!this.token || this.token.length === 0) {
      throw new Error('Token es requerido');
    }
    if (this.usedCount < 0) {
      throw new Error('El conteo de usos no puede ser negativo');
    }
    if (this.maxUses !== undefined && this.maxUses < 0) {
      throw new Error('El máximo de usos no puede ser negativo');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      eventId: this.eventId,
      userId: this.userId,
      channel: this.channel,
      token: this.token,
      usedCount: this.usedCount,
      maxUses: this.maxUses,
      expiresAt: this.expiresAt,
      createdAt: this.getCreatedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.eventId) this.eventId = data.eventId;
    if (data.userId !== undefined) this.userId = data.userId;
    if (data.channel !== undefined) this.channel = data.channel;
    if (data.token) this.token = data.token;
    if (data.usedCount !== undefined) this.usedCount = data.usedCount;
    if (data.maxUses !== undefined) this.maxUses = data.maxUses;
    if (data.expiresAt) this.expiresAt = new Date(data.expiresAt);
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
  }

  // Getters
  public getEventId(): string {
    return this.eventId;
  }

  public getToken(): string {
    return this.token;
  }

  public getUsedCount(): number {
    return this.usedCount;
  }

  public isExpired(): boolean {
    if (!this.expiresAt) return false;
    return this.expiresAt < new Date();
  }

  public isMaxUsesReached(): boolean {
    if (!this.maxUses) return false;
    return this.usedCount >= this.maxUses;
  }

  public canBeUsed(): boolean {
    return !this.isExpired() && !this.isMaxUsesReached();
  }

  public incrementUse(): void {
    this.usedCount++;
  }
}

