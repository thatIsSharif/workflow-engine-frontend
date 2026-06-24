"use client";

import { use } from "react";
import ModuleDetail from "@/components/ModuleDetail";

export default function FinanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ModuleDetail entity="FINANCE" id={id} title="Finance" />;
}
