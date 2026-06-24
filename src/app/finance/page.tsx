"use client";

import ModuleList from "@/components/ModuleList";

export default function FinanceListPage() {
  return (
    <ModuleList
      entity="FINANCE"
      title="Finance"
      description="Financial requests and approvals"
      columns={[
        { key: "applicant_name", label: "Applicant" },
        { key: "department", label: "Department" },
        { key: "amount", label: "Amount", render: (v) => `$${parseFloat(v).toLocaleString()}` },
      ]}
    />
  );
}
