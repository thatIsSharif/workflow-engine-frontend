"use client";

import ModuleList from "@/components/ModuleList";

export default function NOCListPage() {
  return (
    <ModuleList
      entity="NOC"
      title="NOC"
      description="No Objection Certificate applications"
      columns={[
        { key: "applicant_name", label: "Applicant" },
        { key: "purpose", label: "Purpose" },
        { key: "property_address", label: "Property" },
      ]}
    />
  );
}
