import { ModuleDetail } from "@/components/applications/module-detail";
export default async function LOADetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ModuleDetail module="loa" id={id} />;
}
