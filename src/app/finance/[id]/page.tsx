import { ModuleDetail } from "@/components/applications/module-detail";
export default async function FinanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ModuleDetail module="finance" id={id} />;
}
