import { BaseModel } from './BaseModel';

/**
 * Modelo de Ubicación
 * Representa una ubicación donde se puede realizar un evento
 */
export class Location extends BaseModel {
  private venueName?: string;
  private address?: string;
  private cityId?: number;
  private latitude?: number;
  private longitude?: number;

  constructor(data?: {
    id?: string;
    venueName?: string;
    address?: string;
    cityId?: number;
    latitude?: number;
    longitude?: number;
  }) {
    super(data?.id);
    
    if (data) {
      this.venueName = data.venueName;
      this.address = data.address;
      this.cityId = data.cityId;
      this.latitude = data.latitude;
      this.longitude = data.longitude;
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
    if (this.latitude !== undefined) {
      if (this.latitude < -90 || this.latitude > 90) {
        throw new Error('Latitud debe estar entre -90 y 90');
      }
    }
    if (this.longitude !== undefined) {
      if (this.longitude < -180 || this.longitude > 180) {
        throw new Error('Longitud debe estar entre -180 y 180');
      }
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      venueName: this.venueName,
      address: this.address,
      cityId: this.cityId,
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.venueName !== undefined) this.venueName = data.venueName;
    if (data.address !== undefined) this.address = data.address;
    if (data.cityId !== undefined) this.cityId = data.cityId;
    if (data.latitude !== undefined) this.latitude = data.latitude;
    if (data.longitude !== undefined) this.longitude = data.longitude;
  }

  // Getters
  public getVenueName(): string | undefined {
    return this.venueName;
  }

  public getAddress(): string | undefined {
    return this.address;
  }

  public getCityId(): number | undefined {
    return this.cityId;
  }

  public getLatitude(): number | undefined {
    return this.latitude;
  }

  public getLongitude(): number | undefined {
    return this.longitude;
  }

  // Setters
  public setVenueName(venueName: string | undefined): void {
    this.venueName = venueName;
  }

  public setAddress(address: string | undefined): void {
    this.address = address;
  }

  public setCityId(cityId: number | undefined): void {
    this.cityId = cityId;
  }

  public setLatitude(latitude: number | undefined): void {
    if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
      throw new Error('Latitud debe estar entre -90 y 90');
    }
    this.latitude = latitude;
  }

  public setLongitude(longitude: number | undefined): void {
    if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
      throw new Error('Longitud debe estar entre -180 y 180');
    }
    this.longitude = longitude;
  }

  public setCoordinates(latitude: number, longitude: number): void {
    this.setLatitude(latitude);
    this.setLongitude(longitude);
  }
}

