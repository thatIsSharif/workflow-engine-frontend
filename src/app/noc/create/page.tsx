import { ModuleCreate } from "@/components/applications/module-create";

const fields = [
  { name: "applicant_name", label: "Applicant Name", type: "text" },
  { name: "applicant_email", label: "Applicant Email", type: "email" },
  { name: "purpose", label: "Purpose", type: "textarea" },
  { name: "property_address", label: "Property Address", type: "textarea" },
  { name: "valid_from", label: "Valid From", type: "date" },
  { name: "valid_to", label: "Valid To", type: "date" },
];

export default function NOCCreatePage() { return <ModuleCreate module="noc" fields={fields} />; }
