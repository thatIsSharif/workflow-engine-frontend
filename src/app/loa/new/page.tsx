"use client";

import NewModule from "@/components/NewModule";

const fields = [
  { name: "applicant_name", label: "Applicant Name", type: "text" as const, required: true },
  { name: "applicant_email", label: "Applicant Email", type: "email" as const, required: true },
  { name: "authorized_person_name", label: "Authorized Person Name", type: "text" as const, required: true },
  { name: "authorized_person_id", label: "Authorized Person ID", type: "text" as const, required: true },
  { name: "scope_of_authorization", label: "Scope of Authorization", type: "textarea" as const, required: true },
  { name: "valid_from", label: "Valid From", type: "date" as const, required: true },
  { name: "valid_to", label: "Valid To", type: "date" as const, required: true },
];

export default function NewLOAPage() {
  return <NewModule entity="LOA" title="LOA" fields={fields} />;
}
