import { MedicineDetailClient } from "@/components/MedicineDetailClient";

export default async function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MedicineDetailClient id={id} />;
}
