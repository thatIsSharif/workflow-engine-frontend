"use client";

import { use } from "react";
import ModuleDetail from "@/components/ModuleDetail";

export default function CancellationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ModuleDetail entity="CANCELLATION" id={id} title="Cancellation" />;
}
