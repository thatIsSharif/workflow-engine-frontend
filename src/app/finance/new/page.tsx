"use client";

import NewModule from "@/components/NewModule";

const fields = [
  { name: "applicant_name", label: "Applicant Name", type: "text" as const, required: true },
  { name: "department", label: "Department", type: "text" as const, required: true },
  { name: "amount", label: "Amount", type: "number" as const, required: true, min: 0 },
  { name: "purpose", label: "Purpose", type: "textarea" as const, required: true },
  { name: "supporting_document_ref", label: "Supporting Document Ref", type: "text" as const },
];

export default function NewFinancePage() {
  return <NewModule entity="FINANCE" title="Finance" fields={fields} />;
}
