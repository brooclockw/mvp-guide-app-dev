/**
 * Modelo de Favorito
 * Representa un evento marcado como favorito por un usuario
 */
export class Favorite {
  private userId: string;
  private eventId: string;
  private addedAt: Date;

  constructor(data: {
    userId: string;
    eventId: string;
    addedAt?: Date;
  }) {
    this.userId = data.userId;
    this.eventId = data.eventId;
    this.addedAt = data.addedAt || new Date();
  }

  public validate(): boolean {
    if (!this.userId) {
      throw new Error('User ID es requerido');
    }
    if (!this.eventId) {
      throw new Error('Event ID es requerido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      userId: this.userId,
      eventId: this.eventId,
      addedAt: this.addedAt,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.userId) this.userId = data.userId;
    if (data.eventId) this.eventId = data.eventId;
    if (data.addedAt) this.addedAt = new Date(data.addedAt);
  }

  // Getters
  public getUserId(): string {
    return this.userId;
  }

  public getEventId(): string {
    return this.eventId;
  }

  public getAddedAt(): Date {
    return this.addedAt;
  }
}

