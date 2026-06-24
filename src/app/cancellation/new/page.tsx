"use client";

import NewModule from "@/components/NewModule";

const fields = [
  { name: "applicant_name", label: "Applicant Name", type: "text" as const, required: true },
  { name: "reference_application_id", label: "Reference Application ID", type: "text" as const, required: true },
  { name: "reference_application_type", label: "Reference Application Type", type: "text" as const, required: true },
  { name: "reason", label: "Reason", type: "textarea" as const, required: true },
];

export default function NewCancellationPage() {
  return <NewModule entity="CANCELLATION" title="Cancellation" fields={fields} />;
}
