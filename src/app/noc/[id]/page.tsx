"use client";

import { use } from "react";
import ModuleDetail from "@/components/ModuleDetail";

export default function NOCDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ModuleDetail entity="NOC" id={id} title="NOC" />;
}
