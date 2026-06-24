"use client";

import ModuleList from "@/components/ModuleList";

export default function CancellationListPage() {
  return (
    <ModuleList
      entity="CANCELLATION"
      title="Cancellation"
      description="Cancellation requests"
      columns={[
        { key: "applicant_name", label: "Applicant" },
        { key: "reference_application_id", label: "Reference ID" },
        { key: "reference_application_type", label: "Reference Type" },
      ]}
    />
  );
}
