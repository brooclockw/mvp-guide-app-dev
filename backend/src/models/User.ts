import { BaseModel } from './BaseModel';

/**
 * Modelo de Usuario
 * Representa un usuario del sistema
 */
export class User extends BaseModel {
  private email: string;
  private passwordHash: string;
  private displayName?: string;
  private username?: string;
  private bio?: string;
  private avatarUrl?: string;
  private phone?: string;
  private isActive: boolean;
  private emailVerified: boolean;
  private emailVerifiedAt?: Date;

  constructor(data?: {
    id?: string;
    email: string;
    passwordHash: string;
    displayName?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
    phone?: string;
    isActive?: boolean;
    emailVerified?: boolean;
    emailVerifiedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data?.id);
    
    if (data) {
      this.email = data.email;
      this.passwordHash = data.passwordHash;
      this.displayName = data.displayName;
      this.username = data.username;
      this.bio = data.bio;
      this.avatarUrl = data.avatarUrl;
      this.phone = data.phone;
      this.isActive = data.isActive ?? true;
      this.emailVerified = data.emailVerified ?? false;
      this.emailVerifiedAt = data.emailVerifiedAt;
      
      if (data.createdAt) this.setCreatedAt(data.createdAt);
      if (data.updatedAt) this.setUpdatedAt(data.updatedAt);
    } else {
      this.email = '';
      this.passwordHash = '';
      this.isActive = true;
      this.emailVerified = false;
    }
  }

  protected generateId(): string {
    // UUID v4 generado (en producción usar librería uuid)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public validate(): boolean {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Email inválido');
    }
    if (!this.passwordHash || this.passwordHash.length < 8) {
      throw new Error('Password hash inválido');
    }
    if (this.username && !this.isValidUsername(this.username)) {
      throw new Error('Username inválido');
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  private isValidUsername(username: string): boolean {
    // Username debe tener entre 3 y 30 caracteres, solo letras, números y guiones bajos
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      email: this.email,
      displayName: this.displayName,
      username: this.username,
      bio: this.bio,
      avatarUrl: this.avatarUrl,
      phone: this.phone,
      isActive: this.isActive,
      emailVerified: this.emailVerified,
      emailVerifiedAt: this.emailVerifiedAt,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
      deletedAt: this.getDeletedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.email) this.email = data.email;
    if (data.passwordHash) this.passwordHash = data.passwordHash;
    if (data.displayName !== undefined) this.displayName = data.displayName;
    if (data.username !== undefined) this.username = data.username;
    if (data.bio !== undefined) this.bio = data.bio;
    if (data.avatarUrl !== undefined) this.avatarUrl = data.avatarUrl;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    if (data.emailVerified !== undefined) this.emailVerified = data.emailVerified;
    if (data.emailVerifiedAt) this.emailVerifiedAt = new Date(data.emailVerifiedAt);
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
    if (data.updatedAt) this.setUpdatedAt(new Date(data.updatedAt));
    if (data.deletedAt) this.setDeletedAt(new Date(data.deletedAt));
  }

  // Getters
  public getEmail(): string {
    return this.email;
  }

  public getDisplayName(): string | undefined {
    return this.displayName;
  }

  public getUsername(): string | undefined {
    return this.username;
  }

  public getBio(): string | undefined {
    return this.bio;
  }

  public getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  public getPhone(): string | undefined {
    return this.phone;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getEmailVerified(): boolean {
    return this.emailVerified;
  }

  public getEmailVerifiedAt(): Date | undefined {
    return this.emailVerifiedAt;
  }

  // Setters
  public setEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error('Email inválido');
    }
    this.email = email;
    this.setUpdatedAt(new Date());
  }

  public setPasswordHash(hash: string): void {
    if (hash.length < 8) {
      throw new Error('Password hash debe tener al menos 8 caracteres');
    }
    this.passwordHash = hash;
    this.setUpdatedAt(new Date());
  }

  public setDisplayName(name: string | undefined): void {
    this.displayName = name;
    this.setUpdatedAt(new Date());
  }

  public setUsername(username: string | undefined): void {
    if (username && !this.isValidUsername(username)) {
      throw new Error('Username inválido');
    }
    this.username = username;
    this.setUpdatedAt(new Date());
  }

  public setBio(bio: string | undefined): void {
    this.bio = bio;
    this.setUpdatedAt(new Date());
  }

  public setAvatarUrl(url: string | undefined): void {
    this.avatarUrl = url;
    this.setUpdatedAt(new Date());
  }

  public setPhone(phone: string | undefined): void {
    this.phone = phone;
    this.setUpdatedAt(new Date());
  }

  public setIsActive(active: boolean): void {
    this.isActive = active;
    this.setUpdatedAt(new Date());
  }

  public verifyEmail(): void {
    this.emailVerified = true;
    this.emailVerifiedAt = new Date();
    this.setUpdatedAt(new Date());
  }

  public unverifyEmail(): void {
    this.emailVerified = false;
    this.emailVerifiedAt = undefined;
    this.setUpdatedAt(new Date());
  }

  /**
   * Verifica la contraseña (en producción usar bcrypt)
   */
  public verifyPassword(password: string): boolean {
    // En producción, comparar con bcrypt
    return this.passwordHash === password;
  }
}

