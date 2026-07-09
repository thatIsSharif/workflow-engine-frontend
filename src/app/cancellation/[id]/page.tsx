import { ModuleDetail } from "@/components/applications/module-detail";
export default async function CancellationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ModuleDetail module="cancellation" id={id} />;
}
