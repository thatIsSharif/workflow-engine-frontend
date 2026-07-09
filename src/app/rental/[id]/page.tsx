import { ModuleDetail } from "@/components/applications/module-detail";
export default async function RentalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ModuleDetail module="rental" id={id} />;
}
