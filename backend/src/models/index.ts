/**
 * Exportación centralizada de todos los modelos del sistema
 */

// Modelos base
export { BaseModel } from './BaseModel';
export * from './interfaces/IModel';

// Modelos de ubicación
export { Country } from './Country';
export { City } from './City';
export { Location } from './Location';

// Modelos de usuario y empresa
export { User } from './User';
export { Company, CompanyStatus } from './Company';
export { CompanyMember, CompanyMemberStatus } from './CompanyMember';

// Modelos de roles y permisos
export { Role, RoleScope } from './Role';
export { Permission } from './Permission';
export { RolePermission } from './RolePermission';
export { UserRoleGlobal } from './UserRoleGlobal';
export { UserRoleCompany } from './UserRoleCompany';

// Modelos de planes y suscripciones
export { Plan } from './Plan';
export { PlanFeature } from './PlanFeature';
export { PlanFeatureMap } from './PlanFeatureMap';
export { CompanySubscription, SubscriptionStatus } from './CompanySubscription';

// Modelos de módulos
export { Module } from './Module';

// Modelos de eventos
export { Event, EventVisibility } from './Event';
export { EventCategory } from './EventCategory';
export { EventTag } from './EventTag';
export { EventRegistration, RegistrationStatus } from './EventRegistration';

// Modelos de reviews
export { Review, ReviewStatus } from './Review';

// Modelos de favoritos y shares
export { Favorite } from './Favorite';
export { Share } from './Share';

// Modelos de adhesiones y consultas
export { Adhesion, AdhesionStatus } from './Adhesion';
export { Consulta, ConsultaStatus } from './Consulta';

