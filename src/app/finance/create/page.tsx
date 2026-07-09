import { ModuleCreate } from "@/components/applications/module-create";

const fields = [
  { name: "applicant_name", label: "Applicant Name", type: "text" },
  { name: "department", label: "Department", type: "text" },
  { name: "amount", label: "Amount", type: "number" },
  { name: "purpose", label: "Purpose", type: "textarea" },
  { name: "supporting_document_ref", label: "Supporting Document Ref", type: "text", required: false },
];

export default function FinanceCreatePage() { return <ModuleCreate module="finance" fields={fields} />; }
