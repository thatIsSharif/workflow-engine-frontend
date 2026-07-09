import { ModuleDetail } from "@/components/applications/module-detail";

export default async function NOCDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ModuleDetail module="noc" id={id} />;
}
