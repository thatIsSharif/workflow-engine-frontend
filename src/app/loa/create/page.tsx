import { ModuleCreate } from "@/components/applications/module-create";

const fields = [
  { name: "applicant_name", label: "Applicant Name", type: "text" },
  { name: "applicant_email", label: "Applicant Email", type: "email" },
  { name: "authorized_person_name", label: "Authorized Person Name", type: "text" },
  { name: "authorized_person_id", label: "Authorized Person ID", type: "text" },
  { name: "scope_of_authorization", label: "Scope of Authorization", type: "textarea" },
  { name: "valid_from", label: "Valid From", type: "date" },
  { name: "valid_to", label: "Valid To", type: "date" },
];

export default function LOACreatePage() { return <ModuleCreate module="loa" fields={fields} />; }
