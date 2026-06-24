export default function WorkflowStatusBadge({ status }: { status: string }) {
  const display = status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border status-${status}`}>
      {display}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const cssClass = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border badge-${role.toLowerCase()}`;
  return <span className={cssClass}>{role}</span>;
}
