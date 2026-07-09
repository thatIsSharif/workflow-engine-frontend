export type EntityType = "NOC" | "LOA" | "FINANCE" | "RENTAL" | "CANCELLATION";

export type ModuleSlug = "noc" | "loa" | "finance" | "rental" | "cancellation";

export interface User {
  id: number;
  name: string;
  role: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export interface DomainBase {
  id: string;
  status: string;
  version: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface NOC extends DomainBase {
  applicant_name: string;
  applicant_email: string;
  purpose: string;
  property_address: string;
  valid_from: string;
  valid_to: string;
}

export interface LOA extends DomainBase {
  applicant_name: string;
  applicant_email: string;
  authorized_person_name: string;
  authorized_person_id: string;
  scope_of_authorization: string;
  valid_from: string;
  valid_to: string;
}

export interface Finance extends DomainBase {
  applicant_name: string;
  department: string;
  amount: string;
  purpose: string;
  supporting_document_ref: string | null;
}

export interface Rental extends DomainBase {
  tenant_name: string;
  tenant_email: string;
  property_address: string;
  rental_amount: string;
  lease_start: string;
  lease_end: string;
}

export interface Cancellation extends DomainBase {
  applicant_name: string;
  reference_application_id: string;
  reference_application_type: string;
  reason: string;
}

export type DomainItem = NOC | LOA | Finance | Rental | Cancellation;

export interface EntityStatusCount {
  entity: string;
  status: string;
  count: number;
}

export interface DashboardSummary {
  by_entity: EntityStatusCount[];
}

export interface RecentActivityEntry {
  id: number;
  entity: string;
  entity_id: string;
  old_state: string;
  new_state: string;
  action: string;
  actioned_by: number | null;
  comment: string | null;
  timestamp: string;
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

export const MODULE_CONFIG: Record<ModuleSlug, { label: string; entity: EntityType; description: string; icon: string }> = {
  noc: { label: "NOC", entity: "NOC", description: "No Objection Certificate applications", icon: "FileCheck" },
  loa: { label: "LOA", entity: "LOA", description: "Letter of Authorization requests", icon: "FileText" },
  finance: { label: "Finance", entity: "FINANCE", description: "Finance request applications", icon: "DollarSign" },
  rental: { label: "Rental", entity: "RENTAL", description: "Rental contract applications", icon: "Home" },
  cancellation: { label: "Cancellation", entity: "CANCELLATION", description: "Cancellation requests", icon: "XCircle" },
};

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-300",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
  SUBMITTED: "bg-blue-100 text-blue-700 border-blue-300",
  IN_REVIEW: "bg-purple-100 text-purple-700 border-purple-300",
  APPROVED: "bg-green-100 text-green-700 border-green-300",
  REJECTED: "bg-red-100 text-red-700 border-red-300",
  REVERTED: "bg-orange-100 text-orange-700 border-orange-300",
  REQUESTED: "bg-yellow-100 text-yellow-700 border-yellow-300",
  CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-300",
  SIGNED: "bg-teal-100 text-teal-700 border-teal-300",
  CANCELLED: "bg-red-100 text-red-700 border-red-300",
};

export const STATUS_DOT_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-400",
  PENDING: "bg-yellow-400",
  SUBMITTED: "bg-blue-400",
  IN_REVIEW: "bg-purple-400",
  APPROVED: "bg-green-400",
  REJECTED: "bg-red-400",
  REVERTED: "bg-orange-400",
  REQUESTED: "bg-yellow-400",
  CONFIRMED: "bg-emerald-400",
  SIGNED: "bg-teal-400",
  CANCELLED: "bg-red-400",
};
