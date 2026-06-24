"use client";

import NewModule from "@/components/NewModule";

const fields = [
  { name: "applicant_name", label: "Applicant Name", type: "text" as const, required: true },
  { name: "applicant_email", label: "Applicant Email", type: "email" as const, required: true },
  { name: "purpose", label: "Purpose", type: "textarea" as const, required: true },
  { name: "property_address", label: "Property Address", type: "textarea" as const, required: true },
  { name: "valid_from", label: "Valid From", type: "date" as const, required: true },
  { name: "valid_to", label: "Valid To", type: "date" as const, required: true },
];

export default function NewNOCPage() {
  return <NewModule entity="NOC" title="NOC" fields={fields} />;
}
