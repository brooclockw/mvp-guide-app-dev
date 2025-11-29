import { BaseModel } from './BaseModel';

/**
 * Enum para el estado del miembro de empresa
 */
export enum CompanyMemberStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  REMOVED = 'removed'
}

/**
 * Modelo de Miembro de Empresa
 * Representa la relación entre un usuario y una empresa
 */
export class CompanyMember {
  private companyId: string;
  private userId: string;
  private title?: string;
  private status: CompanyMemberStatus;
  private invitedAt?: Date;
  private joinedAt?: Date;

  constructor(data: {
    companyId: string;
    userId: string;
    title?: string;
    status?: CompanyMemberStatus;
    invitedAt?: Date;
    joinedAt?: Date;
  }) {
    this.companyId = data.companyId;
    this.userId = data.userId;
    this.title = data.title;
    this.status = data.status ?? CompanyMemberStatus.INVITED;
    this.invitedAt = data.invitedAt;
    this.joinedAt = data.joinedAt;
  }

  public validate(): boolean {
    if (!this.companyId) {
      throw new Error('Company ID es requerido');
    }
    if (!this.userId) {
      throw new Error('User ID es requerido');
    }
    if (!Object.values(CompanyMemberStatus).includes(this.status)) {
      throw new Error('Estado inválido');
    }
    return true;
  }

  public toJSON(): Record<string, any> {
    return {
      companyId: this.companyId,
      userId: this.userId,
      title: this.title,
      status: this.status,
      invitedAt: this.invitedAt,
      joinedAt: this.joinedAt,
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.companyId) this.companyId = data.companyId;
    if (data.userId) this.userId = data.userId;
    if (data.title !== undefined) this.title = data.title;
    if (data.status) this.status = data.status as CompanyMemberStatus;
    if (data.invitedAt) this.invitedAt = new Date(data.invitedAt);
    if (data.joinedAt) this.joinedAt = new Date(data.joinedAt);
  }

  // Getters
  public getCompanyId(): string {
    return this.companyId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getTitle(): string | undefined {
    return this.title;
  }

  public getStatus(): CompanyMemberStatus {
    return this.status;
  }

  public getInvitedAt(): Date | undefined {
    return this.invitedAt;
  }

  public getJoinedAt(): Date | undefined {
    return this.joinedAt;
  }

  // Setters
  public setTitle(title: string | undefined): void {
    this.title = title;
  }

  public setStatus(status: CompanyMemberStatus): void {
    if (!Object.values(CompanyMemberStatus).includes(status)) {
      throw new Error('Estado inválido');
    }
    this.status = status;
    
    // Si se activa, establecer joinedAt
    if (status === CompanyMemberStatus.ACTIVE && !this.joinedAt) {
      this.joinedAt = new Date();
    }
  }

  public invite(): void {
    this.status = CompanyMemberStatus.INVITED;
    this.invitedAt = new Date();
  }

  public activate(): void {
    this.setStatus(CompanyMemberStatus.ACTIVE);
    if (!this.joinedAt) {
      this.joinedAt = new Date();
    }
  }

  public remove(): void {
    this.status = CompanyMemberStatus.REMOVED;
  }

  public isActive(): boolean {
    return this.status === CompanyMemberStatus.ACTIVE;
  }
}

