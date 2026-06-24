"use client";

import ModuleList from "@/components/ModuleList";

export default function RentalListPage() {
  return (
    <ModuleList
      entity="RENTAL"
      title="Rental"
      description="Rental agreements and leases"
      columns={[
        { key: "tenant_name", label: "Tenant" },
        { key: "property_address", label: "Property" },
        { key: "rental_amount", label: "Amount", render: (v) => `$${parseFloat(v).toLocaleString()}` },
      ]}
    />
  );
}
