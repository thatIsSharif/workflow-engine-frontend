import { ModuleCreate } from "@/components/applications/module-create";

const fields = [
  { name: "applicant_name", label: "Applicant Name", type: "text" },
  { name: "reference_application_id", label: "Reference Application ID", type: "text" },
  { name: "reference_application_type", label: "Reference Application Type", type: "text" },
  { name: "reason", label: "Reason", type: "textarea" },
];

export default function CancellationCreatePage() { return <ModuleCreate module="cancellation" fields={fields} />; }
