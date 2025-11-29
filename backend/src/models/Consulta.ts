import { BaseModel } from './BaseModel';

/**
 * Enum para el estado de la consulta
 */
export enum ConsultaStatus {
  PENDIENTE = 'pendiente',
  EN_PROCESO = 'en_proceso',
  RESUELTA = 'resuelta'
}

/**
 * Modelo de Consulta
 * Representa una consulta realizada por un usuario
 */
export class Consulta extends BaseModel {
  private nombre: string;
  private email: string;
  private telefono?: string;
  private asunto: string;
  private mensaje: string;
  private fecha: Date;
  private estado: ConsultaStatus;
  private empresa?: string;
  private respuesta?: string;
  private respondedorId?: string;
  private respondedorAt?: Date;

  constructor(data?: {
    id?: string;
    nombre: string;
    email: string;
    telefono?: string;
    asunto: string;
    mensaje: string;
    fecha?: Date | string;
    estado?: ConsultaStatus;
    empresa?: string;
    respuesta?: string;
    respondedorId?: string;
    respondedorAt?: Date | string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data?.id);
    
    if (data) {
      this.nombre = data.nombre;
      this.email = data.email;
      this.telefono = data.telefono;
      this.asunto = data.asunto;
      this.mensaje = data.mensaje;
      this.fecha = data.fecha 
        ? (data.fecha instanceof Date ? data.fecha : new Date(data.fecha))
        : new Date();
      this.estado = data.estado ?? ConsultaStatus.PENDIENTE;
      this.empresa = data.empresa;
      this.respuesta = data.respuesta;
      this.respondedorId = data.respondedorId;
      this.respondedorAt = data.respondedorAt 
        ? (data.respondedorAt instanceof Date ? data.respondedorAt : new Date(data.respondedorAt))
        : undefined;
      
      if (data.createdAt) this.setCreatedAt(data.createdAt);
      if (data.updatedAt) this.setUpdatedAt(data.updatedAt);
    } else {
      this.nombre = '';
      this.email = '';
      this.asunto = '';
      this.mensaje = '';
      this.fecha = new Date();
      this.estado = ConsultaStatus.PENDIENTE;
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
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('Nombre es requerido');
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Email inválido');
    }
    if (!this.asunto || this.asunto.trim().length === 0) {
      throw new Error('Asunto es requerido');
    }
    if (!this.mensaje || this.mensaje.trim().length === 0) {
      throw new Error('Mensaje es requerido');
    }
    if (!Object.values(ConsultaStatus).includes(this.estado)) {
      throw new Error('Estado de consulta inválido');
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
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      asunto: this.asunto,
      mensaje: this.mensaje,
      fecha: this.fecha,
      estado: this.estado,
      empresa: this.empresa,
      respuesta: this.respuesta,
      respondedorId: this.respondedorId,
      respondedorAt: this.respondedorAt,
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  public fromJSON(data: Record<string, any>): void {
    if (data.id) this.setId(data.id);
    if (data.nombre) this.nombre = data.nombre;
    if (data.email) this.email = data.email;
    if (data.telefono !== undefined) this.telefono = data.telefono;
    if (data.asunto) this.asunto = data.asunto;
    if (data.mensaje) this.mensaje = data.mensaje;
    if (data.fecha) this.fecha = new Date(data.fecha);
    if (data.estado) this.estado = data.estado as ConsultaStatus;
    if (data.empresa !== undefined) this.empresa = data.empresa;
    if (data.respuesta !== undefined) this.respuesta = data.respuesta;
    if (data.respondedorId !== undefined) this.respondedorId = data.respondedorId;
    if (data.respondedorAt) this.respondedorAt = new Date(data.respondedorAt);
    if (data.createdAt) this.setCreatedAt(new Date(data.createdAt));
    if (data.updatedAt) this.setUpdatedAt(new Date(data.updatedAt));
  }

  // Getters
  public getNombre(): string {
    return this.nombre;
  }

  public getEmail(): string {
    return this.email;
  }

  public getEstado(): ConsultaStatus {
    return this.estado;
  }

  // Métodos de negocio
  public responder(respondedorId: string, respuesta: string): void {
    this.respuesta = respuesta;
    this.respondedorId = respondedorId;
    this.respondedorAt = new Date();
    this.estado = ConsultaStatus.RESUELTA;
    this.setUpdatedAt(new Date());
  }

  public marcarEnProceso(): void {
    this.estado = ConsultaStatus.EN_PROCESO;
    this.setUpdatedAt(new Date());
  }

  public isPendiente(): boolean {
    return this.estado === ConsultaStatus.PENDIENTE;
  }

  public isResuelta(): boolean {
    return this.estado === ConsultaStatus.RESUELTA;
  }
}

