"use client";

import NewModule from "@/components/NewModule";

const fields = [
  { name: "tenant_name", label: "Tenant Name", type: "text" as const, required: true },
  { name: "tenant_email", label: "Tenant Email", type: "email" as const, required: true },
  { name: "property_address", label: "Property Address", type: "textarea" as const, required: true },
  { name: "rental_amount", label: "Rental Amount", type: "number" as const, required: true, min: 0 },
  { name: "lease_start", label: "Lease Start", type: "date" as const, required: true },
  { name: "lease_end", label: "Lease End", type: "date" as const, required: true },
];

export default function NewRentalPage() {
  return <NewModule entity="RENTAL" title="Rental" fields={fields} />;
}
