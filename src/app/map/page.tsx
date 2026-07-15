import { MapExperience } from "@/components/MapExperience";

export default async function MapPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const type = params.type === "hospital" || params.type === "pharmacy" || params.type === "emergency" ? params.type : "all";
  return <MapExperience initialType={type} />;
}
