"use client";

import { use } from "react";
import ModuleDetail from "@/components/ModuleDetail";

export default function LOADetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ModuleDetail entity="LOA" id={id} title="LOA" />;
}
