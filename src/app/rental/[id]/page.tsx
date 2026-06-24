"use client";

import { use } from "react";
import ModuleDetail from "@/components/ModuleDetail";

export default function RentalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ModuleDetail entity="RENTAL" id={id} title="Rental" />;
}
