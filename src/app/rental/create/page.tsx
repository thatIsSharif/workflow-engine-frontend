import { ModuleCreate } from "@/components/applications/module-create";

const fields = [
  { name: "tenant_name", label: "Tenant Name", type: "text" },
  { name: "tenant_email", label: "Tenant Email", type: "email" },
  { name: "property_address", label: "Property Address", type: "textarea" },
  { name: "rental_amount", label: "Rental Amount", type: "number" },
  { name: "lease_start", label: "Lease Start", type: "date" },
  { name: "lease_end", label: "Lease End", type: "date" },
];

export default function RentalCreatePage() { return <ModuleCreate module="rental" fields={fields} />; }
