/**
 * Clase base abstracta para todos los modelos del sistema
 * Implementa funcionalidad común y define la interfaz que deben seguir todos los modelos
 */
export abstract class BaseModel {
  protected id: string | number;
  protected createdAt: Date;
  protected updatedAt: Date;
  protected deletedAt?: Date;

  constructor(id?: string | number) {
    this.id = id || this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Genera un ID único para el modelo
   */
  protected abstract generateId(): string | number;

  /**
   * Valida los datos del modelo antes de persistir
   */
  public abstract validate(): boolean;

  /**
   * Convierte el modelo a un objeto plano para serialización
   */
  public abstract toJSON(): Record<string, any>;

  /**
   * Carga datos desde un objeto plano
   */
  public abstract fromJSON(data: Record<string, any>): void;

  // Getters
  public getId(): string | number {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getDeletedAt(): Date | undefined {
    return this.deletedAt;
  }

  // Setters
  public setId(id: string | number): void {
    this.id = id;
  }

  public setCreatedAt(date: Date): void {
    this.createdAt = date;
  }

  public setUpdatedAt(date: Date): void {
    this.updatedAt = date;
  }

  public setDeletedAt(date: Date | undefined): void {
    this.deletedAt = date;
  }

  /**
   * Marca el modelo como eliminado (soft delete)
   */
  public softDelete(): void {
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Verifica si el modelo está eliminado
   */
  public isDeleted(): boolean {
    return this.deletedAt !== undefined;
  }

  /**
   * Restaura un modelo eliminado
   */
  public restore(): void {
    this.deletedAt = undefined;
    this.updatedAt = new Date();
  }
}

