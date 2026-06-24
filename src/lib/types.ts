export type EntityType = "NOC" | "LOA" | "FINANCE" | "RENTAL" | "CANCELLATION";

export interface User {
  id: number;
  name: string;
  role: string;
}

export interface UserCreate {
  name: string;
  role: string;
}

export interface WorkflowHistoryEntry {
  id: number;
  entity: string;
  entity_id: string;
  old_state: string;
  new_state: string;
  action: string;
  submitter_id: number | null;
  actioned_by: number | null;
  comment: string | null;
  timestamp: string;
}

export interface ApplicationStatus {
  id: number;
  entity: string;
  entity_id: string;
  current_state: string;
  pending_roles: string;
  actioned_by: number | null;
  last_action: string | null;
  last_comment: string | null;
  submitted_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTransitionResponse {
  id: string;
  old_state: string;
  new_state: string;
  action: string;
  actioned_by: number;
  pending_roles: string[];
  comment: string | null;
}

// Domain entity types
export interface DomainEntityBase {
  id: string;
  status: string;
  version: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface NOCCreate {
  applicant_name: string;
  applicant_email: string;
  purpose: string;
  property_address: string;
  valid_from: string;
  valid_to: string;
}

export interface NOC extends DomainEntityBase, NOCCreate {}

export interface LOACreate {
  applicant_name: string;
  applicant_email: string;
  authorized_person_name: string;
  authorized_person_id: string;
  scope_of_authorization: string;
  valid_from: string;
  valid_to: string;
}

export interface LOA extends DomainEntityBase, LOACreate {}

export interface FinanceCreate {
  applicant_name: string;
  department: string;
  amount: number;
  purpose: string;
  supporting_document_ref?: string | null;
}

export interface Finance extends DomainEntityBase, FinanceCreate {}

export interface RentalCreate {
  tenant_name: string;
  tenant_email: string;
  property_address: string;
  rental_amount: number;
  lease_start: string;
  lease_end: string;
}

export interface Rental extends DomainEntityBase, RentalCreate {}

export interface CancellationCreate {
  applicant_name: string;
  reference_application_id: string;
  reference_application_type: string;
  reason: string;
}

export interface Cancellation extends DomainEntityBase, CancellationCreate {}

export type EntityData = NOC | LOA | Finance | Rental | Cancellation;
export type EntityCreate = NOCCreate | LOACreate | FinanceCreate | RentalCreate | CancellationCreate;

export const ENTITY_LABELS: Record<EntityType, string> = {
  NOC: "NOC",
  LOA: "LOA",
  FINANCE: "Finance",
  RENTAL: "Rental",
  CANCELLATION: "Cancellation",
};
