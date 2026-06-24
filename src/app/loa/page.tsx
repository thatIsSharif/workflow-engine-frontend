"use client";

import ModuleList from "@/components/ModuleList";

export default function LOAListPage() {
  return (
    <ModuleList
      entity="LOA"
      title="LOA"
      description="Letter of Authorization applications"
      columns={[
        { key: "applicant_name", label: "Applicant" },
        { key: "authorized_person_name", label: "Authorized Person" },
        { key: "scope_of_authorization", label: "Scope" },
      ]}
    />
  );
}
