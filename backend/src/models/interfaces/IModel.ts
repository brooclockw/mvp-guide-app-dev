/**
 * Interfaz base para todos los modelos del sistema
 */
export interface IModel {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  validate(): boolean;
  toJSON(): Record<string, any>;
  fromJSON(data: Record<string, any>): void;
}

/**
 * Interfaz para modelos que pueden ser eliminados suavemente
 */
export interface ISoftDeletable {
  deletedAt?: Date;
  softDelete(): void;
  restore(): void;
  isDeleted(): boolean;
}

/**
 * Interfaz para modelos con auditoría
 */
export interface IAuditable {
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

