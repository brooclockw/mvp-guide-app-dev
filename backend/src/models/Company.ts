import { BaseModel } from './BaseModel';

/**
 * Enum para el estado de la empresa
 */
export enum CompanyStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

/**
 * Modelo de Empresa
 * Representa una empresa que organiza eventos
 */
export class Company extends BaseModel {
  private legalName?: string;
  private tradeName?: string;
  private taxId?: string;
  private website?: string;
  private email?: string;
  private phone?: string;
  private address?: string;
  private cityId?: number;
  private status: CompanyStatus;

  constructor(data?: {
    id?: string;
    legalName?: string;
    tradeName?: string;
    taxId?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    cityId?: number;
    status?: CompanyStatus;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    super(data?.id);
    
    if (data) {
      this.legalName = data.legalName;
      this.tradeName = data.tradeName;
      this.taxId = data.taxId;
      this.website = data.website;
      this.email = data.email;
      this.phone = data.phone;
      this.address = data.address;
      this.cityId = data.cityId;
      this.status = data.status ?? CompanyStatus.ACTIVE;
      
      if (data.createdAt) this.setCreatedAt(data.createdAt);
      if (data.updatedAt) this.setUpdatedAt(data.updatedAt);
      if (data.deletedAt) this.setDeletedAt(data.deletedAt);
    } else {
      this.status = CompanyStatus.ACTIVE;
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
    if (this.email && !this.isValidEmail(this.email)) {
      throw new Error('Email inválido');
    }
    if (this.website && !this.isValidUrl(this.website)) {
      throw new Error('URL de website inválida');
    }
    if (!Object.values(CompanyStatus).includes(this.status)) {
      throw new Error('Estado de empresa inválido');
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      legalName: this.legalName,
      tradeName: this.tradeName,
      taxId: this.taxId,
      website: this.website,
      email: this.email,
      phone: this.phone,
      address: this.address,
      cityId: this.cityId,
      status: this.status,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
      deletedAt: this.getDeletedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.legalName !== undefined) this.legalName = data.legalName;
    if (data.tradeName !== undefined) this.tradeName = data.tradeName;
    if (data.taxId !== undefined) this.taxId = data.taxId;
    if (data.website !== undefined) this.website = data.website;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
    if (data.cityId !== undefined) this.cityId = data.cityId;
    if (data.status) this.status = data.status as CompanyStatus;
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
    if (data.updatedAt) this.setUpdatedAt(new Date(data.updatedAt));
    if (data.deletedAt) this.setDeletedAt(new Date(data.deletedAt));
  }

  // Getters
  public getLegalName(): string | undefined {
    return this.legalName;
  }

  public getTradeName(): string | undefined {
    return this.tradeName;
  }

  public getTaxId(): string | undefined {
    return this.taxId;
  }

  public getWebsite(): string | undefined {
    return this.website;
  }

  public getEmail(): string | undefined {
    return this.email;
  }

  public getPhone(): string | undefined {
    return this.phone;
  }

  public getAddress(): string | undefined {
    return this.address;
  }

  public getCityId(): number | undefined {
    return this.cityId;
  }

  public getStatus(): CompanyStatus {
    return this.status;
  }

  // Setters
  public setLegalName(name: string | undefined): void {
    this.legalName = name;
    this.setUpdatedAt(new Date());
  }

  public setTradeName(name: string | undefined): void {
    this.tradeName = name;
    this.setUpdatedAt(new Date());
  }

  public setTaxId(taxId: string | undefined): void {
    this.taxId = taxId;
    this.setUpdatedAt(new Date());
  }

  public setWebsite(website: string | undefined): void {
    if (website && !this.isValidUrl(website)) {
      throw new Error('URL de website inválida');
    }
    this.website = website;
    this.setUpdatedAt(new Date());
  }

  public setEmail(email: string | undefined): void {
    if (email && !this.isValidEmail(email)) {
      throw new Error('Email inválido');
    }
    this.email = email;
    this.setUpdatedAt(new Date());
  }

  public setPhone(phone: string | undefined): void {
    this.phone = phone;
    this.setUpdatedAt(new Date());
  }

  public setAddress(address: string | undefined): void {
    this.address = address;
    this.setUpdatedAt(new Date());
  }

  public setCityId(cityId: number | undefined): void {
    this.cityId = cityId;
    this.setUpdatedAt(new Date());
  }

  public setStatus(status: CompanyStatus): void {
    if (!Object.values(CompanyStatus).includes(status)) {
      throw new Error('Estado inválido');
    }
    this.status = status;
    this.setUpdatedAt(new Date());
  }

  public suspend(): void {
    this.setStatus(CompanyStatus.SUSPENDED);
  }

  public activate(): void {
    this.setStatus(CompanyStatus.ACTIVE);
  }

  public isActive(): boolean {
    return this.status === CompanyStatus.ACTIVE && !this.isDeleted();
  }
}

