import { BaseModel } from './BaseModel';

/**
 * Enum para el estado de la adhesión
 */
export enum AdhesionStatus {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada'
}

/**
 * Modelo de Adhesión
 * Representa una solicitud de adhesión de una empresa
 */
export class Adhesion extends BaseModel {
  private nombreEmpresa: string;
  private razonSocial: string;
  private cuit: string;
  private email: string;
  private telefono: string;
  private fechaSolicitud: Date;
  private estado: AdhesionStatus;
  private documentos?: string[];
  private aprobadaPor?: string;
  private aprobadaAt?: Date;
  private rechazadaPor?: string;
  private rechazadaAt?: Date;
  private motivoRechazo?: string;

  constructor(data?: {
    id?: string;
    nombreEmpresa: string;
    razonSocial: string;
    cuit: string;
    email: string;
    telefono: string;
    fechaSolicitud?: Date | string;
    estado?: AdhesionStatus;
    documentos?: string[];
    aprobadaPor?: string;
    aprobadaAt?: Date | string;
    rechazadaPor?: string;
    rechazadaAt?: Date | string;
    motivoRechazo?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data?.id);
    
    if (data) {
      this.nombreEmpresa = data.nombreEmpresa;
      this.razonSocial = data.razonSocial;
      this.cuit = data.cuit;
      this.email = data.email;
      this.telefono = data.telefono;
      this.fechaSolicitud = data.fechaSolicitud 
        ? (data.fechaSolicitud instanceof Date ? data.fechaSolicitud : new Date(data.fechaSolicitud))
        : new Date();
      this.estado = data.estado ?? AdhesionStatus.PENDIENTE;
      this.documentos = data.documentos;
      this.aprobadaPor = data.aprobadaPor;
      this.aprobadaAt = data.aprobadaAt 
        ? (data.aprobadaAt instanceof Date ? data.aprobadaAt : new Date(data.aprobadaAt))
        : undefined;
      this.rechazadaPor = data.rechazadaPor;
      this.rechazadaAt = data.rechazadaAt 
        ? (data.rechazadaAt instanceof Date ? data.rechazadaAt : new Date(data.rechazadaAt))
        : undefined;
      this.motivoRechazo = data.motivoRechazo;
      
      if (data.createdAt) this.setCreatedAt(data.createdAt);
      if (data.updatedAt) this.setUpdatedAt(data.updatedAt);
    } else {
      this.nombreEmpresa = '';
      this.razonSocial = '';
      this.cuit = '';
      this.email = '';
      this.telefono = '';
      this.fechaSolicitud = new Date();
      this.estado = AdhesionStatus.PENDIENTE;
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
    if (!this.nombreEmpresa || this.nombreEmpresa.trim().length === 0) {
      throw new Error('Nombre de empresa es requerido');
    }
    if (!this.razonSocial || this.razonSocial.trim().length === 0) {
      throw new Error('Razón social es requerida');
    }
    if (!this.cuit || this.cuit.trim().length === 0) {
      throw new Error('CUIT es requerido');
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Email inválido');
    }
    if (!this.telefono || this.telefono.trim().length === 0) {
      throw new Error('Teléfono es requerido');
    }
    if (!Object.values(AdhesionStatus).includes(this.estado)) {
      throw new Error('Estado de adhesión inválido');
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  public toJSON(): Record<string, any> {
    return {
      id: this.getId(),
      nombreEmpresa: this.nombreEmpresa,
      razonSocial: this.razonSocial,
      cuit: this.cuit,
      email: this.email,
      telefono: this.telefono,
      fechaSolicitud: this.fechaSolicitud,
      estado: this.estado,
      documentos: this.documentos,
      aprobadaPor: this.aprobadaPor,
      aprobadaAt: this.aprobadaAt,
      rechazadaPor: this.rechazadaPor,
      rechazadaAt: this.rechazadaAt,
      motivoRechazo: this.motivoRechazo,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.nombreEmpresa) this.nombreEmpresa = data.nombreEmpresa;
    if (data.razonSocial) this.razonSocial = data.razonSocial;
    if (data.cuit) this.cuit = data.cuit;
    if (data.email) this.email = data.email;
    if (data.telefono) this.telefono = data.telefono;
    if (data.fechaSolicitud) this.fechaSolicitud = new Date(data.fechaSolicitud);
    if (data.estado) this.estado = data.estado as AdhesionStatus;
    if (data.documentos) this.documentos = data.documentos;
    if (data.aprobadaPor) this.aprobadaPor = data.aprobadaPor;
    if (data.aprobadaAt) this.aprobadaAt = new Date(data.aprobadaAt);
    if (data.rechazadaPor) this.rechazadaPor = data.rechazadaPor;
    if (data.rechazadaAt) this.rechazadaAt = new Date(data.rechazadaAt);
    if (data.motivoRechazo) this.motivoRechazo = data.motivoRechazo;
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
    if (data.updatedAt) this.setUpdatedAt(new Date(data.updatedAt));
  }

  // Getters
  public getNombreEmpresa(): string {
    return this.nombreEmpresa;
  }

  public getRazonSocial(): string {
    return this.razonSocial;
  }

  public getCuit(): string {
    return this.cuit;
  }

  public getEmail(): string {
    return this.email;
  }

  public getTelefono(): string {
    return this.telefono;
  }

  public getEstado(): AdhesionStatus {
    return this.estado;
  }

  // Métodos de negocio
  public aprobar(aprobadaPor: string): void {
    this.estado = AdhesionStatus.APROBADA;
    this.aprobadaPor = aprobadaPor;
    this.aprobadaAt = new Date();
    this.setUpdatedAt(new Date());
  }

  public rechazar(rechazadaPor: string, motivoRechazo: string): void {
    this.estado = AdhesionStatus.RECHAZADA;
    this.rechazadaPor = rechazadaPor;
    this.rechazadaAt = new Date();
    this.motivoRechazo = motivoRechazo;
    this.setUpdatedAt(new Date());
  }

  public isPendiente(): boolean {
    return this.estado === AdhesionStatus.PENDIENTE;
  }

  public isAprobada(): boolean {
    return this.estado === AdhesionStatus.APROBADA;
  }

  public isRechazada(): boolean {
    return this.estado === AdhesionStatus.RECHAZADA;
  }
}

